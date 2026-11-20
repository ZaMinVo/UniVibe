/* ==========================================================================
   UniVibe — Main Interactive Application Logic
   Editorial Gallery + HCMUT CSE Keychain Version Selection & Evaluation Lab
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'univibe_gallery_state_v4';
  const LEGACY_STORAGE_KEY_V3 = 'univibe_gallery_state_v3';
  const KEYCHAIN_SERIES_ID = 'hcmut-cs-keychain';

  const CRITERIA_LIST = [
    { key: 'creativity', label: 'Thẩm mỹ & Hoàn thiện' },
    { key: 'identity', label: 'Tính nhận diện' },
    { key: 'practicality', label: 'Tính ứng dụng & Độ bền' },
  ];

  const { CAMPUSES, CATEGORIES, CREATORS, INITIAL_CONCEPTS } = window.UniVibeData;
  const { renderMerchIllustration, renderCampusEmblem } = window.UniVibeIllustrations;

  // -------------------- Application State --------------------
  const state = {
    concepts: [],
    creators: [],
    bookmarks: [],
    shortlist: [],
    topPickId: null,
    evaluations: {},
    draftNotes: {},
    campusScope: 'vnuhcm',
    activeCampus: 'all',
    activeCategory: 'all',
    labFilter: 'all',
    onlyShortlisted: false,
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

  function formatScore(num) {
    return typeof num === 'number' && !Number.isNaN(num) ? num.toFixed(1) : '—';
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="bg-[#1A1A1A] text-white px-5 py-3 text-xs tracking-wider uppercase shadow-xl animate-editorial">
        ${escapeHtml(message)}
      </div>
    `;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      container.innerHTML = '';
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

  // -------------------- Evaluation & Selection Helpers --------------------
  function normalizeScore(val) {
    const num = Number(val);
    if (!Number.isInteger(num) || num < 1 || num > 5) return null;
    return num;
  }

  function getConceptEvaluation(conceptId) {
    const stored = state.evaluations && state.evaluations[conceptId] ? state.evaluations[conceptId] : {};
    return {
      creativity: normalizeScore(stored.creativity),
      identity: normalizeScore(stored.identity),
      practicality: normalizeScore(stored.practicality),
      note: typeof stored.note === 'string' ? stored.note : '',
      updatedAt: typeof stored.updatedAt === 'string' ? stored.updatedAt : null,
    };
  }

  function hasAnyScore(ev) {
    return CRITERIA_LIST.some((cr) => typeof ev[cr.key] === 'number');
  }

  function isConceptRated(conceptId) {
    return hasAnyScore(getConceptEvaluation(conceptId));
  }

  function getConceptAverageScore(conceptId) {
    const ev = getConceptEvaluation(conceptId);
    const vals = CRITERIA_LIST.map((cr) => ev[cr.key]).filter((v) => typeof v === 'number');
    if (vals.length === 0) return null;
    const avg = vals.reduce((sum, v) => sum + v, 0) / vals.length;
    return Math.round(avg * 10) / 10;
  }

  function toggleShortlist(conceptId) {
    const idx = state.shortlist.indexOf(conceptId);
    const concept = state.concepts.find((c) => c.id === conceptId);
    const label = concept && concept.versionCode ? concept.versionCode : 'tác phẩm';

    if (idx === -1) {
      state.shortlist.push(conceptId);
      showToast(`Đã đưa ${label} vào danh sách Chọn lọc.`);
    } else {
      state.shortlist.splice(idx, 1);
      if (state.topPickId === conceptId) {
        state.topPickId = null;
      }
      showToast(`Đã bỏ ${label} khỏi danh sách Chọn lọc.`);
    }

    saveState();
    renderAll();
    if (state.activeConceptId === conceptId && !document.getElementById('conceptModal').classList.contains('hidden')) {
      renderConceptModal();
    }
  }

  function setTopPick(conceptId) {
    const concept = state.concepts.find((c) => c.id === conceptId);
    const label = concept && concept.versionCode ? `${concept.versionCode} (${concept.versionShortName})` : 'mẫu';

    if (state.topPickId === conceptId) {
      state.topPickId = null;
      showToast(`Đã bỏ chốt phương án #1 cho ${label}.`);
    } else {
      state.topPickId = conceptId;
      if (!state.shortlist.includes(conceptId)) {
        state.shortlist.push(conceptId);
      }
      showToast(`Đã chốt ${label} làm Phương án #1!`);
    }

    saveState();
    renderAll();
    if (state.activeConceptId === conceptId && !document.getElementById('conceptModal').classList.contains('hidden')) {
      renderConceptModal();
    }
  }

  function setCriterionScore(conceptId, criterionKey, val) {
    if (!CRITERIA_LIST.some((cr) => cr.key === criterionKey)) return;
    const score = normalizeScore(val);
    if (!score) return;

    const noteEl = document.getElementById('conceptEvalNote');
    if (noteEl && state.activeConceptId === conceptId) {
      state.draftNotes[conceptId] = noteEl.value;
    }

    const prev = getConceptEvaluation(conceptId);
    const draftNote =
      typeof state.draftNotes[conceptId] === 'string' ? state.draftNotes[conceptId] : prev.note;

    state.evaluations[conceptId] = {
      creativity: prev.creativity,
      identity: prev.identity,
      practicality: prev.practicality,
      note: draftNote.trim(),
      [criterionKey]: score,
      updatedAt: new Date().toISOString(),
    };

    saveState();
    renderKeychainLab();
    renderCategoryFilters();
    renderGallery();
    if (state.activeConceptId === conceptId && !document.getElementById('conceptModal').classList.contains('hidden')) {
      renderConceptModal();
    }
  }

  function saveEvaluationNote(conceptId) {
    const noteEl = document.getElementById('conceptEvalNote');
    const rawNote = noteEl
      ? noteEl.value
      : typeof state.draftNotes[conceptId] === 'string'
        ? state.draftNotes[conceptId]
        : '';
    const trimmed = rawNote.trim();
    const prev = getConceptEvaluation(conceptId);

    state.draftNotes[conceptId] = trimmed;
    state.evaluations[conceptId] = {
      creativity: prev.creativity,
      identity: prev.identity,
      practicality: prev.practicality,
      note: trimmed,
      updatedAt: new Date().toISOString(),
    };

    saveState();
    renderKeychainLab();
    renderCategoryFilters();
    renderGallery();
    if (state.activeConceptId === conceptId && !document.getElementById('conceptModal').classList.contains('hidden')) {
      renderConceptModal();
    }
    showToast('Đã lưu đánh giá & nhận xét.');
  }

  function resetAllEvaluations() {
    state.shortlist = [];
    state.topPickId = null;
    state.evaluations = {};
    state.draftNotes = {};
    state.labFilter = 'all';
    state.onlyShortlisted = false;
    saveState();
    renderAll();
    if (state.activeConceptId && !document.getElementById('conceptModal').classList.contains('hidden')) {
      renderConceptModal();
    }
    showToast('Đã đặt lại toàn bộ chọn lọc & đánh giá.');
  }

  function formatEvaluationReport() {
    const keychains = state.concepts.filter((c) => c.seriesId === KEYCHAIN_SERIES_ID);
    const topPick = keychains.find((c) => c.id === state.topPickId);
    const shortlisted = keychains.filter((c) => state.shortlist.includes(c.id));

    const lines = [
      '=== BÁO CÁO CHỌN LỌC & ĐÁNH GIÁ MÓC KHÓA KHMT (HCMUT · CSE) ===',
      `Phương án chốt #1: ${topPick ? `${topPick.versionCode} — ${topPick.versionShortName}` : 'Chưa chốt'}`,
      `Danh sách Chọn lọc (${shortlisted.length}/${keychains.length}): ${
        shortlisted.length ? shortlisted.map((c) => `${c.versionCode} (${c.versionShortName})`).join(', ') : 'Chưa chọn'
      }`,
      '',
      'Chi tiết từng phiên bản:',
    ];

    keychains.forEach((c) => {
      const ev = getConceptEvaluation(c.id);
      const avg = getConceptAverageScore(c.id);
      const badges = [];
      if (state.topPickId === c.id) badges.push('#1 CHỐT');
      if (state.shortlist.includes(c.id)) badges.push('ĐÃ CHỌN LỌC');
      const statusText = badges.length ? ` [${badges.join(' · ')}]` : '';

      lines.push(
        `- ${c.versionCode} · ${c.versionShortName}${statusText}: Điểm TB = ${avg !== null ? `${formatScore(avg)}/5.0` : 'Chưa chấm'}`
      );
      if (hasAnyScore(ev)) {
        lines.push(
          `  Tiêu chí: Thẩm mỹ=${ev.creativity ?? '-'}/5 | Nhận diện=${ev.identity ?? '-'}/5 | Ứng dụng=${ev.practicality ?? '-'}/5`
        );
      }
      if (ev.note) {
        lines.push(`  Nhận xét: "${ev.note}"`);
      }
    });

    return lines.join('\n');
  }

  // -------------------- Persistence (Local Storage) --------------------
  function loadState() {
    let saved = null;
    try {
      localStorage.removeItem('univibe_gallery_state_v1');
      localStorage.removeItem('univibe_gallery_state_v2');
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY_V3);
      if (raw) saved = JSON.parse(raw);
    } catch (_) {
      saved = null;
    }

    state.concepts = INITIAL_CONCEPTS.map((c) => ({ ...c }));
    state.creators = CREATORS.map((cr) => ({ ...cr, contacts: { ...cr.contacts } }));

    const validIds = new Set(state.concepts.map((c) => c.id));
    if (saved && typeof saved === 'object') {
      if (Array.isArray(saved.bookmarks)) {
        state.bookmarks = saved.bookmarks.filter((id) => validIds.has(id));
      }
      if (Array.isArray(saved.shortlist)) {
        state.shortlist = Array.from(new Set(saved.shortlist.filter((id) => validIds.has(id))));
      }
      if (typeof saved.topPickId === 'string' && validIds.has(saved.topPickId)) {
        state.topPickId = saved.topPickId;
        if (!state.shortlist.includes(saved.topPickId)) {
          state.shortlist.push(saved.topPickId);
        }
      }
      if (saved.evaluations && typeof saved.evaluations === 'object') {
        const cleanEvals = {};
        Object.keys(saved.evaluations).forEach((cid) => {
          if (!validIds.has(cid)) return;
          const rawEv = saved.evaluations[cid];
          if (!rawEv || typeof rawEv !== 'object') return;
          const note = typeof rawEv.note === 'string' ? rawEv.note.slice(0, 600) : '';
          cleanEvals[cid] = {
            creativity: normalizeScore(rawEv.creativity),
            identity: normalizeScore(rawEv.identity),
            practicality: normalizeScore(rawEv.practicality),
            note,
            updatedAt: typeof rawEv.updatedAt === 'string' ? rawEv.updatedAt : null,
          };
          if (note) state.draftNotes[cid] = note;
        });
        state.evaluations = cleanEvals;
      }
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          bookmarks: state.bookmarks,
          shortlist: state.shortlist,
          topPickId: state.topPickId,
          evaluations: state.evaluations,
        })
      );
    } catch (_) {
      // Ignore storage quota errors cleanly
    }
  }

  // -------------------- SVG Icon Helpers --------------------
  function iconBookmark(saved) {
    return `
      <svg class="w-4 h-4 ${saved ? 'text-[#1A1A1A] fill-[#1A1A1A]' : 'text-[#1A1A1A]'}" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
      if (state.onlyShortlisted && !state.shortlist.includes(c.id)) return false;
      if (q) {
        const creator = getCreatorById(c.creatorId);
        const campus = getCampusById(c.campusId);
        const haystack = [
          c.title,
          c.versionCode || '',
          c.versionShortName || '',
          c.materialSummary || '',
          c.story || '',
          c.specs || '',
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
      if (state.sortBy === 'rating') {
        const scoreA = getConceptAverageScore(a.id);
        const scoreB = getConceptAverageScore(b.id);
        if ((scoreB ?? -1) !== (scoreA ?? -1)) return (scoreB ?? -1) - (scoreA ?? -1);
        return Number(state.topPickId === b.id) - Number(state.topPickId === a.id);
      }
      if (state.sortBy === 'shortlisted') {
        const topDiff = Number(state.topPickId === b.id) - Number(state.topPickId === a.id);
        if (topDiff !== 0) return topDiff;
        const shortDiff = Number(state.shortlist.includes(b.id)) - Number(state.shortlist.includes(a.id));
        if (shortDiff !== 0) return shortDiff;
        return (getConceptAverageScore(b.id) ?? -1) - (getConceptAverageScore(a.id) ?? -1);
      }
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
    const totalViews = state.concepts.reduce(
      (sum, c) => sum + (Array.isArray(c.galleryImages) && c.galleryImages.length ? c.galleryImages.length : 1),
      0
    );
    const vnuCount = CAMPUSES.filter((c) => c.isVnuHcm).length;

    if (state.activeCampus === 'all') {
      const featured = state.concepts.find((c) => c.featured) || state.concepts[0];
      const creator = getCreatorById(featured.creatorId);

      container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <!-- Left Editorial Statement (GALERIE Hero) -->
          <div class="lg:col-span-6 space-y-6">
            <p class="gallery-badge">
              Triển lãm hiện tại
            </p>

            <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.06] text-[#1A1A1A]">
              Bản sắc <span class="italic font-semibold">Sinh viên</span>
            </h1>

            <p class="text-base sm:text-lg text-[#666666] max-w-xl leading-relaxed font-normal">
              Bộ sưu tập tuyển chọn ${totalConcepts} thiết kế vật phẩm tối giản gồm Bình giữ nhiệt Inox 500ml, Lót chuột Deskpad và loạt 4 phiên bản Móc khóa ngành Khoa học Máy tính (HCMUT · CSE) để bình chọn & đánh giá.
            </p>

            <div class="flex flex-wrap items-center gap-3.5 pt-2">
              <a href="#cs-keychain-lab" class="gallery-btn-primary">
                Bình chọn Móc khóa
              </a>
              <a href="#gallery" class="gallery-btn-outline">
                Xem triển lãm
              </a>
              <a href="#campus-hubs" class="gallery-btn-outline">
                Chọn trường ĐH
              </a>
            </div>

            <!-- Quiet Curatorial Summary -->
            <div class="grid grid-cols-3 gap-6 pt-8 border-t border-[#E5E5E5] max-w-lg">
              <div>
                <div class="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]">${padCount(totalConcepts)}</div>
                <div class="text-xs uppercase tracking-wider text-[#666666] mt-1">Tác phẩm</div>
              </div>
              <div>
                <div class="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]">${padCount(totalViews)}</div>
                <div class="text-xs uppercase tracking-wider text-[#666666] mt-1">Ảnh studio</div>
              </div>
              <div>
                <div class="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]">${padCount(vnuCount)}</div>
                <div class="text-xs uppercase tracking-wider text-[#666666] mt-1">Trường ĐHQG</div>
              </div>
            </div>
          </div>

          <!-- Right Framed Spotlight Artwork -->
          <div class="lg:col-span-6">
            <article class="gallery-card group">
              <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="art-frame block w-full aspect-[4/3] bg-[#F5F5F5] cursor-pointer">
                ${renderMerchIllustration(featured, 0)}
              </button>

              <div class="p-6 bg-white border-t border-[#E5E5E5]">
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div class="sm:col-span-8">
                    <div class="gallery-badge mb-1.5">Featured</div>
                    <h2 class="font-display text-2xl font-bold text-[#1A1A1A] leading-snug">
                      <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="text-left hover:text-[#666666] transition-colors cursor-pointer">
                        ${escapeHtml(featured.title)}
                      </button>
                    </h2>
                    <div class="text-sm text-[#666666] mt-1">
                      by
                      <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                        ${escapeHtml(creator.name)}
                      </button>
                    </div>
                  </div>

                  <div class="sm:col-span-4 sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5]">
                    <div>
                      <div class="text-xs uppercase tracking-wider text-[#666666]">Nguồn</div>
                      <div class="font-semibold text-sm text-[#1A1A1A]">${escapeHtml(featured.source || 'HCMUT')}</div>
                    </div>
                    <button type="button" data-open-concept="${escapeHtml(featured.id)}" class="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] hover:text-[#666666] transition-colors cursor-pointer">
                      Chi tiết →
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
    const campusViews = campusConcepts.reduce(
      (sum, c) => sum + (Array.isArray(c.galleryImages) && c.galleryImages.length ? c.galleryImages.length : 1),
      0
    );
    const topDesign = campusConcepts.find((c) => c.featured) || campusConcepts[0] || null;
    const topCreator = topDesign ? getCreatorById(topDesign.creatorId) : null;
    const uniqueCreatorCount = new Set(campusConcepts.map((c) => c.creatorId)).size;

    container.innerHTML = `
      <div class="border border-[#E5E5E5] bg-white p-6 sm:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 space-y-5">
            <div class="flex flex-wrap items-center gap-4">
              <button type="button" id="backToGlobalBtn" class="gallery-btn-outline gallery-btn-sm">
                ← Triển lãm chung
              </button>
              <span class="gallery-badge">
                Không gian trường — ${escapeHtml(campus.city)}
              </span>
            </div>

            <div class="flex items-start sm:items-center gap-4 pt-1">
              ${renderCampusEmblem(campus)}
              <div>
                <h1 class="font-display text-3xl sm:text-5xl font-bold text-[#1A1A1A]">
                  ${escapeHtml(campus.name)}
                </h1>
                <p class="font-display italic text-lg text-[#666666] mt-0.5">“${escapeHtml(campus.motto)}”</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#666666]">
              <span class="uppercase tracking-wider">Màu bản sắc:</span>
              <span class="inline-flex items-center gap-2 text-[#1A1A1A] tabular-nums">
                <span class="w-3 h-3 rounded-full border border-[#E5E5E5]" style="background:${escapeHtml(campus.color)}"></span>
                ${escapeHtml(campus.color)}
              </span>
              <span class="inline-flex items-center gap-2 text-[#1A1A1A] tabular-nums">
                <span class="w-3 h-3 rounded-full border border-[#E5E5E5]" style="background:${escapeHtml(campus.secondaryColor)}"></span>
                ${escapeHtml(campus.secondaryColor)}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-6 pt-5 border-t border-[#E5E5E5] max-w-lg">
              <div>
                <div class="font-display text-3xl font-bold text-[#1A1A1A]">${padCount(campusConcepts.length)}</div>
                <div class="text-xs uppercase tracking-wider text-[#666666] mt-1">Tác phẩm</div>
              </div>
              <div>
                <div class="font-display text-3xl font-bold text-[#1A1A1A]">${campusConcepts.length > 0 ? padCount(campusViews) : '—'}</div>
                <div class="text-xs uppercase tracking-wider text-[#666666] mt-1">Ảnh studio</div>
              </div>
              <div>
                <div class="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A]">${campusConcepts.length > 0 ? padCount(uniqueCreatorCount) : '—'}</div>
                <div class="text-xs uppercase tracking-wider text-[#666666] mt-1">${campusConcepts.length > 0 ? 'Đóng góp' : 'Đang mở'}</div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            ${
              topDesign
                ? `
              <div class="border border-[#E5E5E5] bg-[#FAFAFA] p-5">
                <div class="flex items-center justify-between text-xs uppercase tracking-wider text-[#666666] mb-3">
                  <span>Tiêu biểu — ${escapeHtml(campus.shortName)}</span>
                  <span>${topCreator ? `by ${escapeHtml(topCreator.name)}` : 'Showcase'}</span>
                </div>
                <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="art-frame block w-full aspect-[4/3] bg-[#F5F5F5] cursor-pointer mb-4">
                  ${renderMerchIllustration(topDesign, 0)}
                </button>
                <div class="flex items-center justify-between gap-3">
                  <h3 class="font-display text-lg font-bold text-[#1A1A1A] truncate">${escapeHtml(topDesign.title)}</h3>
                  <button type="button" data-open-concept="${escapeHtml(topDesign.id)}" class="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] hover:text-[#666666] shrink-0 cursor-pointer">
                    Chi tiết →
                  </button>
                </div>
              </div>
              `
                : `
              <div class="p-8 bg-[#FAFAFA] border border-[#E5E5E5] text-center space-y-4">
                <div class="font-display text-2xl font-bold text-[#1A1A1A]">${escapeHtml(campus.shortName)} đang biên tập</div>
                <p class="text-sm text-[#666666] leading-relaxed">
                  Phòng trưng bày hiện tập trung vào bộ sưu tập chuẩn của <strong>HCMUT</strong>. Cổng tự thêm mẫu cho các trường thành viên nằm trong lộ trình Feature Work.
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
      <button type="button" data-campus-id="all" class="text-left p-4 bg-white border transition-colors flex flex-col cursor-pointer ${
        allActive ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]' : 'border-[#E5E5E5] hover:border-[#1A1A1A]'
      }">
        <div class="flex items-center gap-3 mb-2.5">
          <div class="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-medium tracking-wider shrink-0">
            ALL
          </div>
          <div class="min-w-0">
            <div class="font-display font-bold text-base leading-tight text-[#1A1A1A]">Liên Trường</div>
            <div class="text-[11px] text-[#666666] mt-0.5 whitespace-nowrap">${state.concepts.length} tác phẩm</div>
          </div>
        </div>
        <p class="text-xs text-[#666666] line-clamp-2 mt-auto">Toàn bộ tác phẩm trưng bày.</p>
      </button>
    `;

    const campusCards = visibleCampuses
      .map((campus) => {
        const count = state.concepts.filter((c) => c.campusId === campus.id).length;
        const isActive = state.activeCampus === campus.id;
        const statusText = count > 0 ? `${count} tác phẩm` : 'Sắp cập nhật';
        const vnuLabel = campus.isVnuHcm
          ? `<span class="text-[11px] uppercase tracking-wider text-[#666666]">ĐHQG-HCM</span>`
          : '';

        return `
          <button type="button" data-campus-id="${escapeHtml(campus.id)}" class="text-left p-4 bg-white border transition-colors flex flex-col cursor-pointer ${
            isActive ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]' : 'border-[#E5E5E5] hover:border-[#1A1A1A]'
          }">
            <div class="flex items-center gap-3 mb-2.5">
              ${renderCampusEmblem(campus)}
              <div class="min-w-0">
                <div class="font-display font-bold text-base leading-tight text-[#1A1A1A] truncate">${escapeHtml(campus.shortName)}</div>
                <div class="text-[11px] text-[#666666] mt-0.5 whitespace-nowrap">${statusText}</div>
              </div>
            </div>
            <div class="mt-auto space-y-0.5">
              ${vnuLabel}
              <p class="text-xs text-[#666666] line-clamp-2">${escapeHtml(campus.name)}</p>
            </div>
          </button>
        `;
      })
      .join('');

    strip.innerHTML = allCard + campusCards;
  }

  // -------------------- Render: CS Keychain Selection & Comparison Lab --------------------
  function renderKeychainLab() {
    const container = document.getElementById('keychainLabContainer');
    if (!container) return;

    const allKeychains = state.concepts.filter((c) => c.seriesId === KEYCHAIN_SERIES_ID);
    if (allKeychains.length === 0) {
      container.innerHTML = '';
      return;
    }

    const shortlistedKeychains = allKeychains.filter((c) => state.shortlist.includes(c.id));
    const ratedKeychains = allKeychains.filter((c) => isConceptRated(c.id));
    const topPick = allKeychains.find((c) => c.id === state.topPickId) || null;
    const hasAnyUserAction =
      shortlistedKeychains.length > 0 || ratedKeychains.length > 0 || Boolean(topPick);

    const visibleKeychains = allKeychains.filter((c) => {
      if (state.labFilter === 'shortlisted') return state.shortlist.includes(c.id);
      if (state.labFilter === 'rated') return isConceptRated(c.id);
      return true;
    });

    const filterTabs = [
      { id: 'all', label: `Tất cả (${allKeychains.length})` },
      { id: 'shortlisted', label: `Đã chọn lọc (${shortlistedKeychains.length})` },
      { id: 'rated', label: `Đã chấm điểm (${ratedKeychains.length})` },
    ];

    container.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E5E5E5] mb-8">
        <div class="space-y-2 max-w-2xl">
          <p class="gallery-badge">Phòng tuyển chọn phiên bản — HCMUT · CSE</p>
          <h2 class="font-display text-3xl sm:text-5xl font-bold text-[#1A1A1A]">
            Móc Khóa <span class="italic font-semibold">Khoa Học Máy Tính</span>
          </h2>
          <p class="text-sm text-[#666666] leading-relaxed">
            So sánh trực tiếp 4 hướng thiết kế V1–V4 cho sinh viên Khoa Khoa học & Kỹ thuật Máy tính (Bách Khoa TP.HCM). Bấm chọn lọc các mẫu ưng ý, chấm điểm theo 3 tiêu chí trong chi tiết sản phẩm và chốt phương án #1 (lưu tự động trên trình duyệt).
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 border border-[#E5E5E5] bg-white px-5 py-3.5 shrink-0">
          <div>
            <div class="text-[11px] uppercase tracking-wider text-[#666666]">Chọn lọc</div>
            <div id="labShortlistCount" class="font-display text-xl font-bold text-[#1A1A1A] tabular-nums">${shortlistedKeychains.length}/${allKeychains.length}</div>
          </div>
          <div class="border-l border-[#E5E5E5] pl-4">
            <div class="text-[11px] uppercase tracking-wider text-[#666666]">Đã chấm</div>
            <div id="labRatedCount" class="font-display text-xl font-bold text-[#1A1A1A] tabular-nums">${ratedKeychains.length}/${allKeychains.length}</div>
          </div>
          <div class="border-l border-[#E5E5E5] pl-4">
            <div class="text-[11px] uppercase tracking-wider text-[#666666]">Phương án #1</div>
            <div id="labTopPickLabel" class="font-display text-xl font-bold ${topPick ? 'text-[#030391]' : 'text-[#999999]'}">${topPick ? escapeHtml(topPick.versionCode) : 'Chưa chốt'}</div>
          </div>
        </div>
      </div>

      <!-- Lab Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div class="flex flex-wrap items-center gap-5 border-b border-[#E5E5E5] sm:border-b-0" role="group" aria-label="Bộ lọc phiên bản móc khóa">
          ${filterTabs
            .map(
              (ft) => `
            <button type="button" data-lab-filter="${ft.id}" class="gallery-tab ${
              state.labFilter === ft.id ? 'gallery-tab--active' : ''
            }">
              ${escapeHtml(ft.label)}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button type="button" data-export-eval="true" class="gallery-btn-outline gallery-btn-sm">
            Sao chép báo cáo đánh giá
          </button>
          ${
            hasAnyUserAction
              ? `<button type="button" data-reset-eval="true" class="gallery-btn-outline gallery-btn-sm !border-[#D4D4D4] !text-[#666666] hover:!border-[#1A1A1A] hover:!text-white">
                   Đặt lại
                 </button>`
              : ''
          }
        </div>
      </div>

      <!-- 4-Version Comparison Cards -->
      ${
        visibleKeychains.length === 0
          ? `
        <div class="border border-[#E5E5E5] bg-white p-10 text-center mb-10">
          <p class="font-display text-2xl font-bold text-[#1A1A1A] mb-2">Chưa có phiên bản trong bộ lọc này</p>
          <p class="text-sm text-[#666666] mb-5">Hãy bấm “Chọn lọc” hoặc “Chấm điểm” trên một trong 4 phiên bản V1–V4 trước.</p>
          <button type="button" data-lab-filter="all" class="gallery-btn-primary gallery-btn-sm">Xem cả 4 phiên bản</button>
        </div>
      `
          : `
        <div id="keychainVersionGrid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          ${visibleKeychains
            .map((c) => {
              const isShort = state.shortlist.includes(c.id);
              const isTop = state.topPickId === c.id;
              const avg = getConceptAverageScore(c.id);
              const ev = getConceptEvaluation(c.id);

              return `
                <article class="gallery-card group flex flex-col ${
                  isTop ? '!border-[#030391] ring-1 ring-[#030391]' : isShort ? '!border-[#1A1A1A]' : ''
                }" data-version-card="${escapeHtml(c.id)}">
                  <div class="px-4 py-3 bg-white border-b border-[#E5E5E5] flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="version-pill">${escapeHtml(c.versionCode)}</span>
                      ${isTop ? '<span class="top-pick-pill">#1 Ưu tiên</span>' : ''}
                      ${
                        !isTop && isShort
                          ? '<span class="text-[11px] uppercase tracking-wider font-semibold text-[#1A1A1A] px-1.5 py-0.5 border border-[#1A1A1A]">Đã chọn</span>'
                          : ''
                      }
                    </div>
                    <span class="text-xs font-semibold tabular-nums ${avg !== null ? 'text-[#1A1A1A]' : 'text-[#999999]'}">
                      ${avg !== null ? `★ ${formatScore(avg)} / 5.0` : 'Chưa chấm'}
                    </span>
                  </div>

                  <div class="relative aspect-[4/3] overflow-hidden bg-[#F5F5F5]">
                    <button type="button" data-open-concept="${escapeHtml(c.id)}" class="art-frame block w-full h-full cursor-pointer" aria-label="Xem chi tiết ${escapeHtml(c.title)}">
                      ${renderMerchIllustration(c, 0)}
                    </button>
                  </div>

                  <div class="p-5 flex-1 flex flex-col bg-white space-y-3">
                    <div>
                      <h3 class="font-display text-lg font-bold text-[#1A1A1A] leading-snug">
                        <button type="button" data-open-concept="${escapeHtml(c.id)}" class="text-left hover:text-[#666666] transition-colors cursor-pointer">
                          ${escapeHtml(c.versionShortName)}
                        </button>
                      </h3>
                      <p class="text-xs text-[#666666] mt-1">${escapeHtml(c.materialSummary)}</p>
                      <div class="text-[11px] font-medium text-[#1A1A1A] tabular-nums mt-1.5">${escapeHtml(c.dimensions)} · ${escapeHtml(c.costTier)}</div>
                    </div>

                    <div class="text-xs space-y-1.5 pt-2 border-t border-[#E5E5E5]">
                      <div class="text-[#1A1A1A]"><span class="font-semibold text-[#030391]">+ Điểm mạnh:</span> ${escapeHtml(c.highlight)}</div>
                      <div class="text-[#666666]"><span class="font-semibold text-[#1A1A1A]">− Cân nhắc:</span> ${escapeHtml(c.tradeoff)}</div>
                    </div>

                    ${
                      ev.note
                        ? `<div class="bg-[#FAFAFA] border border-[#E5E5E5] px-2.5 py-2 text-xs text-[#1A1A1A] italic line-clamp-2">“${escapeHtml(ev.note)}”</div>`
                        : ''
                    }

                    <div class="mt-auto pt-3 border-t border-[#E5E5E5] space-y-1.5">
                      <div class="grid grid-cols-2 gap-1.5">
                        <button type="button" data-toggle-shortlist="${escapeHtml(c.id)}" class="py-2 px-2 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap border transition-colors cursor-pointer ${
                          isShort
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            : 'bg-white text-[#1A1A1A] border-[#D4D4D4] hover:border-[#1A1A1A]'
                        }">
                          ${isShort ? 'Đã chọn ✓' : 'Chọn lọc'}
                        </button>
                        <button type="button" data-open-rate="${escapeHtml(c.id)}" class="py-2 px-2 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap border border-[#D4D4D4] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors cursor-pointer">
                          ${avg !== null ? 'Sửa điểm' : 'Chấm điểm'}
                        </button>
                      </div>
                      <button type="button" data-set-top-pick="${escapeHtml(c.id)}" class="w-full py-2 px-2 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap border transition-colors cursor-pointer ${
                        isTop
                          ? 'bg-[#030391] text-white border-[#030391]'
                          : 'bg-white text-[#030391] border-[#CBD5E1] hover:border-[#030391]'
                      }">
                        ${isTop ? '#1 Phương án đã chốt' : 'Chốt phương án #1'}
                      </button>
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      `
      }

      <!-- Side-by-Side Comparison Matrix -->
      <div class="bg-white border border-[#E5E5E5]">
        <div class="px-5 py-3.5 border-b border-[#E5E5E5] flex items-center justify-between gap-4">
          <h3 class="text-xs uppercase tracking-[0.16em] font-semibold text-[#1A1A1A]">Bảng đối chiếu thông số 4 phiên bản</h3>
          <span class="text-xs text-[#666666] hidden sm:inline">Bấm vào tên phiên bản để xem 2 góc nhìn & chấm điểm chi tiết</span>
        </div>
        <div class="overflow-x-auto">
          <table class="compare-table w-full">
            <thead>
              <tr>
                <th>Phiên bản</th>
                <th>Chất liệu & Công nghệ</th>
                <th>Kích thước</th>
                <th>Chi phí dự kiến</th>
                <th>Điểm TB (3 tiêu chí)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${allKeychains
                .map((c) => {
                  const avg = getConceptAverageScore(c.id);
                  const isShort = state.shortlist.includes(c.id);
                  const isTop = state.topPickId === c.id;
                  const statusLabel = isTop
                    ? '<span class="top-pick-pill">#1 Đã chốt</span>'
                    : isShort
                      ? '<span class="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] border border-[#1A1A1A] px-2 py-0.5">Đã chọn lọc</span>'
                      : '<span class="text-xs text-[#999999]">Đang xem xét</span>';

                  return `
                    <tr class="hover:bg-[#FAFAFA] transition-colors">
                      <td class="whitespace-nowrap">
                        <button type="button" data-open-concept="${escapeHtml(c.id)}" class="inline-flex items-center gap-2 font-semibold text-[#1A1A1A] hover:underline cursor-pointer text-left">
                          <span class="version-pill">${escapeHtml(c.versionCode)}</span>
                          <span>${escapeHtml(c.versionShortName)}</span>
                        </button>
                      </td>
                      <td>${escapeHtml(c.materialSummary)}</td>
                      <td class="tabular-nums whitespace-nowrap">${escapeHtml(c.dimensions)}</td>
                      <td class="tabular-nums whitespace-nowrap">${escapeHtml(c.costTier)}</td>
                      <td class="tabular-nums whitespace-nowrap font-semibold">${avg !== null ? `★ ${formatScore(avg)} / 5.0` : '<span class="text-[#999999] font-normal">Chưa chấm</span>'}</td>
                      <td class="whitespace-nowrap">${statusLabel}</td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // -------------------- Render: Category Filter Tabs --------------------
  function renderCategoryFilters() {
    const bar = document.getElementById('categoryFilterBar');
    if (!bar) return;

    const scopedConcepts = state.concepts.filter(
      (c) => state.activeCampus === 'all' || c.campusId === state.activeCampus
    );

    const categoryButtonsHtml = CATEGORIES.map((cat) => {
      const count =
        cat.id === 'all'
          ? scopedConcepts.length
          : scopedConcepts.filter((c) => c.category === cat.id).length;
      const baseLabel = cat.id === 'all' ? 'Tất cả' : cat.label;
      const active = state.activeCategory === cat.id && !state.onlyShortlisted;
      return `
        <button type="button" data-category-id="${escapeHtml(cat.id)}" class="gallery-tab ${
          active ? 'gallery-tab--active' : ''
        }">
          ${escapeHtml(`${baseLabel} (${count})`)}
        </button>
      `;
    }).join('');

    const shortlistedInScopeCount = scopedConcepts.filter((c) => state.shortlist.includes(c.id)).length;
    const shortlistToggleHtml = `
      <button type="button" data-toggle-only-shortlisted="true" class="gallery-tab ${
        state.onlyShortlisted ? 'gallery-tab--active !text-[#030391] !border-[#030391]' : ''
      }">
        Đã chọn lọc (${shortlistedInScopeCount})
      </button>
    `;

    bar.innerHTML = categoryButtonsHtml + shortlistToggleHtml;
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
    countBadge.textContent = `${items.length} tác phẩm — ${campusLabel}`;

    if (items.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');

    grid.innerHTML = items
      .map((item) => {
        const creator = getCreatorById(item.creatorId);
        const isBookmarked = state.bookmarks.includes(item.id);
        const isShortlisted = state.shortlist.includes(item.id);
        const isTopPick = state.topPickId === item.id;
        const avgScore = getConceptAverageScore(item.id);

        return `
          <article class="gallery-card group flex flex-col">
            <!-- Pure Editorial Art Frame -->
            <div class="relative aspect-[4/3] overflow-hidden bg-[#F5F5F5]">
              <button type="button" data-open-concept="${escapeHtml(item.id)}" class="art-frame block w-full h-full cursor-pointer" aria-label="Mở chi tiết ${escapeHtml(item.title)}">
                ${renderMerchIllustration(item, 0)}
              </button>

              <div class="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 flex-wrap pointer-events-none">
                ${item.versionCode ? `<span class="version-pill">${escapeHtml(item.versionCode)}</span>` : ''}
                ${isTopPick ? `<span class="top-pick-pill">#1 Ưu tiên</span>` : ''}
                ${
                  !isTopPick && isShortlisted
                    ? `<span class="px-2 py-0.5 text-[11px] uppercase tracking-wider font-semibold bg-white text-[#1A1A1A] border border-[#1A1A1A]">Đã chọn lọc</span>`
                    : ''
                }
              </div>

              <button type="button" data-toggle-bookmark="${escapeHtml(item.id)}" class="gallery-btn-icon absolute top-3.5 right-3.5 z-10 ${
                isBookmarked ? '!bg-white !border-[#1A1A1A]' : ''
              }" aria-label="${isBookmarked ? 'Bỏ lưu tác phẩm' : 'Lưu tác phẩm'}" title="${isBookmarked ? 'Đã lưu' : 'Lưu tác phẩm'}">
                ${iconBookmark(isBookmarked)}
              </button>
            </div>

            <!-- GALERIE Style Museum Placard -->
            <div class="p-6 flex-1 flex flex-col bg-white">
              <div class="flex items-center justify-between gap-3 mb-2">
                <span class="text-xs uppercase tracking-[0.14em] text-[#666666] font-medium">
                  ${escapeHtml(getCategoryLabel(item.category))}
                </span>
                <div class="flex items-center gap-2.5">
                  ${
                    avgScore !== null
                      ? `<span class="text-xs font-semibold tabular-nums text-[#1A1A1A]">★ ${formatScore(avgScore)}</span>`
                      : ''
                  }
                  <div class="flex items-center gap-1.5" aria-label="Bảng màu sản phẩm">
                    ${(item.palette || [])
                      .slice(0, 4)
                      .map(
                        (hex) =>
                          `<span class="w-2.5 h-2.5 rounded-full border border-[#E5E5E5]" style="background:${escapeHtml(hex)}" title="${escapeHtml(hex)}"></span>`
                      )
                      .join('')}
                  </div>
                </div>
              </div>

              <h3 class="font-display text-xl sm:text-2xl font-bold leading-snug text-[#1A1A1A] mb-1">
                <button type="button" data-open-concept="${escapeHtml(item.id)}" class="text-left hover:text-[#666666] transition-colors cursor-pointer">
                  ${escapeHtml(item.title)}
                </button>
              </h3>

              <p class="text-sm text-[#666666] mb-5">
                by <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="hover:text-[#1A1A1A] transition-colors cursor-pointer">${escapeHtml(creator.name)}</button>
              </p>

              <div class="mt-auto pt-4 border-t border-[#E5E5E5] flex items-center justify-between gap-3">
                <div>
                  <span class="text-xs text-[#666666] uppercase tracking-wider mr-2">Nguồn</span>
                  <span class="font-semibold text-sm text-[#1A1A1A]">${escapeHtml(item.source || 'HCMUT')}</span>
                </div>
                <button type="button" data-open-concept="${escapeHtml(item.id)}" class="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] hover:text-[#666666] transition-colors cursor-pointer">
                  Chi tiết & Chấm điểm →
                </button>
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
        <div class="border border-[#E5E5E5] bg-white p-8 text-center">
          <p class="font-display text-xl font-bold text-[#1A1A1A] mb-1">Chưa lưu tác phẩm nào</p>
          <p class="text-xs text-[#666666] leading-relaxed">Nhấn biểu tượng lưu ở góc trên bên phải mỗi tác phẩm để tổng hợp thành bộ sưu tập cá nhân.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = bookmarkedItems
      .map((item) => {
        const campus = getCampusById(item.campusId);
        return `
          <div class="border border-[#E5E5E5] bg-white p-3.5 flex items-center gap-3.5">
            <button type="button" data-open-concept="${escapeHtml(item.id)}" class="w-20 h-15 aspect-[4/3] overflow-hidden border border-[#E5E5E5] shrink-0 cursor-pointer bg-[#F5F5F5]">
              ${renderMerchIllustration(item, 0)}
            </button>
            <div class="min-w-0 flex-1">
              <div class="text-xs uppercase tracking-wider text-[#666666]">${escapeHtml(campus.shortName)} — ${escapeHtml(getCategoryLabel(item.category))}</div>
              <button type="button" data-open-concept="${escapeHtml(item.id)}" class="font-display font-bold text-base text-left line-clamp-2 hover:text-[#666666] cursor-pointer text-[#1A1A1A]">
                ${escapeHtml(item.title)}
              </button>
            </div>
            <button type="button" data-toggle-bookmark="${escapeHtml(item.id)}" class="gallery-btn-icon shrink-0" aria-label="Xóa khỏi đã lưu">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        `;
      })
      .join('');
  }

  // -------------------- Modal 1: Concept Detail Showcase & Evaluation --------------------
  function openConceptModal(conceptId, focusEval = false) {
    state.activeConceptId = conceptId;
    state.activeDetailView = 0;
    renderConceptModal();
    document.getElementById('conceptModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (focusEval) {
      window.requestAnimationFrame(() => {
        const panel = document.getElementById('conceptEvalPanel');
        if (panel && panel.scrollIntoView) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
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
    const isShortlisted = state.shortlist.includes(concept.id);
    const isTopPick = state.topPickId === concept.id;
    const isKeychainSeries = concept.seriesId === KEYCHAIN_SERIES_ID;
    const ev = getConceptEvaluation(concept.id);
    const avgScore = getConceptAverageScore(concept.id);
    const currentNoteVal =
      typeof state.draftNotes[concept.id] === 'string' ? state.draftNotes[concept.id] : ev.note;

    const galleryImages = Array.isArray(concept.galleryImages) ? concept.galleryImages : [];
    const viewCount = galleryImages.length > 0 ? galleryImages.length : 1;
    const rawLabels =
      Array.isArray(concept.viewLabels) && concept.viewLabels.length > 0
        ? concept.viewLabels
        : ['Phối cảnh Studio'];
    const labels = Array.from({ length: viewCount }, (_, idx) => rawLabels[idx] || `Góc nhìn ${idx + 1}`);
    const activeView = state.activeDetailView < labels.length ? state.activeDetailView : 0;
    state.activeDetailView = activeView;
    const viewButtons = labels.map((label, idx) => ({ idx, label }));
    const viewGridClass = viewButtons.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

    body.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <!-- Left Column: Studio Artwork (2 Synchronized Angles) -->
        <div class="lg:col-span-6 space-y-4">
          <div class="border border-[#E5E5E5] bg-white p-3">
            <div id="detailArtworkFrame" class="art-frame aspect-[4/3] bg-[#F5F5F5]">
              ${renderMerchIllustration(concept, activeView)}
            </div>
            ${
              viewButtons.length > 1
                ? `
            <div class="grid ${viewGridClass} gap-2 mt-3 pt-2 border-t border-[#E5E5E5]">
              ${viewButtons
                .map(
                  (vb) => `
                <button type="button" data-detail-view="${vb.idx}" class="py-2 px-2 text-xs font-medium border transition-colors cursor-pointer ${
                    activeView === vb.idx
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#666666] border-[#E5E5E5] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                  }">
                  ${escapeHtml(vb.label)}
                </button>
              `
                )
                .join('')}
            </div>
            `
                : ''
            }
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

        <!-- Right Column: Curatorial Placard Info + Interactive Selection & Rating -->
        <div class="lg:col-span-6 space-y-6 pr-2">
          <div class="pr-8">
            <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#666666] mb-2">
              ${concept.versionCode ? `<span class="version-pill">${escapeHtml(concept.versionCode)}</span>` : ''}
              <span class="font-semibold text-[#1A1A1A]">${escapeHtml(campus.shortName)}</span>
              <span>/</span>
              <span>${escapeHtml(getCategoryLabel(concept.category))}</span>
              <span>/</span>
              <span>Nguồn: ${escapeHtml(concept.source || 'HCMUT')}</span>
            </div>

            <h2 id="conceptModalTitle" class="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-tight">
              ${escapeHtml(concept.title)}
            </h2>

            <div class="flex items-center justify-between gap-3 mt-4 py-3 border-y border-[#E5E5E5]">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 text-white flex items-center justify-center text-xs font-semibold shrink-0" style="background:${escapeHtml(creator.avatarBg || '#1A1A1A')}">
                  ${escapeHtml(creator.initials)}
                </div>
                <div>
                  <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="text-sm font-medium text-[#1A1A1A] hover:text-[#666666] transition-colors cursor-pointer block text-left">
                    by ${escapeHtml(creator.name)}
                  </button>
                  <div class="text-xs text-[#666666]">${escapeHtml(creator.faculty)} · ${formatDateDisplay(concept.createdAt)}</div>
                </div>
              </div>

              <button type="button" data-open-creator="${escapeHtml(creator.id)}" class="gallery-btn-outline gallery-btn-sm shrink-0 whitespace-nowrap">
                Hồ sơ
              </button>
            </div>
          </div>

          ${
            concept.story && concept.story.trim()
              ? `
          <div>
            <div class="text-xs uppercase tracking-widest text-[#666666] font-medium mb-1.5">Câu chuyện thiết kế</div>
            <p class="text-sm text-[#1A1A1A]/90 leading-relaxed">${escapeHtml(concept.story)}</p>
          </div>
          `
              : ''
          }

          <!-- Palette & Material Specs -->
          <div class="bg-white border border-[#E5E5E5] p-5 space-y-4">
            <div>
              <div class="text-xs uppercase tracking-widest text-[#666666] font-medium mb-2.5">Bảng màu chuẩn nhận diện (Bấm để sao chép HEX)</div>
              <div class="flex flex-wrap gap-2">
                ${(concept.palette || [])
                  .map(
                    (hex) => `
                  <button type="button" data-copy-hex="${escapeHtml(hex)}" class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAFAFA] border border-[#E5E5E5] hover:border-[#1A1A1A] text-xs tabular-nums font-medium cursor-pointer transition-colors">
                    <span class="w-3.5 h-3.5 rounded-full border border-[#D4D4D4]" style="background:${escapeHtml(hex)}"></span>
                    ${escapeHtml(hex)}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>

            <div class="border-t border-[#E5E5E5] pt-4">
              <div class="text-xs uppercase tracking-widest text-[#666666] font-medium mb-1.5">Thông số chất liệu</div>
              <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">${escapeHtml(concept.specs || 'Đang cập nhật thông số.')}</p>
            </div>
          </div>

          <!-- Interactive Selection & 3-Criteria Rating Panel -->
          <div id="conceptEvalPanel" class="bg-white border border-[#E5E5E5] p-5 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E5E5]">
              <div>
                <div class="text-xs uppercase tracking-widest text-[#666666] font-medium">Đánh giá & Chọn lọc</div>
                <div id="conceptEvalAvgText" class="text-lg font-display font-bold text-[#1A1A1A] tabular-nums mt-0.5">
                  ${avgScore !== null ? `${formatScore(avgScore)} / 5.0` : 'Chưa chấm điểm'}
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" data-toggle-shortlist="${escapeHtml(concept.id)}" class="gallery-btn-sm border text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                  isShortlisted
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                }">
                  ${isShortlisted ? 'Đã chọn lọc ✓' : 'Chọn lọc'}
                </button>
                ${
                  isKeychainSeries
                    ? `<button type="button" data-set-top-pick="${escapeHtml(concept.id)}" class="gallery-btn-sm border text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                        isTopPick
                          ? 'bg-[#030391] text-white border-[#030391]'
                          : 'bg-white text-[#030391] border-[#030391] hover:bg-[#030391] hover:text-white'
                      }">
                        ${isTopPick ? '#1 Đã chốt' : 'Chốt phương án #1'}
                      </button>`
                    : ''
                }
              </div>
            </div>

            <div class="space-y-3">
              ${CRITERIA_LIST.map((cr) => {
                const currentVal = ev[cr.key];
                return `
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span class="text-xs font-medium text-[#1A1A1A]">${escapeHtml(cr.label)}</span>
                    <div class="flex items-center gap-1.5" role="group" aria-label="Chấm điểm ${escapeHtml(cr.label)}">
                      ${[1, 2, 3, 4, 5]
                        .map(
                          (score) => `
                        <button type="button"
                          data-rate-concept="${escapeHtml(concept.id)}"
                          data-rate-criterion="${escapeHtml(cr.key)}"
                          data-rate-value="${score}"
                          class="eval-score-btn ${currentVal === score ? 'eval-score-btn--active' : ''}"
                          aria-pressed="${currentVal === score ? 'true' : 'false'}"
                        >
                          ${score}
                        </button>
                      `
                        )
                        .join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="pt-3 border-t border-[#E5E5E5] space-y-2.5">
              <label for="conceptEvalNote" class="block text-xs uppercase tracking-widest text-[#666666] font-medium">
                Nhận xét & Đề xuất tinh chỉnh
              </label>
              <textarea id="conceptEvalNote" rows="2" class="w-full border border-[#D4D4D4] bg-[#FAFAFA] px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]" placeholder="Ghi chú chất liệu, độ bền, kích thước hoặc cảm nhận khi chọn mẫu này...">${escapeHtml(currentNoteVal)}</textarea>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <span class="text-[11px] text-[#666666]">Lưu cục bộ trong trình duyệt (localStorage).</span>
                <button type="button" id="saveConceptEvalBtn" data-save-eval="${escapeHtml(concept.id)}" class="gallery-btn-primary gallery-btn-sm">
                  Lưu đánh giá
                </button>
              </div>
              ${
                ev.note
                  ? `<div id="savedEvalNotePreview" class="bg-[#FAFAFA] border border-[#E5E5E5] px-3 py-2 text-xs text-[#1A1A1A]">
                       <span class="uppercase tracking-wider text-[10px] font-semibold text-[#666666] block mb-0.5">Nhận xét đã lưu</span>
                       <span>“${escapeHtml(ev.note)}”</span>
                     </div>`
                  : ''
              }
            </div>
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

    const noteInput = document.getElementById('conceptEvalNote');
    if (noteInput) {
      noteInput.addEventListener('input', (e) => {
        state.draftNotes[concept.id] = e.target.value;
      });
    }

    const saveEvalBtn = document.getElementById('saveConceptEvalBtn');
    if (saveEvalBtn) {
      saveEvalBtn.addEventListener('click', () => {
        saveEvaluationNote(concept.id);
      });
    }
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
        <div class="flex flex-col sm:flex-row sm:items-center gap-5 pr-8 border-b border-[#E5E5E5] pb-6">
          <div class="w-16 h-16 text-white flex items-center justify-center font-display text-xl font-bold shrink-0" style="background:${escapeHtml(creator.avatarBg || '#1A1A1A')}">
            ${escapeHtml(creator.initials)}
          </div>
          <div class="space-y-1">
            <div class="gallery-badge">Hồ sơ lưu trữ — ${escapeHtml(campus.name)}</div>
            <h2 id="creatorModalTitle" class="font-display text-3xl font-bold text-[#1A1A1A]">${escapeHtml(creator.name)}</h2>
            <p class="text-xs text-[#666666]">${escapeHtml(creator.handle)} · ${escapeHtml(creator.faculty)}</p>
          </div>
        </div>

        <p class="text-sm text-[#666666] leading-relaxed">${escapeHtml(creator.bio)}</p>

        <div>
          <h3 class="text-xs uppercase tracking-widest text-[#666666] font-medium mb-4">Tác phẩm đang trưng bày (${works.length})</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            ${works
              .map(
                (w) => `
              <button type="button" data-open-concept="${escapeHtml(w.id)}" class="gallery-card text-left p-3 cursor-pointer flex items-center gap-3.5">
                <div class="w-24 aspect-[4/3] overflow-hidden bg-[#F5F5F5] border border-[#E5E5E5] shrink-0">
                  ${renderMerchIllustration(w, 0)}
                </div>
                <div class="min-w-0">
                  <div class="text-xs uppercase tracking-wider text-[#666666]">${escapeHtml(getCategoryLabel(w.category))}</div>
                  <div class="font-display font-bold text-base text-[#1A1A1A] line-clamp-2 mt-0.5">${escapeHtml(w.title)}</div>
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
    renderKeychainLab();
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

      const labFilterBtn = e.target.closest('[data-lab-filter]');
      if (labFilterBtn) {
        state.labFilter = labFilterBtn.dataset.labFilter;
        renderKeychainLab();
        return;
      }

      const exportEvalBtn = e.target.closest('[data-export-eval]');
      if (exportEvalBtn) {
        copyToClipboard(formatEvaluationReport(), 'Đã sao chép báo cáo đánh giá vào clipboard!');
        return;
      }

      const resetEvalBtn = e.target.closest('[data-reset-eval]');
      if (resetEvalBtn) {
        resetAllEvaluations();
        return;
      }

      const shortlistBtn = e.target.closest('[data-toggle-shortlist]');
      if (shortlistBtn) {
        toggleShortlist(shortlistBtn.dataset.toggleShortlist);
        return;
      }

      const topPickBtn = e.target.closest('[data-set-top-pick]');
      if (topPickBtn) {
        setTopPick(topPickBtn.dataset.setTopPick);
        return;
      }

      const openRateBtn = e.target.closest('[data-open-rate]');
      if (openRateBtn) {
        closeBookmarksDrawer();
        closeCreatorModal();
        openConceptModal(openRateBtn.dataset.openRate, true);
        return;
      }

      const rateBtn = e.target.closest('[data-rate-criterion]');
      if (rateBtn) {
        setCriterionScore(
          rateBtn.dataset.rateConcept,
          rateBtn.dataset.rateCriterion,
          rateBtn.dataset.rateValue
        );
        return;
      }

      const categoryBtn = e.target.closest('[data-category-id]');
      if (categoryBtn) {
        state.activeCategory = categoryBtn.dataset.categoryId;
        state.onlyShortlisted = false;
        renderCategoryFilters();
        renderGallery();
        return;
      }

      const onlyShortBtn = e.target.closest('[data-toggle-only-shortlisted]');
      if (onlyShortBtn) {
        state.onlyShortlisted = !state.onlyShortlisted;
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
        const noteEl = document.getElementById('conceptEvalNote');
        if (noteEl && state.activeConceptId) {
          state.draftNotes[state.activeConceptId] = noteEl.value;
        }
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
        state.onlyShortlisted = false;
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
    document.getElementById('closeBookmarksDrawerBtn')?.addEventListener('click', closeBookmarksDrawer);

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
        if (!e.target || !e.target.isConnected) return;
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
