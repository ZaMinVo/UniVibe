/* ==========================================================================
   UniVibe — Main Interactive Application Logic
   Editorial Gallery Architecture (inspired by uupm.cc/demo/nft-art-gallery)
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

  function padCount(num) {
    return String(num).padStart(2, '0');
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
      <svg class="w-4 h-4 ${saved ? 'text-[#030391] fill-[#030391]' : 'text-[#141413]'}" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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

  // -------------------- Render: Hero Exhibition Banner --------------------
  function renderHero() {
    const container = document.getElementById('heroContainer');
    if (!container) return;

    const totalConcepts = state.concepts.length;
    const vnuCount = CAMPUSES.filter((c) => c.isVnuHcm).length;

    if (state.activeCampus === 'all') {
      const featured = state.concepts.find((c) => c.featured) || state.concepts[0];
      const creator = getCreatorById(featured.creatorId);

      container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <!-- Left Editorial Statement (GALERIE Hero) -->
          <div class="lg:col-span-6 space-y-7">
            <p class="font-mono text-[11px] uppercase tracking-[0.22em] text-[#6E6A63]">
              Current Exhibition · Showcase Only
            </p>

            <h1 class="font-display text-5xl sm:text-6xl lg:text-[64px] font-semibold leading-[1.04] tracking-tight text-[#141413]">
              Bản Sắc <em class="italic font-normal text-[#030391]">Sinh Viên</em> Trong Không Gian Tối Giản
            </h1>

            <p class="text-base sm:text-lg text-[#6E6A63] max-w-xl leading-relaxed">
              Tuyển chọn <strong class="font-semibold text-[#141413]">0${totalConcepts} thiết kế vật phẩm</strong> thực tế tối giản (Áo Polo, Lót chuột Deskpad, Túi Tote, Nón lưỡi trai) đồng bộ hệ thống nhận diện thương hiệu đại học — Nguồn <strong class="font-semibold text-[#141413]">HCMUT</strong>.
            </p>

            <div class="flex flex-wrap items-center gap-4 pt-1">
              <a href="#gallery" class="gallery-btn-primary">
                Xem Phòng Trưng Bày
              </a>
              <a href="#campus-hubs" class="gallery-btn-outline">
                Chọn Trường ĐH
              </a>
            </div>

            <!-- Quiet Curatorial Metrics -->
            <div class="grid grid-cols-3 gap-6 pt-6 border-t border-[#E2DDD5] max-w-lg">
              <div>
                <div class="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">${padCount(totalConcepts)}</div>
                <div class="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6A63] mt-1">Tác phẩm</div>
              </div>
              <div>
                <div class="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">03</div>
                <div class="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6A63] mt-1">Góc Studio / mẫu</div>
              </div>
              <div>
                <div class="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">${padCount(vnuCount)}</div>
                <div class="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6A63] mt-1">Trường ĐHQG-HCM</div>
              </div>
            </div>
          </div>

          <!-- Right Framed Spotlight Artwork -->
          <div class="lg:col-span-6">
            <article class="gallery-card group">
              <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="sketch-frame block w-full aspect-[4/3] overflow-hidden bg-[#F3F0EA] cursor-pointer">
                ${renderMerchIllustration(featured, 0)}
              </button>

              <div class="p-5 sm:p-6 bg-white">
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div class="sm:col-span-8">
                    <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63] mb-1">
                      Featured Work · Sản phẩm #01
                    </div>
                    <h2 class="font-display text-2xl font-semibold text-[#141413] leading-snug">
                      <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="text-left hover:text-[#030391] transition-colors cursor-pointer">
                        ${escapeHtml(featured.title)}
                      </button>
                    </h2>
                    <div class="text-xs text-[#6E6A63] mt-1.5">
                      Tác giả:
                      <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="text-[#141413] underline underline-offset-4 decoration-[#E2DDD5] hover:decoration-[#141413] cursor-pointer">
                        ${escapeHtml(creator.name)}
                      </button>
                    </div>
                  </div>

                  <div class="sm:col-span-4 sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2DDD5]">
                    <div>
                      <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63]">Nguồn</div>
                      <div class="font-mono text-sm font-bold text-[#030391]">${escapeHtml(featured.source || 'HCMUT')}</div>
                    </div>
                    <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="font-mono text-[11px] uppercase tracking-[0.14em] text-[#141413] hover:text-[#030391] underline underline-offset-4 cursor-pointer">
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              </div>
            </article>
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
      <div class="border border-[#E2DDD5] bg-white p-6 sm:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 space-y-5">
            <div class="flex flex-wrap items-center gap-4">
              <button type="button" id="backToGlobalBtn" class="gallery-btn-outline gallery-btn-sm">
                ← Triển lãm Chung
              </button>
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6E6A63]">
                Campus Archive · ${escapeHtml(campus.city)}
              </span>
            </div>

            <div class="flex items-start sm:items-center gap-4 pt-1">
              ${renderCampusEmblem(campus)}
              <div>
                <h1 class="font-display text-3xl sm:text-5xl font-semibold text-[#141413] tracking-tight">
                  ${escapeHtml(campus.name)}
                </h1>
                <p class="font-display italic text-lg text-[#6E6A63] mt-0.5">“${escapeHtml(campus.motto)}”</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-[#6E6A63]">
              <span class="uppercase tracking-wider">Màu bản sắc:</span>
              <span class="inline-flex items-center gap-2 text-[#141413]">
                <span class="w-3 h-3 rounded-full border border-[#E2DDD5]" style="background:${escapeHtml(campus.color)}"></span>
                ${escapeHtml(campus.color)}
              </span>
              <span class="inline-flex items-center gap-2 text-[#141413]">
                <span class="w-3 h-3 rounded-full border border-[#E2DDD5]" style="background:${escapeHtml(campus.secondaryColor)}"></span>
                ${escapeHtml(campus.secondaryColor)}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-6 pt-5 border-t border-[#E2DDD5] max-w-lg">
              <div>
                <div class="font-display text-3xl font-semibold">${padCount(campusConcepts.length)}</div>
                <div class="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6A63] mt-1">Tác phẩm</div>
              </div>
              <div>
                <div class="font-display text-3xl font-semibold text-[#030391]">03</div>
                <div class="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6A63] mt-1">Góc Studio</div>
              </div>
              <div>
                <div class="font-display text-2xl sm:text-3xl font-semibold">Ẩn danh</div>
                <div class="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6A63] mt-1">Lưu trữ</div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            ${
              topDesign
                ? `
              <div class="border border-[#E2DDD5] bg-[#FAF8F5] p-4">
                <div class="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-[#6E6A63] mb-3">
                  <span>Tiêu biểu · ${escapeHtml(campus.shortName)}</span>
                  <span>Ẩn danh</span>
                </div>
                <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="sketch-frame block w-full aspect-[4/3] overflow-hidden bg-[#F3F0EA] cursor-pointer mb-3">
                  ${renderMerchIllustration(topDesign, 0)}
                </button>
                <div class="flex items-center justify-between gap-3">
                  <h3 class="font-display text-lg font-semibold truncate">${escapeHtml(topDesign.title)}</h3>
                  <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="font-mono text-[11px] uppercase tracking-wider text-[#030391] underline underline-offset-4 shrink-0 cursor-pointer">
                    Chi tiết →
                  </button>
                </div>
              </div>
              `
                : `
              <div class="p-8 bg-[#FAF8F5] border border-[#E2DDD5] text-center space-y-4">
                <div class="font-display text-2xl font-semibold text-[#141413]">${escapeHtml(campus.shortName)} đang biên tập</div>
                <p class="text-xs text-[#6E6A63] leading-relaxed">
                  Phòng trưng bày hiện tập trung vào bộ sưu tập chuẩn của <strong>HCMUT</strong>. Cổng tự thêm mẫu cho các trường thành viên khác nằm trong lộ trình <strong>Feature Work</strong>.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button type="button" id="viewHcmutShowcaseBtn" class="gallery-btn-primary gallery-btn-sm">Xem bộ sưu tập HCMUT</button>
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

  // -------------------- Render: Curated University Spaces --------------------
  function renderCampusHubStrip() {
    const strip = document.getElementById('campusHubStrip');
    if (!strip) return;

    document.querySelectorAll('.campus-scope-btn').forEach((btn) => {
      const isMatch = btn.dataset.campusScope === state.campusScope;
      btn.classList.toggle('gallery-tab--active', isMatch);
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
      <button type="button" data-campus-id="all" class="text-left p-4 bg-white border transition-all flex flex-col cursor-pointer ${
        allActive ? 'border-[#141413] ring-1 ring-[#141413]' : 'border-[#E2DDD5] hover:border-[#141413]'
      }">
        <div class="flex items-center gap-3 mb-2.5">
          <div class="w-10 h-10 bg-[#141413] text-[#FAF8F5] flex items-center justify-center font-mono text-xs font-bold tracking-wider shrink-0">
            ALL
          </div>
          <div class="min-w-0">
            <div class="font-display font-semibold text-base leading-tight text-[#141413]">Liên Trường</div>
            <div class="font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] mt-0.5">${padCount(state.concepts.length)} tác phẩm</div>
          </div>
        </div>
        <p class="text-xs text-[#6E6A63] line-clamp-2 mt-auto">Toàn bộ tác phẩm trưng bày.</p>
      </button>
    `;

    const campusCards = visibleCampuses
      .map((campus) => {
        const count = state.concepts.filter((c) => c.campusId === campus.id).length;
        const isActive = state.activeCampus === campus.id;
        const statusText = count > 0 ? `${padCount(count)} tác phẩm` : 'Đang biên tập';
        const vnuLabel = campus.isVnuHcm
          ? `<span class="font-mono text-[9px] uppercase tracking-[0.14em] text-[#030391]">ĐHQG-HCM</span>`
          : '';

        return `
          <button type="button" data-campus-id="${escapeHtml(campus.id)}" class="text-left p-4 bg-white border transition-all flex flex-col cursor-pointer ${
            isActive ? 'border-[#141413] ring-1 ring-[#141413]' : 'border-[#E2DDD5] hover:border-[#141413]'
          }">
            <div class="flex items-center gap-3 mb-2.5">
              ${renderCampusEmblem(campus)}
              <div class="min-w-0">
                <div class="font-display font-semibold text-base leading-tight text-[#141413] truncate">${escapeHtml(campus.shortName)}</div>
                <div class="font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] mt-0.5">${statusText}</div>
              </div>
            </div>
            <div class="mt-auto space-y-0.5">
              ${vnuLabel}
              <p class="text-xs text-[#6E6A63] line-clamp-2">${escapeHtml(campus.name)}</p>
            </div>
          </button>
        `;
      })
      .join('');

    strip.innerHTML = allCard + campusCards;
  }

  // -------------------- Render: Category Filter Tabs --------------------
  function renderCategoryFilters() {
    const bar = document.getElementById('categoryFilterBar');
    if (!bar) return;

    bar.innerHTML = CATEGORIES.map((cat) => {
      const active = state.activeCategory === cat.id;
      return `
        <button type="button" data-category-id="${escapeHtml(cat.id)}" class="gallery-tab ${
          active ? 'gallery-tab--active' : ''
        }">
          ${escapeHtml(cat.label)}
        </button>
      `;
    }).join('');
  }

  // -------------------- Render: Available Works Gallery Grid --------------------
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const empty = document.getElementById('galleryEmptyState');
    const countBadge = document.getElementById('galleryCountBadge');
    if (!grid || !empty || !countBadge) return;

    const items = getFilteredConcepts();
    const campusLabel =
      state.activeCampus === 'all' ? 'Liên trường' : getCampusById(state.activeCampus).shortName;
    countBadge.textContent = `${padCount(items.length)} tác phẩm · ${campusLabel}`;

    if (items.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');

    grid.innerHTML = items
      .map((item) => {
        const campus = getCampusById(item.campusId);
        const creator = getCreatorById(item.creatorId);
        const isBookmarked = state.bookmarks.includes(item.id);

        return `
          <article class="gallery-card group flex flex-col">
            <!-- Pure Studio Artwork Frame (Zero Sticker Clutter) -->
            <div class="relative aspect-[4/3] overflow-hidden bg-[#F3F0EA]">
              <button type="button" data-open-concept="${escapeHtml(item.id)}" class="sketch-frame block w-full h-full cursor-pointer" aria-label="Mở chi tiết ${escapeHtml(item.title)}">
                ${renderMerchIllustration(item, 0)}
              </button>

              <button type="button" data-toggle-bookmark="${escapeHtml(item.id)}" class="gallery-btn-icon absolute top-3.5 right-3.5 z-10 ${
                isBookmarked ? '!bg-white !border-[#141413]' : ''
              }" aria-label="${isBookmarked ? 'Bỏ lưu tác phẩm' : 'Lưu tác phẩm'}" title="${isBookmarked ? 'Đã lưu' : 'Lưu tác phẩm'}">
                ${iconBookmark(isBookmarked)}
              </button>
            </div>

            <!-- Quiet Museum Placard -->
            <div class="p-5 sm:p-6 flex-1 flex flex-col bg-white">
              <div class="flex items-center justify-between gap-3 mb-2">
                <span class="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6A63]">
                  ${escapeHtml(campus.shortName)} · ${escapeHtml(getCategoryLabel(item.category))}
                </span>
                <div class="flex items-center gap-1.5" aria-label="Bảng màu sản phẩm">
                  ${(item.palette || [])
                    .slice(0, 4)
                    .map(
                      (hex) =>
                        `<span class="w-2.5 h-2.5 rounded-full border border-[#E2DDD5]" style="background:${escapeHtml(hex)}" title="${escapeHtml(hex)}"></span>`
                    )
                    .join('')}
                </div>
              </div>

              <h3 class="font-display text-2xl font-semibold leading-snug text-[#141413]">
                <button type="button" data-open-concept="${escapeHtml(item.id)}" class="text-left hover:text-[#030391] transition-colors cursor-pointer">
                  ${escapeHtml(item.title)}
                </button>
              </h3>

              <div class="mt-auto pt-4 mt-4 border-t border-[#E2DDD5] flex items-center justify-between gap-3 text-xs text-[#6E6A63]">
                <div>
                  <span>Tác giả:</span>
                  <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="text-[#141413] underline underline-offset-4 decoration-[#E2DDD5] hover:decoration-[#141413] font-medium cursor-pointer ml-1">
                    ${escapeHtml(creator.name)}
                  </button>
                </div>
                <div class="font-mono text-[11px] uppercase tracking-wider">
                  Nguồn: <span class="text-[#141413] font-bold">${escapeHtml(item.source || 'HCMUT')}</span>
                </div>
              </div>
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
        <div class="border border-[#E2DDD5] bg-white p-8 text-center">
          <p class="font-display text-xl font-semibold text-[#141413] mb-1">Chưa lưu tác phẩm nào</p>
          <p class="text-xs text-[#6E6A63] leading-relaxed">Nhấn biểu tượng lưu ở góc trên bên phải mỗi tác phẩm để tổng hợp thành bộ sưu tập cá nhân.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = bookmarkedItems
      .map((item) => {
        const campus = getCampusById(item.campusId);
        return `
          <div class="border border-[#E2DDD5] bg-white p-3.5 flex items-center gap-3.5">
            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="w-20 h-15 aspect-[4/3] overflow-hidden border border-[#E2DDD5] shrink-0 cursor-pointer bg-[#F3F0EA]">
              ${renderMerchIllustration(item, 0)}
            </button>
            <div class="min-w-0 flex-1">
              <div class="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6A63]">${escapeHtml(campus.shortName)} · ${escapeHtml(getCategoryLabel(item.category))}</div>
              <button type="button" data-open-concept="${escapeHtml(item.id)}" class="font-display font-semibold text-base text-left line-clamp-2 hover:text-[#030391] cursor-pointer text-[#141413]">
                ${escapeHtml(item.title)}
              </button>
            </div>
            <button type="button" data-toggle-bookmark="${escapeHtml(item.id)}" class="gallery-btn-icon shrink-0" aria-label="Xóa khỏi đã lưu">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
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

    const defaultLabels = ['Phối cảnh chính diện (Studio)', 'Cận cảnh chi tiết & Logo', 'Phối cảnh thực tế'];
    const labels =
      Array.isArray(concept.viewLabels) && concept.viewLabels.length === 3
        ? concept.viewLabels
        : defaultLabels;
    const viewButtons = labels.map((label, idx) => ({ idx, label }));

    body.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <!-- Left Column: Multi-Angle Studio Artwork -->
        <div class="lg:col-span-6 space-y-4">
          <div class="border border-[#E2DDD5] bg-white p-3">
            <div id="detailArtworkFrame" class="sketch-frame aspect-[4/3] overflow-hidden bg-[#F3F0EA]">
              ${renderMerchIllustration(concept, state.activeDetailView)}
            </div>
            <div class="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#E2DDD5]">
              ${viewButtons
                .map(
                  (vb) => `
                <button type="button" data-detail-view="${vb.idx}" class="py-2 px-2 text-[11px] font-medium border transition-colors cursor-pointer ${
                    state.activeDetailView === vb.idx
                      ? 'bg-[#141413] text-[#FAF8F5] border-[#141413]'
                      : 'bg-white text-[#6E6A63] border-[#E2DDD5] hover:border-[#141413] hover:text-[#141413]'
                  }">
                  ${escapeHtml(vb.label)}
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button type="button" id="copyConceptLinkBtn" class="gallery-btn-outline gallery-btn-sm">
              Sao chép liên kết
            </button>
            <button type="button" data-toggle-bookmark="${escapeHtml(concept.id)}" class="${
              isBookmarked ? 'gallery-btn-primary' : 'gallery-btn-outline'
            } gallery-btn-sm">
              ${iconBookmark(isBookmarked)}
              <span>${isBookmarked ? 'Đã lưu trong bộ sưu tập' : 'Lưu tác phẩm'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Curatorial Placard Info -->
        <div class="lg:col-span-6 space-y-6 pr-2">
          <div class="pr-8">
            <div class="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63] mb-2">
              <span class="text-[#030391] font-bold">${escapeHtml(campus.shortName)}</span>
              <span>·</span>
              <span>${escapeHtml(getCategoryLabel(concept.category))}</span>
              <span>·</span>
              <span>Nguồn: ${escapeHtml(concept.source || 'HCMUT')}</span>
            </div>

            <h2 id="conceptModalTitle" class="font-display text-3xl sm:text-4xl font-semibold text-[#141413] leading-tight">
              ${escapeHtml(concept.title)}
            </h2>

            <div class="flex items-center justify-between gap-3 mt-4 py-3 border-y border-[#E2DDD5]">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-[#141413] text-[#FAF8F5] flex items-center justify-center font-mono text-xs font-bold">
                  ${escapeHtml(creator.initials)}
                </div>
                <div>
                  <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="text-sm font-medium text-[#141413] hover:text-[#030391] underline underline-offset-4 decoration-[#E2DDD5] cursor-pointer block text-left">
                    ${escapeHtml(creator.name)}
                  </button>
                  <div class="text-[11px] text-[#6E6A63]">${escapeHtml(creator.faculty)} · ${formatDateDisplay(concept.createdAt)}</div>
                </div>
              </div>

              <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="gallery-btn-outline gallery-btn-sm shrink-0 whitespace-nowrap">
                Hồ sơ
              </button>
            </div>
          </div>

          <!-- Curatorial Note -->
          <div>
            <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63] mb-1.5">Câu chuyện thiết kế</div>
            <p class="text-sm text-[#141413]/90 leading-relaxed">${escapeHtml(concept.story)}</p>
          </div>

          <!-- Palette & Material Specs -->
          <div class="bg-white border border-[#E2DDD5] p-5 space-y-4">
            <div>
              <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63] mb-2.5">Bảng màu chuẩn nhận diện (Bấm để sao chép HEX)</div>
              <div class="flex flex-wrap gap-2">
                ${(concept.palette || [])
                  .map(
                    (hex) => `
                  <button type="button" data-copy-hex="${escapeHtml(hex)}" class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#E2DDD5] hover:border-[#141413] text-xs font-mono cursor-pointer transition-colors">
                    <span class="w-3.5 h-3.5 rounded-full border border-[#D5CFC7]" style="background:${escapeHtml(hex)}"></span>
                    ${escapeHtml(hex)}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>

            <div class="border-t border-[#E2DDD5] pt-4">
              <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63] mb-1.5">Thông số chất liệu</div>
              <p class="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">${escapeHtml(concept.specs || 'Đang cập nhật thông số.')}</p>
            </div>
          </div>

          <!-- Minimal Feature Work Notice -->
          <div class="border-t border-[#E2DDD5] pt-4 flex items-center justify-between gap-4 text-xs text-[#6E6A63]">
            <span>Chế độ Chỉ Trưng Bày · Tương tác &amp; Góp ý nằm trong Feature Work.</span>
            <a href="#feature-work" data-jump-feature-work="true" class="font-mono uppercase tracking-wider text-[#141413] underline underline-offset-4 shrink-0">Lộ trình →</a>
          </div>
        </div>
      </div>
    `;

    const copyLinkBtn = document.getElementById('copyConceptLinkBtn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#concept-${concept.id}`;
        copyToClipboard(shareUrl, 'Đã sao chép liên kết tác phẩm!');
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
      <div class="space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5 pr-8 border-b border-[#E2DDD5] pb-6">
          <div class="w-16 h-16 bg-[#141413] text-[#FAF8F5] flex items-center justify-center font-mono text-xl font-bold shrink-0">
            ${escapeHtml(creator.initials)}
          </div>
          <div class="space-y-1">
            <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63]">Showcase Archive · ${escapeHtml(campus.name)}</div>
            <h2 id="creatorModalTitle" class="font-display text-3xl font-semibold text-[#141413]">${escapeHtml(creator.name)}</h2>
            <p class="text-xs font-mono text-[#6E6A63]">${escapeHtml(creator.handle)} · ${escapeHtml(creator.faculty)}</p>
          </div>
        </div>

        <p class="text-sm text-[#6E6A63] leading-relaxed">${escapeHtml(creator.bio)}</p>

        <div>
          <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6E6A63] mb-4">Tác phẩm đang trưng bày (${padCount(works.length)})</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            ${works
              .map(
                (w) => `
              <button type="button" data-open-concept="${escapeHtml(w.id)}" class="gallery-card text-left p-3 cursor-pointer flex items-center gap-3.5">
                <div class="w-24 aspect-[4/3] overflow-hidden bg-[#F3F0EA] border border-[#E2DDD5] shrink-0">
                  ${renderMerchIllustration(w, 0)}
                </div>
                <div class="min-w-0">
                  <div class="font-mono text-[10px] uppercase tracking-wider text-[#6E6A63]">${escapeHtml(getCategoryLabel(w.category))}</div>
                  <div class="font-display font-semibold text-base text-[#141413] line-clamp-2 mt-0.5">${escapeHtml(w.title)}</div>
                </div>
              </button>
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
      showToast('Đã lưu tác phẩm vào Bộ sưu tập.');
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

    document.getElementById('closeConceptModalBtn')?.addEventListener('click', closeConceptModal);
    document.getElementById('closeCreatorModalBtn')?.addEventListener('click', closeCreatorModal);
    document.getElementById('openBookmarksBtn')?.addEventListener('click', openBookmarksDrawer);
    document.getElementById('closeBookmarksBtn')?.addEventListener('click', closeBookmarksDrawer);

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

    ['conceptModal', 'creatorModal'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', (e) => {
        if (!e.target.closest('.gallery-modal-panel')) {
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
