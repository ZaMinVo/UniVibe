/* ==========================================================================
   UniVibe — Main Interactive Application Logic
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'univibe_gallery_state_v3';

  const { CAMPUSES, CATEGORIES, CREATORS, INITIAL_CONCEPTS } = window.UniVibeData;
  const { renderMerchIllustration, renderCampusEmblem } = window.UniVibeIllustrations;

  // -------------------- Application State --------------------
  const state = {
    concepts: [],
    creators: [],
    bookmarks: [],
    campusScope: 'vnuhcm',
    activeCampus: 'all',
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    activeConceptId: null,
    activeDetailView: 0,
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

  // -------------------- Persistence (Bookmarks Only — Showcase Mode) --------------------
  function loadState() {
    let saved = null;
    try {
      localStorage.removeItem('univibe_gallery_state_v1');
      localStorage.removeItem('univibe_gallery_state_v2');
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {
      saved = null;
    }

    state.concepts = INITIAL_CONCEPTS.map((c) => ({ ...c }));
    state.creators = CREATORS.map((cr) => ({ ...cr, contacts: { ...cr.contacts } }));

    const validIds = new Set(state.concepts.map((c) => c.id));
    if (saved && Array.isArray(saved.bookmarks)) {
      state.bookmarks = saved.bookmarks.filter((id) => validIds.has(id));
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          bookmarks: state.bookmarks,
        })
      );
    } catch (_) {
      // Ignore storage quota errors cleanly
    }
  }

  // -------------------- SVG Icon Helpers --------------------
  function iconBookmark(saved) {
    return `
      <svg class="w-4 h-4 ${saved ? 'text-[#FF4D4D] fill-[#FF4D4D]' : 'text-[#1E1E24]'}" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
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
          c.specs,
          c.campusShort,
          c.source ? `Nguồn ${c.source}` : '',
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
      if (state.sortBy === 'newest') return String(b.createdAt).localeCompare(String(a.createdAt));
      if (state.sortBy === 'category') return String(a.category).localeCompare(String(b.category));
      if (state.sortBy === 'title') return String(a.title).localeCompare(String(b.title), 'vi');
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    return filtered;
  }

  // -------------------- Render: Hero / Campus Hub Banner --------------------
  function renderHero() {
    const container = document.getElementById('heroContainer');
    if (!container) return;

    const totalConcepts = state.concepts.length;

    if (state.activeCampus === 'all') {
      const featured = state.concepts.find((c) => c.featured) || state.concepts[0];
      const creator = getCreatorById(featured.creatorId);
      const campus = getCampusById(featured.campusId);

      container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <!-- Left Exhibition Intro -->
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF3B0] sketch-pill text-xs sm:text-sm font-mono font-bold shadow-[3px_3px_0px_#1E1E24]">
              <span class="w-2.5 h-2.5 rounded-full bg-[#2D5DA1] border border-[#1E1E24]"></span>
              TRIỂN LÃM BẢN SẮC SINH VIÊN · CHỈ TRƯNG BÀY (SHOWCASE ONLY)
            </div>

            <h1 class="font-display text-3xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.15] text-[#1E1E24]">
              Không gian <span class="sketch-highlight">trưng bày</span> ý tưởng vật phẩm mang đậm bản sắc <span class="sketch-highlight sketch-highlight--mint">trường mình</span>
            </h1>

            <p class="text-base sm:text-lg text-[#52525B] max-w-2xl leading-relaxed">
              Bộ sưu tập trưng bày các mẫu thiết kế thực tế tối giản (<strong>Túi Tote, Nón lưỡi trai, Áo thun &amp; Lót chuột</strong>) đồng bộ hệ thống nhận diện thương hiệu đại học (Nguồn: <strong>HCMUT</strong>). Xem phối cảnh Studio 3 góc độ, bảng màu chuẩn và thông số chất liệu.
            </p>

            <div class="flex flex-wrap items-center gap-3.5 pt-1">
              <a href="#gallery" class="sketch-btn btn-ink text-base">
                <span>Khám phá Phòng Trưng Bày</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a href="#feature-work" class="sketch-btn btn-postit text-base">
                <span>Feature Work (Tính năng thêm mẫu)</span>
              </a>
            </div>

            <!-- Showcase Metrics Strip -->
            <div class="grid grid-cols-3 gap-3 sm:gap-4 pt-3 max-w-xl">
              <div class="sketch-box p-3 sm:p-4 bg-white">
                <div class="font-mono text-2xl sm:text-3xl font-bold text-[#1E1E24]">${totalConcepts}</div>
                <div class="font-hand text-sm sm:text-base text-[#52525B]">Concept trưng bày</div>
              </div>
              <div class="sketch-box p-3 sm:p-4 bg-white">
                <div class="font-mono text-2xl sm:text-3xl font-bold text-[#2D5DA1]">3 góc</div>
                <div class="font-hand text-sm sm:text-base text-[#52525B]">Phối cảnh Studio / mẫu</div>
              </div>
              <div class="sketch-box p-3 sm:p-4 bg-white">
                <div class="font-mono text-2xl sm:text-3xl font-bold text-[#FF4D4D]">${CAMPUSES.length}</div>
                <div class="font-hand text-sm sm:text-base text-[#52525B]">Không gian bản sắc trường</div>
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
                  ★ MẪU TRƯNG BÀY TIÊU BIỂU
                </span>
                <span class="px-2.5 py-1 text-xs font-mono font-bold text-white border-2 border-[#1E1E24] rounded-full" style="background-color: ${escapeHtml(campus.color)}">
                  ${escapeHtml(campus.shortName)}
                </span>
              </div>

              <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="block w-full text-left group cursor-pointer rounded-xl overflow-hidden border-[2.5px] border-[#1E1E24] bg-[#F4F6F9]">
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
                    <span class="mx-1.5 text-[#CBD5E1]">·</span>
                    <span class="font-mono text-xs font-bold text-[#030391]">Nguồn: ${escapeHtml(featured.source || 'HCMUT')}</span>
                  </p>
                </div>

                <!-- Palette & Material Specs Snapshot -->
                <div class="p-3 bg-[#FDFBF7] border-2 border-dashed border-[#1E1E24]/40 rounded-xl space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-display font-bold text-xs">Bảng màu &amp; Chất liệu</span>
                    <div class="flex items-center gap-1.5">
                      ${(featured.palette || [])
                        .slice(0, 4)
                        .map(
                          (hex) =>
                            `<span class="w-4 h-4 rounded-full border border-[#1E1E24] inline-block" style="background:${escapeHtml(hex)}" title="${escapeHtml(hex)}"></span>`
                        )
                        .join('')}
                    </div>
                  </div>
                  <p class="text-xs text-[#52525B] leading-relaxed line-clamp-2">${escapeHtml(featured.specs)}</p>
                </div>

                <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="sketch-btn btn-postit w-full text-sm">
                  Xem phối cảnh 3 góc &amp; Thông số
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Active Campus Hub Dedicated Banner
    const campus = getCampusById(state.activeCampus);
    const campusConcepts = state.concepts.filter((c) => c.campusId === campus.id);
    const topDesign = campusConcepts.find((c) => c.featured) || campusConcepts[0] || null;

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
                <div class="text-xs font-hand text-[#52525B]">Mẫu trưng bày</div>
              </div>
              <div class="p-3 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-xl">
                <div class="font-mono text-2xl font-bold text-[#2D5DA1]">3 góc</div>
                <div class="text-xs font-hand text-[#52525B]">Phối cảnh Studio</div>
              </div>
              <div class="p-3 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-xl">
                <div class="font-mono text-xl sm:text-2xl font-bold text-[#1E1E24]">Ẩn danh</div>
                <div class="text-xs font-hand text-[#52525B]">Lưu trữ thiết kế</div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            ${
              topDesign
                ? `
              <div class="p-4 bg-[#FDFBF7] border-[2.5px] border-[#1E1E24] rounded-2xl shadow-[4px_4px_0px_#1E1E24]">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-mono font-bold px-2.5 py-0.5 bg-[#FFF3B0] border border-[#1E1E24] rounded-full">MẪU TRƯNG BÀY TẠI ${escapeHtml(campus.shortName)}</span>
                  <span class="text-xs font-mono font-bold text-[#52525B]">Ẩn danh</span>
                </div>
                <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="block w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#1E1E24] bg-[#F4F6F9] cursor-pointer mb-3">
                  ${renderMerchIllustration(topDesign, 0)}
                </button>
                <div class="flex items-center justify-between gap-3">
                  <h3 class="font-display font-bold text-base truncate">${escapeHtml(topDesign.title)}</h3>
                  <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="sketch-btn sketch-btn-sm btn-postit shrink-0 text-xs">Xem chi tiết</button>
                </div>
              </div>
              `
                : `
              <div class="p-6 bg-[#FDFBF7] border-[2.5px] border-dashed border-[#1E1E24] rounded-2xl text-center space-y-3">
                <div class="font-display font-bold text-base">Không gian ${escapeHtml(campus.shortName)} chưa có mẫu trưng bày</div>
                <p class="text-xs text-[#52525B] leading-relaxed">
                  Trang hiện tại hoạt động ở chế độ <strong>Chỉ trưng bày (Showcase-Only)</strong> với bộ sưu tập HCMUT. Tính năng cho phép người dùng tự thêm mẫu cho các trường khác thuộc mục <strong>Feature Work</strong>.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button type="button" id="viewHcmutShowcaseBtn" class="sketch-btn sketch-btn-sm btn-postit text-xs">Xem bộ sưu tập HCMUT</button>
                  <a href="#feature-work" class="sketch-btn sketch-btn-sm btn-paper text-xs">Xem Feature Work</a>
                </div>
              </div>
              `
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
    const viewHcmutBtn = document.getElementById('viewHcmutShowcaseBtn');
    if (viewHcmutBtn) {
      viewHcmutBtn.addEventListener('click', () => {
        state.activeCampus = 'hcmut';
        renderAll();
      });
    }
  }

  // -------------------- Render: Campus Hub Strip --------------------
  function renderCampusHubStrip() {
    const strip = document.getElementById('campusHubStrip');
    if (!strip) return;

    document.querySelectorAll('.campus-scope-btn').forEach((btn) => {
      const isMatch = btn.dataset.campusScope === state.campusScope;
      btn.classList.toggle('chip-active', isMatch);
      btn.classList.toggle('btn-paper', !isMatch);
    });

    const orderedCampuses = [...CAMPUSES].sort(
      (a, b) => Number(Boolean(b.isVnuHcm)) - Number(Boolean(a.isVnuHcm))
    );
    const visibleCampuses =
      state.campusScope === 'vnuhcm'
        ? orderedCampuses.filter((c) => c.isVnuHcm || c.id === state.activeCampus)
        : orderedCampuses;

    const allActive = state.activeCampus === 'all';
    const allCard = `
      <button type="button" data-campus-id="all" class="text-left p-3.5 sketch-card cursor-pointer transition-all flex flex-col ${
        allActive ? 'bg-[#FFF3B0] ring-2 ring-[#1E1E24]' : 'bg-white hover:bg-[#FDFBF7]'
      }">
        <div class="flex items-center gap-2.5 mb-2">
          <div class="w-11 h-11 rounded-xl bg-[#1E1E24] text-[#FFF3B0] border-2 border-[#1E1E24] flex items-center justify-center font-display font-extrabold text-sm shrink-0">
            ALL
          </div>
          <div class="min-w-0">
            <div class="font-display font-extrabold text-sm leading-tight">Liên Trường</div>
            <div class="text-[11px] font-mono text-[#52525B] whitespace-nowrap mt-0.5">${state.concepts.length} concept</div>
          </div>
        </div>
        <p class="text-xs text-[#52525B] line-clamp-2 mt-auto">Khám phá các mẫu vật phẩm trưng bày từ các trường.</p>
      </button>
    `;

    const campusCards = visibleCampuses.map((campus) => {
      const count = state.concepts.filter((c) => c.campusId === campus.id).length;
      const isActive = state.activeCampus === campus.id;
      const vnuBadge = campus.isVnuHcm
        ? `<span class="inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#E0F2FE] text-[#030391] border border-[#1E1E24] rounded">ĐHQG-HCM</span>`
        : '';

      return `
        <button type="button" data-campus-id="${escapeHtml(campus.id)}" class="text-left p-3.5 sketch-card cursor-pointer transition-all flex flex-col ${
          isActive ? 'bg-[#FFF3B0] ring-2 ring-[#1E1E24]' : 'bg-white hover:bg-[#FDFBF7]'
        }">
          <div class="flex items-center gap-2.5 mb-2">
            ${renderCampusEmblem(campus)}
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-1">
                <span class="font-display font-extrabold text-sm leading-tight">${escapeHtml(campus.shortName)}</span>
              </div>
              <div class="text-[11px] font-mono text-[#52525B] whitespace-nowrap mt-0.5">${count > 0 ? `${count} concept` : 'Đang biên tập'}</div>
            </div>
          </div>
          <div class="mt-auto space-y-1">
            ${vnuBadge}
            <p class="text-xs text-[#52525B] line-clamp-2">${escapeHtml(campus.name)}</p>
          </div>
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

            <!-- Realistic Studio Artwork Frame -->
            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="block w-full aspect-[4/3] rounded-xl overflow-hidden border-[2.5px] border-[#1E1E24] bg-[#F4F6F9] relative group cursor-pointer mb-3.5">
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
              <div class="flex flex-wrap items-center justify-between gap-1.5 mt-1.5 text-xs text-[#52525B]">
                <div>
                  <span>bởi</span>
                  <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="font-bold text-[#2D5DA1] hover:underline cursor-pointer">
                    ${escapeHtml(creator.name)}
                  </button>
                  <span class="mx-1 text-[#CBD5E1]">·</span>
                  <span class="font-mono font-bold text-[#030391]">Nguồn: ${escapeHtml(item.source || 'HCMUT')}</span>
                </div>
                <span class="font-mono">${formatDateDisplay(item.createdAt)}</span>
              </div>
            </div>

            <!-- Specs & Brand Palette Snapshot -->
            <div class="mt-auto p-3 bg-[#FDFBF7] border-2 border-[#1E1E24] rounded-xl space-y-2 mb-3.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-display font-bold text-[#1E1E24]">Thông số &amp; Bảng màu chuẩn</span>
                <div class="flex items-center gap-1" aria-label="Bảng màu thiết kế">
                  ${(item.palette || [])
                    .slice(0, 4)
                    .map(
                      (hex) =>
                        `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-[#1E1E24] rounded text-[10px] font-mono" title="${escapeHtml(hex)}"><span class="w-2.5 h-2.5 rounded-full border border-[#1E1E24]" style="background:${escapeHtml(hex)}"></span></span>`
                    )
                    .join('')}
                </div>
              </div>
              <p class="text-xs text-[#52525B] line-clamp-2 leading-relaxed">${escapeHtml(item.specs || 'Thiết kế tối giản chuẩn nhận diện.')}</p>
              <div class="flex flex-wrap gap-1 pt-0.5">
                ${(item.tags || [])
                  .slice(0, 3)
                  .map(
                    (tag) =>
                      `<span class="px-2 py-0.5 text-[10px] font-hand font-bold bg-[#F4EFE6] border border-[#1E1E24] rounded-full">#${escapeHtml(tag)}</span>`
                  )
                  .join('')}
              </div>
            </div>

            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="sketch-btn sketch-btn-sm btn-paper w-full text-sm">
              Xem phối cảnh 3 góc &amp; Thông số
            </button>
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
            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="w-20 h-16 rounded-lg overflow-hidden border-2 border-[#1E1E24] shrink-0 cursor-pointer bg-[#F4F6F9]">
              ${renderMerchIllustration(item, 0, { compact: true })}
            </button>
            <div class="min-w-0 flex-1">
              <div class="text-[11px] font-mono font-bold text-[#2D5DA1]">${escapeHtml(campus.shortName)} · ${escapeHtml(getCategoryLabel(item.category))}</div>
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

  // -------------------- Modal 1: Concept Detail Showcase --------------------
  function openConceptModal(conceptId) {
    state.activeConceptId = conceptId;
    state.activeDetailView = 0;
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
    const isBookmarked = state.bookmarks.includes(concept.id);

    const viewButtons =
      concept.id === 'c-hcmut-tee-01'
        ? [
            { idx: 0, label: 'Áo Polo Trắng #1' },
            { idx: 1, label: 'Mặt Sau & Tay BK' },
            { idx: 2, label: 'Thông Số Nhận Diện' },
          ]
        : concept.id === 'c-hcmut-tee-02'
          ? [
              { idx: 0, label: 'Polo Navy Zipper' },
              { idx: 1, label: 'Áo Thun Thể Thao' },
              { idx: 2, label: 'Thông Số Nhận Diện' },
            ]
          : concept.category === 'cap'
            ? [
                { idx: 0, label: 'Nón Navy Thực Tế' },
                { idx: 1, label: 'Bộ Merch Kit HCMUT' },
                { idx: 2, label: 'Chi Tiết Khắc Kim Loại' },
              ]
            : concept.category === 'tote'
              ? [
                  { idx: 0, label: 'Túi Tote Canvas' },
                  { idx: 1, label: 'Góc Studio HCMUT' },
                  { idx: 2, label: 'Đeo Thực Tế' },
                ]
              : [
                  { idx: 0, label: 'Mockup Mặt Trước' },
                  { idx: 1, label: 'Mặt Sau & Chi Tiết' },
                  { idx: 2, label: 'Thông Số Nhận Diện' },
                ];

    body.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <!-- Left Column: Multi-Angle Studio Artwork + Link Copy -->
        <div class="lg:col-span-6 space-y-4">
          <div class="sketch-box p-3 bg-white relative">
            <div class="washi-tape washi-tape--mint -top-3 left-8 -rotate-3"></div>
            <div id="detailArtworkFrame" class="aspect-[4/3] rounded-xl overflow-hidden border-[2.5px] border-[#1E1E24] bg-[#F4F6F9]">
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

          <div class="flex flex-wrap items-center gap-2.5">
            <button type="button" id="copyConceptLinkBtn" class="sketch-btn sketch-btn-sm btn-paper text-xs">
              Sao chép link mẫu trưng bày
            </button>
            <button type="button" data-toggle-bookmark="${escapeHtml(concept.id)}" class="sketch-btn sketch-btn-sm ${isBookmarked ? 'btn-postit' : 'btn-mint'} text-xs">
              ${iconBookmark(isBookmarked)}
              <span>${isBookmarked ? 'Đã lưu trong bộ sưu tập' : 'Lưu mẫu này'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Showcase Info (Story + Palette + Specs + Feature Work Notice) -->
        <div class="lg:col-span-6 space-y-5 pr-2">
          <div class="pr-10">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="px-3 py-0.5 text-xs font-mono font-bold text-white border-2 border-[#1E1E24] rounded-full" style="background:${escapeHtml(campus.color)}">
                ${escapeHtml(campus.name)}
              </span>
              <span class="px-3 py-0.5 text-xs font-hand font-bold bg-[#FFF3B0] border-2 border-[#1E1E24] rounded-full">
                ${escapeHtml(getCategoryLabel(concept.category))}
              </span>
              <span class="px-3 py-0.5 text-xs font-mono font-bold bg-[#B8F2E6] border-2 border-[#1E1E24] rounded-full">
                Chế độ: Chỉ Trưng Bày
              </span>
              <span class="px-3 py-0.5 text-xs font-mono font-bold bg-[#E0F2FE] text-[#030391] border-2 border-[#1E1E24] rounded-full">
                Nguồn: ${escapeHtml(concept.source || 'HCMUT')}
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
                  <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="font-display font-bold text-sm text-[#2D5DA1] hover:underline cursor-pointer block text-left">
                    ${escapeHtml(creator.name)}
                  </button>
                  <div class="text-xs text-[#52525B]">${escapeHtml(creator.faculty)} · Nguồn: ${escapeHtml(concept.source || 'HCMUT')} · ${formatDateDisplay(concept.createdAt)}</div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="sketch-btn sketch-btn-sm btn-mint text-xs">
                  Hồ sơ Ẩn danh
                </button>
                <button type="button" data-toggle-bookmark="${escapeHtml(concept.id)}" class="sketch-btn sketch-btn-sm ${isBookmarked ? 'btn-postit' : 'btn-paper'} text-xs">
                  ${iconBookmark(isBookmarked)}
                  <span>${isBookmarked ? 'Đã lưu' : 'Lưu mẫu'}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- The Vibe Story -->
          <div class="p-4 bg-[#FFF3B0]/45 border-2 border-[#1E1E24] rounded-2xl">
            <div class="font-display font-bold text-sm text-[#1E1E24] mb-1">Câu chuyện bản sắc (The Vibe Story)</div>
            <p class="text-sm text-[#1E1E24]/90 leading-relaxed">${escapeHtml(concept.story)}</p>
          </div>

          <!-- Official Palette & Material Specs -->
          <div class="sketch-box p-4 bg-white space-y-3">
            <div>
              <div class="font-display font-bold text-sm mb-2">Bảng mã màu chuẩn nhận diện (Nhấn để sao chép HEX)</div>
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
              <div class="font-display font-bold text-sm mb-1">Thông số kỹ thuật &amp; Chất liệu đề xuất</div>
              <p class="text-sm text-[#52525B] leading-relaxed">${escapeHtml(concept.specs || 'Đang cập nhật thông số sản xuất.')}</p>
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

          <!-- Feature Work Notice -->
          <div class="sketch-box p-4 bg-[#F4EFE6]/80 space-y-1.5">
            <div class="flex items-center justify-between gap-2">
              <span class="font-display font-extrabold text-sm text-[#2D5DA1]">Feature Work · Định hướng mở rộng</span>
              <a href="#feature-work" data-jump-feature-work="true" class="text-xs font-mono font-bold underline hover:text-[#FF4D4D]">Xem lộ trình →</a>
            </div>
            <p class="text-xs text-[#52525B] leading-relaxed">
              Trang đang vận hành ở chế độ <strong>Chỉ trưng bày (Showcase-Only)</strong>. Tính năng cho người dùng thêm thiết kế mới (<em>User Concept Submission</em>), chấm điểm đa tiêu chí và bình luận góp ý sẽ được mở trong mục <strong>Feature Work</strong>.
            </p>
          </div>
        </div>
      </div>
    `;

    const copyLinkBtn = document.getElementById('copyConceptLinkBtn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#concept-${concept.id}`;
        copyToClipboard(shareUrl, 'Đã sao chép link mẫu trưng bày!');
      });
    }

    body.querySelectorAll('[data-jump-feature-work]').forEach((link) => {
      link.addEventListener('click', () => {
        closeConceptModal();
      });
    });
  }

  // -------------------- Modal 2: Anonymous Archive Portfolio --------------------
  function openCreatorModal(creatorId) {
    closeConceptModal();
    const creator = getCreatorById(creatorId);
    const campus = getCampusById(creator.campusId);
    const works = state.concepts.filter((c) => c.creatorId === creator.id);

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
              <span class="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#B8F2E6] border-2 border-[#1E1E24] rounded-full">Showcase Archive</span>
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

        <!-- Stats & Showcase Archive Notice -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-[#F4EFE6] border-2 border-[#1E1E24] rounded-2xl grid grid-cols-3 gap-2 text-center">
            <div>
              <div class="font-mono text-2xl font-bold">${works.length}</div>
              <div class="text-xs font-hand text-[#52525B]">Concept trưng bày</div>
            </div>
            <div>
              <div class="font-mono text-2xl font-bold text-[#2D5DA1]">3 Góc</div>
              <div class="text-xs font-hand text-[#52525B]">Góc nhìn Studio</div>
            </div>
            <div>
              <div class="font-mono text-lg sm:text-xl font-bold text-[#1E1E24]">HCMUT</div>
              <div class="text-xs font-hand text-[#52525B]">Nhận diện chuẩn</div>
            </div>
          </div>

          <div class="p-4 bg-[#B8F2E6]/50 border-2 border-[#1E1E24] rounded-2xl space-y-2">
            <div class="font-display font-bold text-sm">Đóng góp Ẩn danh · Chế độ Chỉ Trưng Bày</div>
            <p class="text-xs text-[#1E1E24]/85 leading-relaxed">
              Các mẫu được chia sẻ công khai dưới danh nghĩa <strong>Ẩn danh</strong> để sinh viên và các CLB tự do tham khảo theo chuẩn nhận diện thương hiệu. Cổng tác giả tự đăng &amp; cầu nối sản xuất sẽ mở trong mục <strong>Feature Work</strong>.
            </p>
          </div>
        </div>

        <!-- Archive Works -->
        <div>
          <h3 class="font-display font-extrabold text-lg mb-3">Tác phẩm đang trưng bày (${works.length})</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${works
              .map(
                (w) => `
              <div class="sketch-box p-3.5 bg-white flex items-center gap-3">
                <button type="button" data-open-concept="${escapeHtml(w.id)}" class="w-24 h-20 rounded-xl overflow-hidden border-2 border-[#1E1E24] shrink-0 cursor-pointer bg-[#F4F6F9]">
                  ${renderMerchIllustration(w, 0)}
                </button>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-mono font-bold text-[#2D5DA1]">${escapeHtml(getCategoryLabel(w.category))} · ${formatDateDisplay(w.createdAt)}</div>
                  <button type="button" data-open-concept="${escapeHtml(w.id)}" class="font-display font-bold text-sm text-left line-clamp-2 hover:text-[#2D5DA1] cursor-pointer">
                    ${escapeHtml(w.title)}
                  </button>
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
    renderBookmarks();
  }

  // -------------------- Event Binding --------------------
  function bindEvents() {
    // Global click delegation
    document.addEventListener('click', (e) => {
      const scopeBtn = e.target.closest('[data-campus-scope]');
      if (scopeBtn) {
        state.campusScope = scopeBtn.dataset.campusScope;
        renderCampusHubStrip();
        return;
      }

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

      const detailViewBtn = e.target.closest('[data-detail-view]');
      if (detailViewBtn) {
        state.activeDetailView = Number(detailViewBtn.dataset.detailView) || 0;
        renderConceptModal();
        return;
      }

      const hexBtn = e.target.closest('[data-copy-hex]');
      if (hexBtn) {
        const hex = hexBtn.dataset.copyHex;
        copyToClipboard(hex, `Đã sao chép mã màu ${hex}`);
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
        state.sortBy = 'featured';
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'featured';
        renderAll();
      });
    }

    // Modal & Drawer Triggers
    document.getElementById('closeConceptModalBtn')?.addEventListener('click', closeConceptModal);
    document.getElementById('closeCreatorModalBtn')?.addEventListener('click', closeCreatorModal);
    document.getElementById('openBookmarksBtn')?.addEventListener('click', openBookmarksDrawer);
    document.getElementById('closeBookmarksBtn')?.addEventListener('click', closeBookmarksDrawer);

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
    ['conceptModal', 'creatorModal'].forEach((id) => {
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
        closeBookmarksDrawer();
      }
    });
  }

  // -------------------- Initialize --------------------
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
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
