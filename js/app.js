/* ==========================================================================
   UniVibe — Main Interactive Application Logic
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'univibe_gallery_state_v1';

  const { CAMPUSES, CATEGORIES, CREATORS, INITIAL_CONCEPTS } = window.UniVibeData;
  const { renderMerchIllustration, renderCampusEmblem, HAND_DRAWN_RECIPES } =
    window.UniVibeIllustrations;

  // -------------------- Application State --------------------
  const state = {
    concepts: [],
    creators: [],
    bookmarks: ['c-01', 'c-03'],
    activeCampus: 'all',
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'composite',
    lbPeriod: 'all',
    lbMode: 'designs',
    activeConceptId: null,
    activeDetailView: 0,
    showVibeCard: false,
    userDraftRating: {
      creativity: 5,
      identity: 5,
      practicality: 5,
    },
    activeRecipeId: HAND_DRAWN_RECIPES[0].id,
  };

  let toastTimer = null;

  // -------------------- Utilities --------------------
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeImageUrl(url) {
    const trimmed = String(url || '').trim();
    if (!trimmed) return '';
    if (
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('data:image/')
    ) {
      return trimmed;
    }
    return '';
  }

  function sanitizeColor(hex, fallback) {
    return /^#[0-9A-Fa-f]{6}$/.test(String(hex || '').trim()) ? hex.trim() : fallback;
  }

  function getCompositeScore(concept) {
    const r = concept.ratings || { creativity: 0, identity: 0, practicality: 0 };
    return Number(((r.creativity + r.identity + r.practicality) / 3).toFixed(2));
  }

  function getCampusById(campusId) {
    return CAMPUSES.find((c) => c.id === campusId) || CAMPUSES[0];
  }

  function getCreatorById(creatorId) {
    return state.creators.find((cr) => cr.id === creatorId) || state.creators[0];
  }

  function getCategoryLabel(catId) {
    const found = CATEGORIES.find((cat) => cat.id === catId);
    return found ? found.label : 'Vật phẩm';
  }

  function formatDateDisplay(isoDate) {
    if (!isoDate) return 'Hôm nay';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDate;
  }

  function showToast(message) {
    const banner = document.getElementById('toastBanner');
    const text = document.getElementById('toastText');
    if (!banner || !text) return;
    text.textContent = message;
    banner.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      banner.classList.add('hidden');
    }, 3200);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast(successMsg))
        .catch(() => showToast(successMsg));
    } else {
      showToast(successMsg);
    }
  }

  // -------------------- Persistence --------------------
  function loadState() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {
      saved = null;
    }

    const baseConcepts = INITIAL_CONCEPTS.map((c) => ({
      ...c,
      ratings: { ...c.ratings },
      comments: Array.isArray(c.comments) ? c.comments.map((cm) => ({ ...cm })) : [],
    }));
    const baseCreators = CREATORS.map((cr) => ({ ...cr, contacts: { ...cr.contacts } }));

    if (saved && Array.isArray(saved.customCreators)) {
      saved.customCreators.forEach((cr) => {
        if (cr && cr.id && !baseCreators.some((b) => b.id === cr.id)) {
          baseCreators.unshift(cr);
        }
      });
    }

    if (saved && Array.isArray(saved.customConcepts)) {
      saved.customConcepts.forEach((cc) => {
        if (cc && cc.id && !baseConcepts.some((b) => b.id === cc.id)) {
          baseConcepts.unshift(cc);
        }
      });
    }

    if (saved && saved.ratingOverrides && typeof saved.ratingOverrides === 'object') {
      baseConcepts.forEach((c) => {
        const over = saved.ratingOverrides[c.id];
        if (over && over.ratings) {
          c.ratings = { ...over.ratings };
        }
        if (over && Array.isArray(over.comments)) {
          c.comments = over.comments;
        }
      });
    }

    state.concepts = baseConcepts;
    state.creators = baseCreators;
    if (saved && Array.isArray(saved.bookmarks)) {
      state.bookmarks = saved.bookmarks;
    }
  }

  function saveState() {
    try {
      const initialIds = new Set(INITIAL_CONCEPTS.map((c) => c.id));
      const initialCreatorIds = new Set(CREATORS.map((cr) => cr.id));
      const customConcepts = state.concepts.filter((c) => !initialIds.has(c.id));
      const customCreators = state.creators.filter((cr) => !initialCreatorIds.has(cr.id));

      const ratingOverrides = {};
      state.concepts.forEach((c) => {
        ratingOverrides[c.id] = {
          ratings: c.ratings,
          comments: c.comments,
        };
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          bookmarks: state.bookmarks,
          customConcepts,
          customCreators,
          ratingOverrides,
        })
      );
    } catch (_) {
      // Ignore storage quota errors cleanly
    }
  }

  // -------------------- SVG Icon Helpers --------------------
  function iconStar(filled) {
    return `
      <svg class="w-4 h-4 ${filled ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#A1A1AA]'}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="#1E1E24" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    `;
  }

  function iconBookmark(saved) {
    return `
      <svg class="w-4 h-4 ${saved ? 'text-[#FF4D4D] fill-[#FF4D4D]' : 'text-[#1E1E24]'}" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    `;
  }

  function iconVerifiedBadge() {
    return `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold bg-[#B8F2E6] border-[1.8px] border-[#1E1E24] rounded-full" title="Đã xác thực sinh viên .edu.vn">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        .edu.vn
      </span>
    `;
  }

  // -------------------- Filtered Concepts Query --------------------
  function getFilteredConcepts() {
    const q = state.searchQuery.trim().toLowerCase();
    const filtered = state.concepts.filter((c) => {
      if (state.activeCampus !== 'all' && c.campusId !== state.activeCampus) return false;
      if (state.activeCategory !== 'all' && c.category !== state.activeCategory) return false;
      if (q) {
        const creator = getCreatorById(c.creatorId);
        const campus = getCampusById(c.campusId);
        const haystack = [
          c.title,
          c.story,
          c.campusShort,
          campus.name,
          creator.name,
          creator.handle,
          ...(c.tags || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (state.sortBy === 'identity') return b.ratings.identity - a.ratings.identity;
      if (state.sortBy === 'creativity') return b.ratings.creativity - a.ratings.creativity;
      if (state.sortBy === 'practicality') return b.ratings.practicality - a.ratings.practicality;
      if (state.sortBy === 'votes') return b.ratings.count - a.ratings.count;
      if (state.sortBy === 'newest') return String(b.createdAt).localeCompare(String(a.createdAt));
      return getCompositeScore(b) - getCompositeScore(a);
    });

    return filtered;
  }

  // -------------------- Render: Hero / Campus Hub Banner --------------------
  function renderHero() {
    const container = document.getElementById('heroContainer');
    if (!container) return;

    const totalConcepts = state.concepts.length;
    const totalVotes = state.concepts.reduce((sum, c) => sum + (c.ratings.count || 0), 0);

    if (state.activeCampus === 'all') {
      const featured =
        state.concepts.find((c) => c.featured) ||
        [...state.concepts].sort((a, b) => getCompositeScore(b) - getCompositeScore(a))[0];
      const creator = getCreatorById(featured.creatorId);
      const campus = getCampusById(featured.campusId);
      const comp = getCompositeScore(featured).toFixed(1);

      container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <!-- Left Exhibition Intro -->
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF3B0] sketch-pill text-xs sm:text-sm font-mono font-bold shadow-[3px_3px_0px_#1E1E24]">
              <span class="w-2.5 h-2.5 rounded-full bg-[#FF4D4D] border border-[#1E1E24]"></span>
              TRIỂN LÃM BẢN SẮC SINH VIÊN · PURE GALLERY
            </div>

            <h1 class="font-display text-3xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.15] text-[#1E1E24]">
              Tự tay phác thảo, <span class="sketch-highlight">bình chọn</span> &amp; lan tỏa vật phẩm mang chất <span class="sketch-highlight sketch-highlight--mint">trường mình</span>
            </h1>

            <p class="text-base sm:text-lg text-[#52525B] max-w-2xl leading-relaxed">
              Không gian mở dành riêng cho sinh viên trưng bày concept <strong>áo khoác, túi tote, dây đeo thẻ, sticker &amp; linh vật mascot</strong>. Chấm điểm 3 tiêu chí minh bạch và kết nối trực tiếp tác giả để đưa ý tưởng ra đời thật.
            </p>

            <div class="flex flex-wrap items-center gap-3.5 pt-1">
              <a href="#gallery" class="sketch-btn btn-ink text-base">
                <span>Khám phá Phòng Trưng Bày</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <button type="button" id="heroSubmitBtn" class="sketch-btn btn-postit text-base">
                <span>+ Gửi Concept Của Bạn</span>
              </button>
            </div>

            <!-- Live Metrics Strip -->
            <div class="grid grid-cols-3 gap-3 sm:gap-4 pt-3 max-w-xl">
              <div class="sketch-box p-3 sm:p-4 bg-white">
                <div class="font-mono text-2xl sm:text-3xl font-bold text-[#1E1E24]">${totalConcepts}</div>
                <div class="font-hand text-sm sm:text-base text-[#52525B]">Concept trưng bày</div>
              </div>
              <div class="sketch-box p-3 sm:p-4 bg-white">
                <div class="font-mono text-2xl sm:text-3xl font-bold text-[#2D5DA1]">${CAMPUSES.length}</div>
                <div class="font-hand text-sm sm:text-base text-[#52525B]">Không gian trường</div>
              </div>
              <div class="sketch-box p-3 sm:p-4 bg-white">
                <div class="font-mono text-2xl sm:text-3xl font-bold text-[#FF4D4D]">${totalVotes}</div>
                <div class="font-hand text-sm sm:text-base text-[#52525B]">Lượt chấm 3 tiêu chí</div>
              </div>
            </div>
          </div>

          <!-- Right Framed Spotlight Piece (Galerie Hero Card) -->
          <div class="lg:col-span-5">
            <div class="sketch-card p-4 sm:p-5 bg-white relative card-tilt-right">
              <div class="washi-tape -top-3 left-6 -rotate-6"></div>
              <div class="washi-tape washi-tape--mint -top-3 right-6 rotate-6"></div>

              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-[#FFF3B0] border-2 border-[#1E1E24] rounded-full">
                  ★ SPOTLIGHT TUẦN NÀY
                </span>
                <span class="px-2.5 py-1 text-xs font-mono font-bold text-white border-2 border-[#1E1E24] rounded-full" style="background-color: ${escapeHtml(campus.color)}">
                  ${escapeHtml(campus.shortName)}
                </span>
              </div>

              <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="block w-full text-left group cursor-pointer rounded-xl overflow-hidden border-[2.5px] border-[#1E1E24] bg-[#FDFBF7]">
                <div class="aspect-[4/3] w-full overflow-hidden">
                  ${renderMerchIllustration(featured, 0)}
                </div>
              </button>

              <div class="mt-4 space-y-3">
                <div>
                  <h2 class="font-display font-extrabold text-lg sm:text-xl leading-snug text-[#1E1E24]">
                    ${escapeHtml(featured.title)}
                  </h2>
                  <p class="text-sm text-[#52525B] mt-0.5">
                    Tác giả:
                    <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="font-semibold text-[#2D5DA1] hover:underline cursor-pointer">
                      ${escapeHtml(creator.name)}
                    </button>
                  </p>
                </div>

                <!-- 3-Criteria Snapshot -->
                <div class="p-3 bg-[#FDFBF7] border-2 border-dashed border-[#1E1E24]/40 rounded-xl space-y-1.5">
                  <div class="flex items-center justify-between text-xs font-bold">
                    <span class="font-display">Điểm trung bình 3 tiêu chí</span>
                    <span class="font-mono text-sm text-[#FF4D4D]">${comp} / 5.0 ★ (${featured.ratings.count} lượt)</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                    <div>
                      <div class="flex justify-between mb-0.5"><span>Sáng tạo</span><span>${featured.ratings.creativity.toFixed(1)}</span></div>
                      <div class="sketch-meter-track h-2"><div class="sketch-meter-fill bg-[#FF4D4D]" style="width:${(featured.ratings.creativity / 5) * 100}%"></div></div>
                    </div>
                    <div>
                      <div class="flex justify-between mb-0.5"><span>Bản sắc</span><span>${featured.ratings.identity.toFixed(1)}</span></div>
                      <div class="sketch-meter-track h-2"><div class="sketch-meter-fill bg-[#2D5DA1]" style="width:${(featured.ratings.identity / 5) * 100}%"></div></div>
                    </div>
                    <div>
                      <div class="flex justify-between mb-0.5"><span>Ứng dụng</span><span>${featured.ratings.practicality.toFixed(1)}</span></div>
                      <div class="sketch-meter-track h-2"><div class="sketch-meter-fill bg-[#10B981]" style="width:${(featured.ratings.practicality / 5) * 100}%"></div></div>
                    </div>
                  </div>
                </div>

                <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="sketch-btn btn-postit w-full text-sm">
                  Xem chi tiết 3 góc &amp; Chấm điểm
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      const heroSubmitBtn = document.getElementById('heroSubmitBtn');
      if (heroSubmitBtn) {
        heroSubmitBtn.addEventListener('click', openSubmitModal);
      }
      return;
    }

    // Active Campus Hub Dedicated Banner
    const campus = getCampusById(state.activeCampus);
    const campusConcepts = state.concepts.filter((c) => c.campusId === campus.id);
    const campusCreators = state.creators.filter((cr) => cr.campusId === campus.id);
    const campusVotes = campusConcepts.reduce((s, c) => s + (c.ratings.count || 0), 0);
    const topDesign =
      [...campusConcepts].sort((a, b) => getCompositeScore(b) - getCompositeScore(a))[0] ||
      state.concepts[0];

    container.innerHTML = `
      <div class="sketch-card p-6 sm:p-8 bg-white relative overflow-hidden">
        <div class="washi-tape washi-tape--blue -top-3 left-10 -rotate-3"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" id="backToGlobalBtn" class="sketch-btn sketch-btn-sm btn-paper text-xs">
                ← Về Khám phá Chung
              </button>
              <span class="px-3 py-1 text-xs font-mono font-bold text-white sketch-pill" style="background-color: ${escapeHtml(campus.color)}">
                CAMPUS HUB · ${escapeHtml(campus.city)}
              </span>
            </div>

            <div class="flex items-center gap-4">
              ${renderCampusEmblem(campus)}
              <div>
                <h1 class="font-display text-2xl sm:text-4xl font-extrabold text-[#1E1E24]">
                  ${escapeHtml(campus.name)}
                </h1>
                <p class="font-hand text-lg text-[#52525B] mt-0.5">“${escapeHtml(campus.motto)}”</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span class="text-xs font-mono font-bold text-[#52525B]">Màu bản sắc trường:</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-full text-xs font-mono">
                <span class="w-3.5 h-3.5 rounded-full border border-[#1E1E24]" style="background:${escapeHtml(campus.color)}"></span>
                ${escapeHtml(campus.color)}
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-full text-xs font-mono">
                <span class="w-3.5 h-3.5 rounded-full border border-[#1E1E24]" style="background:${escapeHtml(campus.secondaryColor)}"></span>
                ${escapeHtml(campus.secondaryColor)}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div class="p-3 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-xl">
                <div class="font-mono text-2xl font-bold">${campusConcepts.length}</div>
                <div class="text-xs font-hand text-[#52525B]">Concept của trường</div>
              </div>
              <div class="p-3 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-xl">
                <div class="font-mono text-2xl font-bold">${campusCreators.length}</div>
                <div class="text-xs font-hand text-[#52525B]">Tác giả đóng góp</div>
              </div>
              <div class="p-3 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-xl">
                <div class="font-mono text-2xl font-bold text-[#FF4D4D]">${campusVotes}</div>
                <div class="text-xs font-hand text-[#52525B]">Lượt đánh giá</div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            ${
              topDesign
                ? `
              <div class="p-4 bg-[#FDFBF7] border-[2.5px] border-[#1E1E24] rounded-2xl shadow-[4px_4px_0px_#1E1E24]">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-mono font-bold px-2.5 py-0.5 bg-[#FFF3B0] border border-[#1E1E24] rounded-full">TOP #1 TẠI ${escapeHtml(campus.shortName)}</span>
                  <span class="font-mono text-sm font-bold text-[#FF4D4D]">${getCompositeScore(topDesign).toFixed(1)} ★</span>
                </div>
                <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="block w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#1E1E24] bg-white cursor-pointer mb-3">
                  ${renderMerchIllustration(topDesign, 0)}
                </button>
                <div class="flex items-center justify-between gap-3">
                  <h3 class="font-display font-bold text-base truncate">${escapeHtml(topDesign.title)}</h3>
                  <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="sketch-btn sketch-btn-sm btn-postit shrink-0 text-xs">Xem</button>
                </div>
              </div>
              `
                : ''
            }
          </div>
        </div>
      </div>
    `;

    const backBtn = document.getElementById('backToGlobalBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.activeCampus = 'all';
        renderAll();
      });
    }
  }

  // -------------------- Render: Campus Hub Strip --------------------
  function renderCampusHubStrip() {
    const strip = document.getElementById('campusHubStrip');
    if (!strip) return;

    const allActive = state.activeCampus === 'all';
    const allCard = `
      <button type="button" data-campus-id="all" class="text-left p-3.5 sketch-card cursor-pointer transition-all ${
        allActive ? 'bg-[#FFF3B0] ring-2 ring-[#1E1E24]' : 'bg-white hover:bg-[#FDFBF7]'
      }">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-11 h-11 rounded-xl bg-[#1E1E24] text-[#FFF3B0] border-2 border-[#1E1E24] flex items-center justify-center font-display font-extrabold text-sm shrink-0">
            ALL
          </div>
          <div class="min-w-0">
            <div class="font-display font-extrabold text-sm truncate">Liên Trường</div>
            <div class="text-xs font-mono text-[#52525B]">${state.concepts.length} concept</div>
          </div>
        </div>
        <p class="text-xs text-[#52525B] line-clamp-2">Khám phá giao thoa sáng tạo từ tất cả các trường.</p>
      </button>
    `;

    const campusCards = CAMPUSES.map((campus) => {
      const count = state.concepts.filter((c) => c.campusId === campus.id).length;
      const isActive = state.activeCampus === campus.id;
      return `
        <button type="button" data-campus-id="${escapeHtml(campus.id)}" class="text-left p-3.5 sketch-card cursor-pointer transition-all ${
          isActive ? 'bg-[#FFF3B0] ring-2 ring-[#1E1E24]' : 'bg-white hover:bg-[#FDFBF7]'
        }">
          <div class="flex items-center gap-3 mb-2">
            ${renderCampusEmblem(campus)}
            <div class="min-w-0">
              <div class="font-display font-extrabold text-sm truncate">${escapeHtml(campus.shortName)}</div>
              <div class="text-xs font-mono text-[#52525B]">${count} mẫu · ${campus.memberCount} SV</div>
            </div>
          </div>
          <p class="text-xs text-[#52525B] line-clamp-2">${escapeHtml(campus.name)}</p>
        </button>
      `;
    }).join('');

    strip.innerHTML = allCard + campusCards;
  }

  // -------------------- Render: Category Filter Pills --------------------
  function renderCategoryFilters() {
    const bar = document.getElementById('categoryFilterBar');
    if (!bar) return;

    bar.innerHTML = CATEGORIES.map((cat) => {
      const active = state.activeCategory === cat.id;
      return `
        <button type="button" data-category-id="${escapeHtml(cat.id)}" class="sketch-btn sketch-btn-sm ${
          active ? 'chip-active' : 'btn-paper'
        } text-xs sm:text-sm">
          ${escapeHtml(cat.label)}
        </button>
      `;
    }).join('');
  }

  // -------------------- Render: Gallery Grid --------------------
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const empty = document.getElementById('galleryEmptyState');
    const countBadge = document.getElementById('galleryCountBadge');
    if (!grid || !empty || !countBadge) return;

    const items = getFilteredConcepts();
    const campusLabel =
      state.activeCampus === 'all' ? 'Liên trường' : getCampusById(state.activeCampus).shortName;
    countBadge.textContent = `${items.length} concept · ${campusLabel}`;

    if (items.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    const tapeVariants = ['', 'washi-tape--mint', 'washi-tape--blue', 'washi-tape--kraft'];

    grid.innerHTML = items
      .map((item, idx) => {
        const campus = getCampusById(item.campusId);
        const creator = getCreatorById(item.creatorId);
        const compScore = getCompositeScore(item).toFixed(1);
        const isBookmarked = state.bookmarks.includes(item.id);
        const tiltClass = idx % 2 === 0 ? 'card-tilt-left' : 'card-tilt-right';
        const cardStyle = idx % 2 === 0 ? 'sketch-card' : 'sketch-card-alt';
        const tapeClass = tapeVariants[idx % tapeVariants.length];

        return `
          <article class="${cardStyle} ${tiltClass} p-4 sm:p-5 flex flex-col relative">
            <div class="washi-tape ${tapeClass} -top-3 left-1/2 -translate-x-1/2 ${idx % 2 === 0 ? '-rotate-2' : 'rotate-2'}"></div>

            <!-- Card Top Metadata -->
            <div class="flex items-center justify-between gap-2 mb-3 pt-1">
              <div class="flex items-center gap-1.5 min-w-0">
                <button type="button" data-campus-id="${escapeHtml(campus.id)}" class="px-2.5 py-0.5 text-[11px] font-mono font-bold text-white border-[1.8px] border-[#1E1E24] rounded-full cursor-pointer shrink-0" style="background-color: ${escapeHtml(campus.color)}" title="Vào không gian ${escapeHtml(campus.name)}">
                  ${escapeHtml(campus.shortName)}
                </button>
                <span class="px-2.5 py-0.5 text-[11px] font-hand font-bold bg-[#F4EFE6] border-[1.8px] border-[#1E1E24] rounded-full truncate">
                  ${escapeHtml(getCategoryLabel(item.category))}
                </span>
              </div>

              <button type="button" data-toggle-bookmark="${escapeHtml(item.id)}" class="w-10 h-10 -mr-1 flex items-center justify-center rounded-xl border-2 border-[#1E1E24] ${
                isBookmarked ? 'bg-[#FFF3B0]' : 'bg-white hover:bg-[#F4EFE6]'
              } cursor-pointer transition-colors shrink-0" aria-label="${isBookmarked ? 'Bỏ lưu concept' : 'Lưu concept vào bộ sưu tập'}" title="${isBookmarked ? 'Đã lưu' : 'Lưu vào bộ sưu tập'}">
                ${iconBookmark(isBookmarked)}
              </button>
            </div>

            <!-- Hand-Drawn Artwork Frame -->
            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="block w-full aspect-[4/3] rounded-xl overflow-hidden border-[2.5px] border-[#1E1E24] bg-[#FDFBF7] relative group cursor-pointer mb-3.5">
              ${renderMerchIllustration(item, 0)}
              <span class="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-mono font-bold bg-white/95 border border-[#1E1E24] rounded-md opacity-90 group-hover:bg-[#FFF3B0] transition-colors">
                3 góc xem
              </span>
            </button>

            <!-- Title & Creator -->
            <div class="mb-3">
              <h3 class="font-display font-extrabold text-lg leading-snug text-[#1E1E24] line-clamp-2">
                <button type="button" data-open-concept="${escapeHtml(item.id)}" class="text-left hover:text-[#2D5DA1] cursor-pointer">
                  ${escapeHtml(item.title)}
                </button>
              </h3>
              <div class="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs text-[#52525B]">
                <span>bởi</span>
                <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="font-bold text-[#2D5DA1] hover:underline cursor-pointer">
                  ${escapeHtml(creator.name)}
                </button>
                ${creator.verifiedEdu ? iconVerifiedBadge() : ''}
              </div>
            </div>

            <!-- Palette Swatches -->
            <div class="flex items-center justify-between gap-2 mb-3.5">
              <div class="flex items-center gap-1.5" aria-label="Bảng màu thiết kế">
                ${(item.palette || [])
                  .slice(0, 4)
                  .map(
                    (hex) =>
                      `<span class="w-5 h-5 rounded-full border-2 border-[#1E1E24] inline-block" style="background:${escapeHtml(hex)}" title="${escapeHtml(hex)}"></span>`
                  )
                  .join('')}
              </div>
              <span class="text-xs font-mono text-[#52525B]">${formatDateDisplay(item.createdAt)}</span>
            </div>

            <!-- 3-Criteria Score Summary -->
            <div class="mt-auto p-3 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-xl space-y-2 mb-3.5">
              <div class="flex items-center justify-between">
                <div class="inline-flex items-center gap-1 font-mono font-bold text-sm">
                  ${iconStar(true)}
                  <span>${compScore}</span>
                  <span class="text-[#52525B] text-xs font-normal">/ 5.0</span>
                </div>
                <span class="text-xs font-mono font-bold text-[#52525B]">${item.ratings.count} lượt chấm</span>
              </div>

              <div class="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div>
                  <div class="flex justify-between text-[#52525B] mb-0.5"><span>Sáng tạo</span><strong class="text-[#1E1E24]">${item.ratings.creativity.toFixed(1)}</strong></div>
                  <div class="sketch-meter-track h-2"><div class="sketch-meter-fill bg-[#FF4D4D]" style="width:${(item.ratings.creativity / 5) * 100}%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-[#52525B] mb-0.5"><span>Bản sắc</span><strong class="text-[#1E1E24]">${item.ratings.identity.toFixed(1)}</strong></div>
                  <div class="sketch-meter-track h-2"><div class="sketch-meter-fill bg-[#2D5DA1]" style="width:${(item.ratings.identity / 5) * 100}%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-[#52525B] mb-0.5"><span>Ứng dụng</span><strong class="text-[#1E1E24]">${item.ratings.practicality.toFixed(1)}</strong></div>
                  <div class="sketch-meter-track h-2"><div class="sketch-meter-fill bg-[#10B981]" style="width:${(item.ratings.practicality / 5) * 100}%"></div></div>
                </div>
              </div>
            </div>

            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="sketch-btn sketch-btn-sm btn-paper w-full text-sm">
              Xem câu chuyện &amp; Chấm điểm
            </button>
          </article>
        `;
      })
      .join('');
  }

  // -------------------- Render: Evergreen Leaderboard --------------------
  function renderLeaderboard() {
    const content = document.getElementById('leaderboardContent');
    const scopeLabel = document.getElementById('leaderboardScopeLabel');
    if (!content || !scopeLabel) return;

    const activeCampusObj =
      state.activeCampus === 'all' ? null : getCampusById(state.activeCampus);
    scopeLabel.textContent = activeCampusObj ? activeCampusObj.shortName : 'Liên trường';

    document.querySelectorAll('.lb-period-btn').forEach((btn) => {
      btn.classList.toggle('chip-active', btn.dataset.lbPeriod === state.lbPeriod);
    });
    document.querySelectorAll('.lb-mode-btn').forEach((btn) => {
      btn.classList.toggle('chip-active', btn.dataset.lbMode === state.lbMode);
    });

    const scopedConcepts = state.concepts.filter((c) => {
      if (state.activeCampus !== 'all' && c.campusId !== state.activeCampus) return false;
      if (state.lbPeriod !== 'all' && c.timeframe !== state.lbPeriod) return false;
      return true;
    });

    if (state.lbMode === 'designs') {
      const ranked = [...scopedConcepts].sort((a, b) => {
        const diff = getCompositeScore(b) - getCompositeScore(a);
        return Math.abs(diff) > 0.01 ? diff : b.ratings.count - a.ratings.count;
      });

      if (ranked.length === 0) {
        content.innerHTML = `<div class="sketch-box p-8 bg-white text-center text-sm text-[#52525B]">Chưa có thiết kế nào trong chu kỳ lọc này. Thử chọn "Tất cả" để xem bảng xếp hạng tổng hợp!</div>`;
        return;
      }

      const top3 = ranked.slice(0, 3);
      const rest = ranked.slice(3, 8);
      const medalColors = ['bg-[#FFF3B0]', 'bg-[#B8F2E6]', 'bg-[#E6CCB2]'];

      const podiumHtml = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          ${top3
            .map((item, idx) => {
              const campus = getCampusById(item.campusId);
              const creator = getCreatorById(item.creatorId);
              return `
                <div class="sketch-card p-4 bg-white relative flex flex-col">
                  <div class="flex items-center justify-between mb-3">
                    <span class="px-3 py-1 font-display font-extrabold text-sm border-2 border-[#1E1E24] rounded-full ${medalColors[idx]}">
                      HẠNG #${idx + 1}
                    </span>
                    <span class="font-mono font-bold text-base text-[#FF4D4D]">${getCompositeScore(item).toFixed(2)} ★</span>
                  </div>
                  <button type="button" data-open-concept="${escapeHtml(item.id)}" class="block w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#1E1E24] mb-3 cursor-pointer">
                    ${renderMerchIllustration(item, 0)}
                  </button>
                  <h3 class="font-display font-bold text-base line-clamp-1 mb-1">${escapeHtml(item.title)}</h3>
                  <div class="flex items-center justify-between text-xs text-[#52525B] mt-auto pt-2 border-t border-dashed border-[#1E1E24]/25">
                    <span>${escapeHtml(creator.name)} · <strong>${escapeHtml(campus.shortName)}</strong></span>
                    <span class="font-mono">${item.ratings.count} lượt</span>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;

      const listHtml =
        rest.length > 0
          ? `
        <div class="sketch-box bg-white overflow-hidden">
          <div class="divide-y-2 divide-dashed divide-[#1E1E24]/20">
            ${rest
              .map((item, idx) => {
                const campus = getCampusById(item.campusId);
                const creator = getCreatorById(item.creatorId);
                return `
                  <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFBF7] transition-colors">
                    <div class="flex items-center gap-3.5 min-w-0">
                      <span class="w-9 h-9 rounded-xl bg-[#F4EFE6] border-2 border-[#1E1E24] font-mono font-bold text-sm flex items-center justify-center shrink-0">
                        #${idx + 4}
                      </span>
                      <div class="min-w-0">
                        <button type="button" data-open-concept="${escapeHtml(item.id)}" class="font-display font-bold text-base text-left hover:text-[#2D5DA1] truncate block cursor-pointer">
                          ${escapeHtml(item.title)}
                        </button>
                        <div class="text-xs text-[#52525B]">
                          ${escapeHtml(creator.name)} · <span class="font-mono font-bold">${escapeHtml(campus.shortName)}</span> · ${escapeHtml(getCategoryLabel(item.category))}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-4 shrink-0 text-xs font-mono">
                      <span class="hidden md:inline text-[#52525B]">Sáng tạo ${item.ratings.creativity.toFixed(1)} · Bản sắc ${item.ratings.identity.toFixed(1)} · Ứng dụng ${item.ratings.practicality.toFixed(1)}</span>
                      <span class="px-2.5 py-1 bg-[#FFF3B0] border-2 border-[#1E1E24] rounded-full font-bold">${getCompositeScore(item).toFixed(2)} ★</span>
                      <button type="button" data-open-concept="${escapeHtml(item.id)}" class="sketch-btn sketch-btn-sm btn-paper text-xs">Xem</button>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      `
          : '';

      content.innerHTML = podiumHtml + listHtml;
    } else {
      // Top Creators Mode
      const creatorScores = state.creators
        .filter((cr) => state.activeCampus === 'all' || cr.campusId === state.activeCampus)
        .map((cr) => {
          const works = scopedConcepts.filter((c) => c.creatorId === cr.id);
          const allWorks = state.concepts.filter((c) => c.creatorId === cr.id);
          const targetWorks = works.length > 0 ? works : allWorks;
          const totalVotes = targetWorks.reduce((s, c) => s + c.ratings.count, 0);
          const avgScore =
            targetWorks.length > 0
              ? targetWorks.reduce((s, c) => s + getCompositeScore(c), 0) / targetWorks.length
              : 0;
          return { creator: cr, workCount: targetWorks.length, totalVotes, avgScore };
        })
        .filter((row) => row.workCount > 0)
        .sort((a, b) => b.avgScore * 10 + b.totalVotes * 0.05 - (a.avgScore * 10 + a.totalVotes * 0.05));

      content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${creatorScores
            .map((row, idx) => {
              const campus = getCampusById(row.creator.campusId);
              return `
                <div class="sketch-card p-5 bg-white flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3.5 min-w-0">
                    <div class="w-12 h-12 rounded-full border-[2.5px] border-[#1E1E24] flex items-center justify-center font-display font-extrabold text-base shrink-0" style="background:${escapeHtml(row.creator.avatarBg)}">
                      #${idx + 1}
                    </div>
                    <div class="min-w-0">
                      <button type="button" data-open-creator="${escapeHtml(row.creator.id)}" class="font-display font-bold text-base hover:text-[#2D5DA1] truncate block cursor-pointer">
                        ${escapeHtml(row.creator.name)}
                      </button>
                      <div class="text-xs text-[#52525B] truncate">${escapeHtml(campus.shortName)} · ${row.workCount} concept</div>
                      <div class="text-xs font-mono font-bold text-[#FF4D4D] mt-0.5">${row.avgScore.toFixed(2)} ★ TB · ${row.totalVotes} lượt chấm</div>
                    </div>
                  </div>
                  <button type="button" data-open-creator="${escapeHtml(row.creator.id)}" class="sketch-btn sketch-btn-sm btn-paper text-xs shrink-0">Portfolio</button>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
    }
  }

  // -------------------- Render: Creators Section --------------------
  function renderCreatorsSection() {
    const grid = document.getElementById('creatorsGrid');
    if (!grid) return;

    const list =
      state.activeCampus === 'all'
        ? state.creators
        : state.creators.filter((cr) => cr.campusId === state.activeCampus);

    grid.innerHTML = list
      .map((creator, idx) => {
        const campus = getCampusById(creator.campusId);
        const works = state.concepts.filter((c) => c.creatorId === creator.id);
        const totalVotes = works.reduce((s, w) => s + w.ratings.count, 0);

        return `
          <article class="${idx % 2 === 0 ? 'sketch-card' : 'sketch-card-alt'} p-5 bg-white flex flex-col">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-full border-[2.5px] border-[#1E1E24] flex items-center justify-center font-display font-extrabold text-base shrink-0 shadow-[2px_2px_0px_#1E1E24]" style="background:${escapeHtml(creator.avatarBg)}">
                  ${escapeHtml(creator.initials)}
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <h3 class="font-display font-extrabold text-lg truncate">${escapeHtml(creator.name)}</h3>
                    ${creator.verifiedEdu ? iconVerifiedBadge() : ''}
                  </div>
                  <p class="text-xs font-mono text-[#52525B] truncate">${escapeHtml(creator.handle)} · ${escapeHtml(campus.shortName)}</p>
                </div>
              </div>
            </div>

            <p class="text-xs font-semibold text-[#2D5DA1] mb-2">${escapeHtml(creator.faculty)}</p>
            <p class="text-sm text-[#52525B] line-clamp-3 mb-4">${escapeHtml(creator.bio)}</p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              ${(creator.skills || [])
                .map(
                  (sk) =>
                    `<span class="px-2.5 py-0.5 text-xs font-hand font-bold bg-[#F4EFE6] border-[1.5px] border-[#1E1E24] rounded-full">${escapeHtml(sk)}</span>`
                )
                .join('')}
            </div>

            <div class="mt-auto pt-3 border-t-2 border-dashed border-[#1E1E24]/25 flex items-center justify-between gap-2">
              <span class="text-xs font-mono font-bold text-[#52525B]">${works.length} mẫu · ${totalVotes} lượt chấm</span>
              <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="sketch-btn sketch-btn-sm btn-postit text-xs">
                Xem Portfolio &amp; Liên hệ
              </button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  // -------------------- Render: Bookmarks Drawer --------------------
  function renderBookmarks() {
    const badge = document.getElementById('bookmarkCountBadge');
    const list = document.getElementById('bookmarksList');
    if (badge) badge.textContent = String(state.bookmarks.length);
    if (!list) return;

    const bookmarkedItems = state.concepts.filter((c) => state.bookmarks.includes(c.id));
    if (bookmarkedItems.length === 0) {
      list.innerHTML = `
        <div class="sketch-box p-6 bg-white text-center">
          <p class="font-display font-bold text-base mb-1">Chưa lưu concept nào</p>
          <p class="text-sm text-[#52525B]">Nhấn biểu tượng lưu trên mỗi thiết kế để gom thành bộ sưu tập tham khảo cho riêng bạn hoặc CLB.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = bookmarkedItems
      .map((item) => {
        const campus = getCampusById(item.campusId);
        return `
          <div class="sketch-box p-3.5 bg-white flex items-center gap-3">
            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="w-20 h-16 rounded-lg overflow-hidden border-2 border-[#1E1E24] shrink-0 cursor-pointer">
              ${renderMerchIllustration(item, 0)}
            </button>
            <div class="min-w-0 flex-1">
              <div class="text-[11px] font-mono font-bold text-[#2D5DA1]">${escapeHtml(campus.shortName)} · ${getCompositeScore(item).toFixed(1)} ★</div>
              <button type="button" data-open-concept="${escapeHtml(item.id)}" class="font-display font-bold text-sm text-left line-clamp-2 hover:text-[#2D5DA1] cursor-pointer">
                ${escapeHtml(item.title)}
              </button>
            </div>
            <button type="button" data-toggle-bookmark="${escapeHtml(item.id)}" class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-[#1E1E24] bg-[#F4EFE6] hover:bg-[#FECDD3] cursor-pointer shrink-0" aria-label="Xóa khỏi đã lưu">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        `;
      })
      .join('');
  }

  // -------------------- Modal 1: Concept Detail & 3-Criteria Rating --------------------
  function renderStarRow(criterionKey, selectedVal) {
    return `
      <div class="flex items-center gap-1" role="radiogroup" aria-label="Chấm điểm ${escapeHtml(criterionKey)}">
        ${[1, 2, 3, 4, 5]
          .map(
            (n) => `
          <button type="button" data-rate-criterion="${escapeHtml(criterionKey)}" data-rate-value="${n}" class="star-btn" aria-label="${n} sao">
            <svg class="w-6 h-6 ${n <= selectedVal ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#D4D4D8] fill-white'}" viewBox="0 0 24 24" stroke="#1E1E24" stroke-width="2.1" stroke-linejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        `
          )
          .join('')}
      </div>
    `;
  }

  function openConceptModal(conceptId) {
    state.activeConceptId = conceptId;
    state.activeDetailView = 0;
    state.showVibeCard = false;
    state.userDraftRating = { creativity: 5, identity: 5, practicality: 5 };
    renderConceptModal();
    document.getElementById('conceptModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeConceptModal() {
    document.getElementById('conceptModal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function renderConceptModal() {
    const body = document.getElementById('conceptModalBody');
    const concept = state.concepts.find((c) => c.id === state.activeConceptId);
    if (!body || !concept) return;

    const campus = getCampusById(concept.campusId);
    const creator = getCreatorById(concept.creatorId);
    const compScore = getCompositeScore(concept).toFixed(2);
    const isBookmarked = state.bookmarks.includes(concept.id);

    const viewButtons = [
      { idx: 0, label: 'Bản phối chính' },
      { idx: 1, label: 'Mặt sau & Chi tiết' },
      { idx: 2, label: 'Phác thảo Sketch' },
    ];

    body.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <!-- Left Column: Multi-Angle Artwork + Palette + Specs + Vibe Card -->
        <div class="lg:col-span-6 space-y-4">
          <div class="sketch-box p-3 bg-white relative">
            <div class="washi-tape washi-tape--mint -top-3 left-8 -rotate-3"></div>
            <div id="detailArtworkFrame" class="aspect-[4/3] rounded-xl overflow-hidden border-[2.5px] border-[#1E1E24] bg-[#FDFBF7]">
              ${renderMerchIllustration(concept, state.activeDetailView)}
            </div>
            <div class="grid grid-cols-3 gap-2 mt-3">
              ${viewButtons
                .map(
                  (vb) => `
                <button type="button" data-detail-view="${vb.idx}" class="sketch-btn sketch-btn-sm text-xs ${
                    state.activeDetailView === vb.idx ? 'chip-active' : 'btn-paper'
                  }">
                  ${escapeHtml(vb.label)}
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Palette & Specs -->
          <div class="sketch-box p-4 bg-white space-y-3">
            <div>
              <div class="font-display font-bold text-sm mb-2">Bảng mã màu (Nhấn để sao chép HEX)</div>
              <div class="flex flex-wrap gap-2">
                ${(concept.palette || [])
                  .map(
                    (hex) => `
                  <button type="button" data-copy-hex="${escapeHtml(hex)}" class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-full text-xs font-mono font-bold hover:bg-[#FFF3B0] cursor-pointer">
                    <span class="w-4 h-4 rounded-full border border-[#1E1E24]" style="background:${escapeHtml(hex)}"></span>
                    ${escapeHtml(hex)}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>

            <hr class="sketch-divider" />

            <div>
              <div class="font-display font-bold text-sm mb-1">Thông số &amp; Chất liệu tham khảo</div>
              <p class="text-sm text-[#52525B]">${escapeHtml(concept.specs || 'Đang cập nhật thông số sản xuất.')}</p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              ${(concept.tags || [])
                .map(
                  (tag) =>
                    `<span class="px-2.5 py-0.5 text-xs font-hand font-bold bg-[#F4EFE6] border border-[#1E1E24] rounded-full">#${escapeHtml(tag)}</span>`
                )
                .join('')}
            </div>
          </div>

          <!-- Vibe Card Share Preview (Feature from Future Expansion / Lan tỏa) -->
          <div class="flex flex-wrap items-center gap-2.5">
            <button type="button" id="toggleVibeCardBtn" class="sketch-btn sketch-btn-sm btn-blue text-xs">
              ${state.showVibeCard ? 'Ẩn Vibe Card Story' : 'Tạo Vibe Card chia sẻ Story'}
            </button>
            <button type="button" id="copyConceptLinkBtn" class="sketch-btn sketch-btn-sm btn-paper text-xs">
              Sao chép link kêu gọi chấm điểm
            </button>
          </div>

          ${
            state.showVibeCard
              ? `
            <div class="sketch-box p-4 vibe-card-sheet animate-ink-pop">
              <div class="flex items-center justify-between mb-2">
                <span class="font-display font-extrabold text-sm">UniVibe · VIBE CARD</span>
                <span class="px-2 py-0.5 text-[11px] font-mono font-bold text-white rounded-full border border-[#1E1E24]" style="background:${escapeHtml(campus.color)}">${escapeHtml(campus.shortName)}</span>
              </div>
              <div class="aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#1E1E24] bg-white mb-3">
                ${renderMerchIllustration(concept, 0)}
              </div>
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-display font-bold text-sm leading-tight">${escapeHtml(concept.title)}</div>
                  <div class="text-xs font-hand text-[#52525B]">Bởi ${escapeHtml(creator.name)} · Hãy vào chấm điểm 3 tiêu chí nhé!</div>
                </div>
                <div class="px-3 py-1.5 bg-[#FFF3B0] border-2 border-[#1E1E24] rounded-xl text-center shrink-0">
                  <div class="font-mono font-bold text-base leading-none">${compScore}★</div>
                  <div class="text-[10px] font-mono">${concept.ratings.count} votes</div>
                </div>
              </div>
            </div>
          `
              : ''
          }
        </div>

        <!-- Right Column: Vibe Story + 3-Criteria Score + Interactive Voting + Comments -->
        <div class="lg:col-span-6 space-y-5 pr-2">
          <div class="pr-10">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="px-3 py-0.5 text-xs font-mono font-bold text-white border-2 border-[#1E1E24] rounded-full" style="background:${escapeHtml(campus.color)}">
                ${escapeHtml(campus.name)}
              </span>
              <span class="px-3 py-0.5 text-xs font-hand font-bold bg-[#FFF3B0] border-2 border-[#1E1E24] rounded-full">
                ${escapeHtml(getCategoryLabel(concept.category))}
              </span>
            </div>

            <h2 id="conceptModalTitle" class="font-display text-2xl sm:text-3xl font-extrabold text-[#1E1E24] leading-tight">
              ${escapeHtml(concept.title)}
            </h2>

            <div class="flex flex-wrap items-center justify-between gap-3 mt-3 p-3 bg-white border-2 border-[#1E1E24] rounded-xl">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-full border-2 border-[#1E1E24] flex items-center justify-center font-display font-bold text-sm" style="background:${escapeHtml(creator.avatarBg)}">
                  ${escapeHtml(creator.initials)}
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="font-display font-bold text-sm text-[#2D5DA1] hover:underline cursor-pointer">
                      ${escapeHtml(creator.name)}
                    </button>
                    ${creator.verifiedEdu ? iconVerifiedBadge() : ''}
                  </div>
                  <div class="text-xs text-[#52525B]">${escapeHtml(creator.faculty)}</div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="sketch-btn sketch-btn-sm btn-mint text-xs">
                  Liên hệ sản xuất
                </button>
                <button type="button" data-toggle-bookmark="${escapeHtml(concept.id)}" class="sketch-btn sketch-btn-sm ${isBookmarked ? 'btn-postit' : 'btn-paper'} text-xs">
                  ${iconBookmark(isBookmarked)}
                  <span>${isBookmarked ? 'Đã lưu' : 'Lưu'}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- The Vibe Story -->
          <div class="p-4 bg-[#FFF3B0]/45 border-2 border-[#1E1E24] rounded-2xl">
            <div class="font-display font-bold text-sm text-[#1E1E24] mb-1">Câu chuyện bản sắc (The Vibe Story)</div>
            <p class="text-sm text-[#1E1E24]/90 leading-relaxed">${escapeHtml(concept.story)}</p>
          </div>

          <!-- Current 3-Criteria Scoreboard -->
          <div class="sketch-box p-4 bg-white space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-display font-extrabold text-base">Kết quả Đánh giá Đa tiêu chí</span>
              <span class="px-3 py-1 bg-[#FFF3B0] border-2 border-[#1E1E24] rounded-full font-mono font-bold text-sm">
                ${compScore} / 5.0 ★ (${concept.ratings.count} lượt)
              </span>
            </div>

            <div class="space-y-2.5 text-sm">
              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span>1. Độ sáng tạo &amp; Thẩm mỹ</span>
                  <span class="font-mono font-bold">${concept.ratings.creativity.toFixed(1)} / 5</span>
                </div>
                <div class="sketch-meter-track"><div class="sketch-meter-fill bg-[#FF4D4D]" style="width:${(concept.ratings.creativity / 5) * 100}%"></div></div>
              </div>
              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span>2. Bản sắc trường (${escapeHtml(campus.shortName)})</span>
                  <span class="font-mono font-bold">${concept.ratings.identity.toFixed(1)} / 5</span>
                </div>
                <div class="sketch-meter-track"><div class="sketch-meter-fill bg-[#2D5DA1]" style="width:${(concept.ratings.identity / 5) * 100}%"></div></div>
              </div>
              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span>3. Tính ứng dụng thực tế</span>
                  <span class="font-mono font-bold">${concept.ratings.practicality.toFixed(1)} / 5</span>
                </div>
                <div class="sketch-meter-track"><div class="sketch-meter-fill bg-[#10B981]" style="width:${(concept.ratings.practicality / 5) * 100}%"></div></div>
              </div>
            </div>
          </div>

          <!-- Interactive Rating & Critique Form -->
          <form id="rateConceptForm" class="sketch-box p-4 bg-[#F4EFE6]/70 space-y-3">
            <div class="font-display font-extrabold text-base">Chấm điểm 3 tiêu chí &amp; Góp ý</div>

            <div class="space-y-2 text-sm">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span class="font-semibold">Độ sáng tạo &amp; Thẩm mỹ</span>
                ${renderStarRow('creativity', state.userDraftRating.creativity)}
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span class="font-semibold">Bản sắc trường (${escapeHtml(campus.shortName)})</span>
                ${renderStarRow('identity', state.userDraftRating.identity)}
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span class="font-semibold">Tính ứng dụng thực tế</span>
                ${renderStarRow('practicality', state.userDraftRating.practicality)}
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2.5 pt-1">
              <input id="reviewerNameInput" type="text" placeholder="Tên &amp; Khóa của bạn (VD: Minh Khoa · K23)" class="sketch-input text-sm" />
              <textarea id="reviewerCommentInput" rows="2" placeholder="Nhận xét về chất liệu, màu sắc hoặc chi tiết muốn tác giả tinh chỉnh..." class="sketch-input text-sm py-2"></textarea>
            </div>

            <button type="submit" class="sketch-btn btn-postit w-full text-sm">
              Gửi điểm đánh giá &amp; Nhận xét
            </button>
          </form>

          <!-- Community Critique Comments -->
          <div class="space-y-2.5">
            <div class="font-display font-bold text-sm">Góp ý từ cộng đồng (${(concept.comments || []).length})</div>
            ${
              (concept.comments || []).length === 0
                ? `<p class="text-sm text-[#52525B] italic">Chưa có bình luận nào — hãy là người đầu tiên góp ý cho tác giả!</p>`
                : concept.comments
                    .map(
                      (cm) => `
                <div class="p-3 bg-white border-2 border-[#1E1E24] rounded-xl">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <strong class="font-display">${escapeHtml(cm.author)}</strong>
                    <span class="font-mono text-[#52525B]">${escapeHtml(cm.score ? Number(cm.score).toFixed(1) + '★ · ' : '')}${escapeHtml(cm.date)}</span>
                  </div>
                  <p class="text-sm text-[#1E1E24]">${escapeHtml(cm.text)}</p>
                </div>
              `
                    )
                    .join('')
            }
          </div>
        </div>
      </div>
    `;

    // Bind interactive listeners inside Concept Modal
    const rateForm = document.getElementById('rateConceptForm');
    if (rateForm) {
      rateForm.addEventListener('submit', handleRatingSubmit);
    }

    const toggleVibeBtn = document.getElementById('toggleVibeCardBtn');
    if (toggleVibeBtn) {
      toggleVibeBtn.addEventListener('click', () => {
        state.showVibeCard = !state.showVibeCard;
        renderConceptModal();
      });
    }

    const copyLinkBtn = document.getElementById('copyConceptLinkBtn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#concept-${concept.id}`;
        copyToClipboard(shareUrl, 'Đã sao chép link chia sẻ concept!');
      });
    }
  }

  function handleRatingSubmit(e) {
    e.preventDefault();
    const concept = state.concepts.find((c) => c.id === state.activeConceptId);
    if (!concept) return;

    const oldCount = concept.ratings.count || 0;
    const newCount = oldCount + 1;
    const { creativity, identity, practicality } = state.userDraftRating;

    concept.ratings.creativity = Number(
      (((concept.ratings.creativity * oldCount + creativity) / newCount)).toFixed(2)
    );
    concept.ratings.identity = Number(
      (((concept.ratings.identity * oldCount + identity) / newCount)).toFixed(2)
    );
    concept.ratings.practicality = Number(
      (((concept.ratings.practicality * oldCount + practicality) / newCount)).toFixed(2)
    );
    concept.ratings.count = newCount;

    const nameVal = (document.getElementById('reviewerNameInput')?.value || '').trim() || 'Sinh viên UniVibe';
    const textVal = (document.getElementById('reviewerCommentInput')?.value || '').trim();
    const avgUser = Number(((creativity + identity + practicality) / 3).toFixed(1));

    if (textVal) {
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(
        today.getMonth() + 1
      ).padStart(2, '0')}/${today.getFullYear()}`;
      concept.comments = concept.comments || [];
      concept.comments.unshift({
        id: 'cm-' + Date.now(),
        author: nameVal,
        text: textVal,
        score: avgUser,
        date: dateStr,
      });
    }

    saveState();
    renderAll();
    renderConceptModal();
    showToast(`Đã ghi nhận đánh giá ${avgUser} ★ cho "${concept.title}"!`);
  }

  // -------------------- Modal 2: Creator Profile & Portfolio --------------------
  function openCreatorModal(creatorId) {
    closeConceptModal();
    const creator = getCreatorById(creatorId);
    const campus = getCampusById(creator.campusId);
    const works = state.concepts.filter((c) => c.creatorId === creator.id);
    const totalVotes = works.reduce((s, w) => s + w.ratings.count, 0);
    const avgRating =
      works.length > 0
        ? (works.reduce((s, w) => s + getCompositeScore(w), 0) / works.length).toFixed(2)
        : '—';

    const body = document.getElementById('creatorModalBody');
    if (!body) return;

    body.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5 pr-10">
          <div class="w-20 h-20 rounded-full border-[3px] border-[#1E1E24] flex items-center justify-center font-display font-extrabold text-2xl shrink-0 shadow-[4px_4px_0px_#1E1E24]" style="background:${escapeHtml(creator.avatarBg)}">
            ${escapeHtml(creator.initials)}
          </div>
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <h2 id="creatorModalTitle" class="font-display text-2xl sm:text-3xl font-extrabold">${escapeHtml(creator.name)}</h2>
              ${creator.verifiedEdu ? iconVerifiedBadge() : ''}
            </div>
            <p class="text-sm font-mono text-[#52525B]">${escapeHtml(creator.handle)} · ${escapeHtml(campus.name)} (${escapeHtml(creator.faculty)})</p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${(creator.badges || [])
                .map(
                  (b) =>
                    `<span class="px-2.5 py-0.5 text-xs font-display font-bold bg-[#FFF3B0] border-2 border-[#1E1E24] rounded-full">${escapeHtml(b)}</span>`
                )
                .join('')}
            </div>
          </div>
        </div>

        <p class="text-sm sm:text-base text-[#1E1E24] bg-white p-4 border-2 border-[#1E1E24] rounded-2xl">${escapeHtml(creator.bio)}</p>

        <!-- Stats & Direct Production Contact Bridge -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-[#F4EFE6] border-2 border-[#1E1E24] rounded-2xl grid grid-cols-3 gap-2 text-center">
            <div>
              <div class="font-mono text-2xl font-bold">${works.length}</div>
              <div class="text-xs font-hand text-[#52525B]">Concept</div>
            </div>
            <div>
              <div class="font-mono text-2xl font-bold text-[#FF4D4D]">${avgRating}</div>
              <div class="text-xs font-hand text-[#52525B]">Điểm TB</div>
            </div>
            <div>
              <div class="font-mono text-2xl font-bold text-[#2D5DA1]">${totalVotes}</div>
              <div class="text-xs font-hand text-[#52525B]">Lượt chấm</div>
            </div>
          </div>

          <div class="p-4 bg-[#B8F2E6]/50 border-2 border-[#1E1E24] rounded-2xl space-y-2.5">
            <div class="font-display font-bold text-sm">Kết nối trực tiếp để hợp tác sản xuất (CLB / Khoa / Nhóm SV)</div>
            <div class="flex flex-wrap gap-2">
              ${
                creator.contacts && creator.contacts.email
                  ? `<button type="button" data-copy-email="${escapeHtml(creator.contacts.email)}" class="sketch-btn sketch-btn-sm btn-paper text-xs">Email: ${escapeHtml(creator.contacts.email)}</button>`
                  : ''
              }
              ${
                creator.contacts && creator.contacts.facebook
                  ? `<a href="${escapeHtml(creator.contacts.facebook)}" target="_blank" rel="noopener noreferrer" class="sketch-btn sketch-btn-sm btn-blue text-xs">Facebook</a>`
                  : ''
              }
              ${
                creator.contacts && creator.contacts.behance
                  ? `<a href="${escapeHtml(creator.contacts.behance)}" target="_blank" rel="noopener noreferrer" class="sketch-btn sketch-btn-sm btn-ink text-xs">Behance</a>`
                  : ''
              }
            </div>
          </div>
        </div>

        <!-- Creator's Designs -->
        <div>
          <h3 class="font-display font-extrabold text-lg mb-3">Tác phẩm trong Portfolio (${works.length})</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${works
              .map(
                (w) => `
              <div class="sketch-box p-3.5 bg-white flex items-center gap-3">
                <button type="button" data-open-concept="${escapeHtml(w.id)}" class="w-24 h-20 rounded-xl overflow-hidden border-2 border-[#1E1E24] shrink-0 cursor-pointer">
                  ${renderMerchIllustration(w, 0)}
                </button>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-mono font-bold text-[#FF4D4D]">${getCompositeScore(w).toFixed(1)} ★ · ${w.ratings.count} lượt</div>
                  <button type="button" data-open-concept="${escapeHtml(w.id)}" class="font-display font-bold text-sm text-left line-clamp-2 hover:text-[#2D5DA1] cursor-pointer">
                    ${escapeHtml(w.title)}
                  </button>
                  <div class="text-xs font-hand text-[#52525B] mt-0.5">${escapeHtml(getCategoryLabel(w.category))}</div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('creatorModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeCreatorModal() {
    document.getElementById('creatorModal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  // -------------------- Modal 3: Submit New Concept --------------------
  function populateCampusSelects() {
    const optionsHtml = CAMPUSES.map(
      (c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)} (${escapeHtml(c.shortName)})</option>`
    ).join('');

    const newCampus = document.getElementById('newCampus');
    if (newCampus) newCampus.innerHTML = optionsHtml;

    const promptCampus = document.getElementById('promptCampusSelect');
    if (promptCampus) promptCampus.innerHTML = optionsHtml;
  }

  function openSubmitModal() {
    const newCampus = document.getElementById('newCampus');
    if (newCampus && state.activeCampus !== 'all') {
      newCampus.value = state.activeCampus;
      applySelectedCampusColors();
    }
    document.getElementById('submitModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeSubmitModal() {
    document.getElementById('submitModal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function applySelectedCampusColors() {
    const campusId = document.getElementById('newCampus')?.value || 'hcmut';
    const campus = getCampusById(campusId);
    const c1 = document.getElementById('color1');
    const c2 = document.getElementById('color2');
    const c3 = document.getElementById('color3');
    const c4 = document.getElementById('color4');
    if (c1) c1.value = campus.color;
    if (c2) c2.value = sanitizeColor(campus.secondaryColor, '#FFF3B0');
    if (c3) c3.value = '#FF4D4D';
    if (c4) c4.value = '#FDFBF7';
  }

  function handleSubmitNewConcept(e) {
    e.preventDefault();
    const title = (document.getElementById('newTitle')?.value || '').trim();
    const campusId = document.getElementById('newCampus')?.value || 'hcmut';
    const category = document.getElementById('newCategory')?.value || 'jacket';
    const story = (document.getElementById('newStory')?.value || '').trim();
    const specs = (document.getElementById('newSpecs')?.value || '').trim() || 'Phác thảo ý tưởng cộng đồng UniVibe.';
    const tagsRaw = (document.getElementById('newTags')?.value || '').trim();
    const imageUrl = sanitizeImageUrl(document.getElementById('newImageUrl')?.value || '');
    const creatorName = (document.getElementById('newCreatorName')?.value || '').trim() || 'Sinh viên Sáng tạo';
    const creatorFaculty = (document.getElementById('newCreatorFaculty')?.value || '').trim() || 'Sinh viên trường';
    const creatorEmail = (document.getElementById('newCreatorEmail')?.value || '').trim() || 'contact@univibe.vn';

    if (!title || !story) return;

    const campus = getCampusById(campusId);
    const palette = [
      sanitizeColor(document.getElementById('color1')?.value, campus.color),
      sanitizeColor(document.getElementById('color2')?.value, '#FFF3B0'),
      sanitizeColor(document.getElementById('color3')?.value, '#FF4D4D'),
      sanitizeColor(document.getElementById('color4')?.value, '#FDFBF7'),
    ];

    const initials = creatorName
      .split(/\s+/)
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0].toUpperCase())
      .join('') || 'SV';

    const creatorId = 'cr-custom-' + Date.now();
    const newCreator = {
      id: creatorId,
      name: creatorName,
      handle: '@' + creatorName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || '@student',
      campusId,
      faculty: creatorFaculty,
      verifiedEdu: creatorEmail.endsWith('.edu.vn'),
      avatarBg: '#FFF3B0',
      initials,
      bio: `Tác giả đóng góp concept "${title}" cho không gian ${campus.name}.`,
      skills: [getCategoryLabel(category), 'Concept Design'],
      badges: ['Tác giả Mới'],
      contacts: {
        email: creatorEmail,
        facebook: 'https://facebook.com',
        behance: '',
        instagram: '',
      },
    };

    const todayIso = new Date().toISOString().slice(0, 10);
    const conceptId = 'c-custom-' + Date.now();
    const tags = tagsRaw
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5)
      : [campus.shortName, getCategoryLabel(category)];

    const newConcept = {
      id: conceptId,
      title,
      campusId,
      campusShort: campus.shortName,
      category,
      creatorId,
      createdAt: todayIso,
      timeframe: 'week',
      featured: false,
      palette,
      tags,
      story,
      specs,
      customImageUrl: imageUrl,
      ratings: {
        creativity: 5.0,
        identity: 5.0,
        practicality: 4.8,
        count: 1,
      },
      comments: [],
    };

    state.creators.unshift(newCreator);
    state.concepts.unshift(newConcept);
    state.sortBy = 'newest';
    const sortEl = document.getElementById('sortSelect');
    if (sortEl) sortEl.value = 'newest';

    saveState();
    e.target.reset();
    closeSubmitModal();
    renderAll();
    showToast(`Đã đăng "${title}" lên Phòng Trưng Bày ${campus.shortName}!`);
  }

  // -------------------- Modal 4: Hand-Drawn Prompt Studio --------------------
  function openPromptModal() {
    renderPromptStudio();
    document.getElementById('promptModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closePromptModal() {
    document.getElementById('promptModal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function renderPromptStudio() {
    const listEl = document.getElementById('promptRecipeList');
    const outputEl = document.getElementById('generatedPromptOutput');
    const subjectEl = document.getElementById('promptSubjectInput');
    const campusEl = document.getElementById('promptCampusSelect');
    if (!listEl || !outputEl) return;

    listEl.innerHTML = HAND_DRAWN_RECIPES.map((rec) => {
      const active = rec.id === state.activeRecipeId;
      return `
        <button type="button" data-recipe-id="${escapeHtml(rec.id)}" class="text-left p-3.5 rounded-2xl border-[2.5px] border-[#1E1E24] cursor-pointer transition-all ${
          active ? 'bg-[#FFF3B0] shadow-[4px_4px_0px_#1E1E24]' : 'bg-white hover:bg-[#F4EFE6]'
        }">
          <div class="text-[11px] font-mono font-bold text-[#2D5DA1] mb-0.5">${escapeHtml(rec.badge)}</div>
          <div class="font-display font-bold text-sm text-[#1E1E24]">${escapeHtml(rec.name)}</div>
          <p class="text-xs text-[#52525B] mt-1">${escapeHtml(rec.desc)}</p>
        </button>
      `;
    }).join('');

    const activeRecipe =
      HAND_DRAWN_RECIPES.find((r) => r.id === state.activeRecipeId) || HAND_DRAWN_RECIPES[0];
    const subject = (subjectEl && subjectEl.value.trim()) || 'campus varsity jacket';
    const campus = getCampusById((campusEl && campusEl.value) || 'hcmut');
    const colors = `${campus.color} and ${campus.secondaryColor} with warm cream accents`;

    outputEl.textContent = activeRecipe.template
      .replace('{subject}', subject)
      .replace('{campus}', `${campus.name} (${campus.shortName})`)
      .replace('{colors}', colors);
  }

  // -------------------- Bookmarks Drawer --------------------
  function openBookmarksDrawer() {
    renderBookmarks();
    document.getElementById('bookmarksDrawer').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeBookmarksDrawer() {
    document.getElementById('bookmarksDrawer').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function toggleBookmark(conceptId) {
    const idx = state.bookmarks.indexOf(conceptId);
    if (idx === -1) {
      state.bookmarks.push(conceptId);
      showToast('Đã lưu thiết kế vào Bộ sưu tập!');
    } else {
      state.bookmarks.splice(idx, 1);
      showToast('Đã bỏ khỏi Bộ sưu tập.');
    }
    saveState();
    renderGallery();
    renderBookmarks();
    if (state.activeConceptId === conceptId && !document.getElementById('conceptModal').classList.contains('hidden')) {
      renderConceptModal();
    }
  }

  // -------------------- Full Re-Render --------------------
  function renderAll() {
    renderHero();
    renderCampusHubStrip();
    renderCategoryFilters();
    renderGallery();
    renderLeaderboard();
    renderCreatorsSection();
    renderBookmarks();
  }

  // -------------------- Event Binding --------------------
  function bindEvents() {
    // Global click delegation
    document.addEventListener('click', (e) => {
      const campusBtn = e.target.closest('[data-campus-id]');
      if (campusBtn) {
        state.activeCampus = campusBtn.dataset.campusId;
        renderAll();
        return;
      }

      const categoryBtn = e.target.closest('[data-category-id]');
      if (categoryBtn) {
        state.activeCategory = categoryBtn.dataset.categoryId;
        renderCategoryFilters();
        renderGallery();
        return;
      }

      const openConceptBtn = e.target.closest('[data-open-concept]');
      if (openConceptBtn) {
        closeBookmarksDrawer();
        closeCreatorModal();
        openConceptModal(openConceptBtn.dataset.openConcept);
        return;
      }

      const openCreatorBtn = e.target.closest('[data-open-creator]');
      if (openCreatorBtn) {
        openCreatorModal(openCreatorBtn.dataset.openCreator);
        return;
      }

      const bookmarkBtn = e.target.closest('[data-toggle-bookmark]');
      if (bookmarkBtn) {
        toggleBookmark(bookmarkBtn.dataset.toggleBookmark);
        return;
      }

      const lbPeriodBtn = e.target.closest('[data-lb-period]');
      if (lbPeriodBtn) {
        state.lbPeriod = lbPeriodBtn.dataset.lbPeriod;
        renderLeaderboard();
        return;
      }

      const lbModeBtn = e.target.closest('[data-lb-mode]');
      if (lbModeBtn) {
        state.lbMode = lbModeBtn.dataset.lbMode;
        renderLeaderboard();
        return;
      }

      const detailViewBtn = e.target.closest('[data-detail-view]');
      if (detailViewBtn) {
        state.activeDetailView = Number(detailViewBtn.dataset.detailView) || 0;
        renderConceptModal();
        return;
      }

      const starBtn = e.target.closest('[data-rate-criterion]');
      if (starBtn) {
        const key = starBtn.dataset.rateCriterion;
        const val = Number(starBtn.dataset.rateValue) || 5;
        if (Object.prototype.hasOwnProperty.call(state.userDraftRating, key)) {
          state.userDraftRating[key] = val;
          renderConceptModal();
        }
        return;
      }

      const hexBtn = e.target.closest('[data-copy-hex]');
      if (hexBtn) {
        const hex = hexBtn.dataset.copyHex;
        copyToClipboard(hex, `Đã sao chép mã màu ${hex}`);
        return;
      }

      const emailBtn = e.target.closest('[data-copy-email]');
      if (emailBtn) {
        const email = emailBtn.dataset.copyEmail;
        copyToClipboard(email, `Đã sao chép email liên hệ: ${email}`);
        return;
      }

      const recipeBtn = e.target.closest('[data-recipe-id]');
      if (recipeBtn) {
        state.activeRecipeId = recipeBtn.dataset.recipeId;
        renderPromptStudio();
      }
    });

    // Search & Sort
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderGallery();
      });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderGallery();
      });
    }

    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.activeCampus = 'all';
        state.activeCategory = 'all';
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        renderAll();
      });
    }

    // Modal & Drawer Triggers
    document.getElementById('closeConceptModalBtn')?.addEventListener('click', closeConceptModal);
    document.getElementById('closeCreatorModalBtn')?.addEventListener('click', closeCreatorModal);
    document.getElementById('openSubmitModalBtn')?.addEventListener('click', openSubmitModal);
    document.getElementById('closeSubmitModalBtn')?.addEventListener('click', closeSubmitModal);
    document.getElementById('openPromptModalBtn')?.addEventListener('click', openPromptModal);
    document.getElementById('mobilePromptBtn')?.addEventListener('click', () => {
      document.getElementById('mobileMenuPanel')?.classList.add('hidden');
      openPromptModal();
    });
    document.getElementById('closePromptModalBtn')?.addEventListener('click', closePromptModal);
    document.getElementById('openBookmarksBtn')?.addEventListener('click', openBookmarksDrawer);
    document.getElementById('closeBookmarksBtn')?.addEventListener('click', closeBookmarksDrawer);

    document.getElementById('switchToPromptBtn')?.addEventListener('click', () => {
      closeSubmitModal();
      openPromptModal();
    });

    document.getElementById('applyCampusColorsBtn')?.addEventListener('click', applySelectedCampusColors);
    document.getElementById('submitConceptForm')?.addEventListener('submit', handleSubmitNewConcept);

    document.getElementById('promptSubjectInput')?.addEventListener('input', renderPromptStudio);
    document.getElementById('promptCampusSelect')?.addEventListener('change', renderPromptStudio);
    document.getElementById('copyPromptBtn')?.addEventListener('click', () => {
      const text = document.getElementById('generatedPromptOutput')?.textContent || '';
      copyToClipboard(text, 'Đã sao chép Prompt vẽ tay!');
    });

    // Mobile nav toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobilePanel = document.getElementById('mobileMenuPanel');
    if (mobileBtn && mobilePanel) {
      mobileBtn.addEventListener('click', () => {
        const isHidden = mobilePanel.classList.toggle('hidden');
        mobileBtn.setAttribute('aria-expanded', String(!isHidden));
      });
      mobilePanel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobilePanel.classList.add('hidden');
          mobileBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Backdrop clicks & ESC key
    ['conceptModal', 'creatorModal', 'submitModal', 'promptModal'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', (e) => {
        if (!e.target.closest('.sketch-card, .sketch-card-alt')) {
          el.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    });

    const bookmarksDrawerEl = document.getElementById('bookmarksDrawer');
    if (bookmarksDrawerEl) {
      bookmarksDrawerEl.addEventListener('click', (e) => {
        if (e.target === bookmarksDrawerEl) {
          closeBookmarksDrawer();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeConceptModal();
        closeCreatorModal();
        closeSubmitModal();
        closePromptModal();
        closeBookmarksDrawer();
      }
    });
  }

  // -------------------- Initialize --------------------
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    populateCampusSelects();
    bindEvents();
    renderAll();

    const hash = window.location.hash || '';
    if (hash.startsWith('#concept-')) {
      const targetId = hash.slice('#concept-'.length);
      if (state.concepts.some((c) => c.id === targetId)) {
        openConceptModal(targetId);
      }
    }
  });
})();
