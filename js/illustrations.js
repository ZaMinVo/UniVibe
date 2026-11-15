/* ==========================================================================
   UniVibe — Realistic Studio Product Mockup Engine & Brand Identity Renderer
   UI Shell: Hand-Drawn Sketchbook | Product Artworks: Realistic Studio Style
   ========================================================================== */

(function (global) {
  'use strict';

  function escapeXml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safePalette(palette) {
    const fallback = ['#1488DB', '#030391', '#FFFFFF', '#0F172A'];
    if (!Array.isArray(palette) || palette.length === 0) return fallback;
    return [
      palette[0] || fallback[0],
      palette[1] || fallback[1],
      palette[2] || fallback[2],
      palette[3] || fallback[3],
    ];
  }

  function makeUid(item, viewIndex) {
    const raw = (item && item.id ? item.id : 'uv') + '_' + String(viewIndex || 0);
    return raw.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  /**
   * Official HCMUT (ĐH Bách Khoa TP.HCM) Brand Mark
   * Structure: 3D isometric cube/honeycomb hexagon inside circular frame
   * Official Colors: Light Blue #1488DB | Dark Blue #030391 | White #FFFFFF
   * Variant: standard (light bg) | white-border (dark bg)
   */
  function renderHcmutBrandMark({ cx, cy, r, darkBg = false }) {
    const scale = r / 50;
    return `
      <g transform="translate(${cx}, ${cy}) scale(${scale})">
        ${darkBg ? `<circle cx="0" cy="0" r="52" fill="#FFFFFF" />` : ''}
        <circle cx="0" cy="0" r="48" fill="#FFFFFF" stroke="#030391" stroke-width="3.2" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#1488DB" stroke-width="1.6" />
        <!-- Outer Honeycomb Hexagon -->
        <polygon points="0,-34 29.4,-17 29.4,17 0,34 -29.4,17 -29.4,-17" fill="#FFFFFF" stroke="#030391" stroke-width="2.4" stroke-linejoin="round" />
        <!-- 3D Isometric Cube Faces (HCMUT Honeycomb Geometry) -->
        <!-- Top Face (Light Blue #1488DB) -->
        <polygon points="0,-31 26,-16 0,-1 -26,-16" fill="#1488DB" />
        <!-- Left Face (Dark Blue #030391) -->
        <polygon points="-26,-14 0,1 0,31 -26,16" fill="#030391" />
        <!-- Right Face (Mid-Light Blue Highlight #1488DB + inner geometric B/K cut) -->
        <polygon points="26,-14 0,1 0,31 26,16" fill="#1488DB" opacity="0.88" />
        <!-- Crisp White Isometric Grid Dividers -->
        <path d="M0,-31 L0,31 M-26,-15 L0,0 L26,-15" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Subtle Center Hexagon Core -->
        <polygon points="0,-10 8.6,-5 8.6,5 0,10 -8.6,5 -8.6,-5" fill="#FFFFFF" stroke="#030391" stroke-width="1.8" />
        <text x="0" y="3.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="8.5" font-weight="700" fill="#030391" letter-spacing="0.4">BK</text>
      </g>
    `;
  }

  function renderStudioBackdrop(uid, isDarkSubject) {
    const bgTop = isDarkSubject ? '#E8EDF3' : '#F4F6F9';
    const bgBottom = isDarkSubject ? '#CFD8E3' : '#DCE3EC';
    return `
      <defs>
        <linearGradient id="${uid}_bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${bgTop}" />
          <stop offset="72%" stop-color="${bgBottom}" />
          <stop offset="100%" stop-color="#C7D1DE" />
        </linearGradient>
        <radialGradient id="${uid}_spot" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <filter id="${uid}_shadow" x="-18%" y="-18%" width="136%" height="145%">
          <feDropShadow dx="0" dy="14" stdDeviation="11" flood-color="#0F172A" flood-opacity="0.22" />
        </filter>
        <filter id="${uid}_softShadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#0F172A" flood-opacity="0.16" />
        </filter>
      </defs>
      <rect x="0" y="0" width="480" height="360" fill="url(#${uid}_bg)" />
      <rect x="0" y="0" width="480" height="360" fill="url(#${uid}_spot)" />
      <!-- Subtle Studio Floor Horizon -->
      <line x1="0" y1="298" x2="480" y2="298" stroke="#94A3B8" stroke-opacity="0.22" stroke-width="1" />
    `;
  }

  function renderRealisticTee(item, pal, viewIndex, uid) {
    const isNavy = item.designVariant === 'tee-navy' || pal[0] === '#030391';
    const isHcmut = !item.campusId || item.campusId === 'hcmut';
    const bodyBase = isNavy ? '#030391' : '#FFFFFF';
    const bodyShade = isNavy ? '#02026B' : '#E9EEF4';
    const bodyMid = isNavy ? '#0710A6' : '#F8FAFC';
    const foldStroke = isNavy ? 'rgba(255,255,255,0.09)' : 'rgba(15,23,42,0.08)';
    const seamStroke = isNavy ? 'rgba(20,136,219,0.35)' : 'rgba(15,23,42,0.14)';
    const textColor = isNavy ? '#FFFFFF' : '#030391';
    const accentBlue = '#1488DB';

    const fabricDefs = `
      <defs>
        <linearGradient id="${uid}_teeBody" x1="15%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stop-color="${bodyMid}" />
          <stop offset="48%" stop-color="${bodyBase}" />
          <stop offset="100%" stop-color="${bodyShade}" />
        </linearGradient>
        <linearGradient id="${uid}_sleeveL" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="${bodyShade}" />
          <stop offset="100%" stop-color="${bodyBase}" />
        </linearGradient>
        <linearGradient id="${uid}_sleeveR" x1="100%" y1="0%" x2="0%" y2="80%">
          <stop offset="0%" stop-color="${bodyShade}" />
          <stop offset="100%" stop-color="${bodyBase}" />
        </linearGradient>
        <radialGradient id="${uid}_chestSheen" cx="46%" cy="35%" r="55%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="${isNavy ? '0.12' : '0.65'}" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
      </defs>
    `;

    if (viewIndex === 2) {
      // View 2: Minimalist Spec & Official Brand Compliance Sheet
      return `
        ${fabricDefs}
        <g transform="translate(34, 24)">
          <rect x="0" y="0" width="412" height="302" rx="14" fill="#FFFFFF" filter="url(#${uid}_softShadow)" />
          <rect x="0" y="0" width="412" height="44" rx="14" fill="#030391" />
          <rect x="0" y="28" width="412" height="16" fill="#030391" />
          <text x="20" y="27" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="0.8">THÔNG SỐ KỸ THUẬT &amp; CHUẨN NHẬN DIỆN HCMUT</text>

          <!-- Mini Front & Back Wireframe Silhouettes -->
          <g transform="translate(26, 68)">
            <path d="M40 8 L66 8 C72 15, 84 15, 90 8 L116 8 L142 36 L126 62 L114 52 L114 148 L42 148 L42 52 L30 62 L14 36 Z" fill="${bodyBase}" stroke="#94A3B8" stroke-width="1.5" />
            ${isHcmut ? renderHcmutBrandMark({ cx: 92, cy: 52, r: 10, darkBg: isNavy }) : ''}
            <text x="78" y="168" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9.5" fill="#475569">MẶT TRƯỚC</text>
          </g>

          <g transform="translate(184, 68)">
            <path d="M40 8 L66 8 C72 11, 84 11, 90 8 L116 8 L142 36 L126 62 L114 52 L114 148 L42 148 L42 52 L30 62 L14 36 Z" fill="${bodyBase}" stroke="#94A3B8" stroke-width="1.5" />
            <polygon points="78,42 92,50 92,66 78,74 64,66 64,50" fill="none" stroke="${accentBlue}" stroke-width="1.5" />
            <text x="78" y="88" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="6.5" font-weight="700" fill="${textColor}">HCMUT · 1957</text>
            <text x="78" y="168" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9.5" fill="#475569">MẶT SAU</text>
          </g>

          <!-- Official Color & Fabric Specs -->
          <g transform="translate(342, 68)">
            <rect x="-12" y="4" width="66" height="32" rx="6" fill="#1488DB" />
            <text x="21" y="49" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9" font-weight="700" fill="#0F172A">#1488DB</text>
            <rect x="-12" y="64" width="66" height="32" rx="6" fill="#030391" />
            <text x="21" y="109" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9" font-weight="700" fill="#0F172A">#030391</text>
            <rect x="-12" y="124" width="66" height="32" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="21" y="169" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9" font-weight="700" fill="#0F172A">#FFFFFF</text>
          </g>

          <line x1="20" y1="258" x2="392" y2="258" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="20" y="278" font-family="'Space Mono', monospace" font-size="9.5" fill="#334155">100% COTTON COMBED 250GSM · FORM BOXY UNISEX · FONT ARIAL BOLD</text>
        </g>
      `;
    }

    if (viewIndex === 1) {
      // View 1: Realistic Back View + Macro Fabric/Patch Zoom
      return `
        ${fabricDefs}
        <g transform="translate(64, 20)" filter="url(#${uid}_shadow)">
          <!-- Back Tee Silhouette -->
          <path d="M112 22 C136 28, 172 28, 196 22 L238 30 L292 86 L256 138 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L52 138 L16 86 L70 30 Z"
                fill="url(#${uid}_teeBody)" />
          <!-- Sleeves Shading -->
          <path d="M70 30 L16 86 L52 138 L74 114 Z" fill="url(#${uid}_sleeveL)" opacity="0.55" />
          <path d="M238 30 L292 86 L256 138 L234 114 Z" fill="url(#${uid}_sleeveR)" opacity="0.55" />
          <!-- Back Ribbed Neckline -->
          <path d="M112 22 C136 33, 172 33, 196 22 L192 31 C170 40, 138 40, 116 31 Z" fill="${bodyShade}" stroke="${seamStroke}" stroke-width="1" />
          <!-- Subtle Fabric Drape Folds -->
          <path d="M98 124 Q102 210 96 288" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
          <path d="M210 128 Q206 212 212 288" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
          <path d="M74 284 C122 290, 186 290, 234 284" fill="none" stroke="${seamStroke}" stroke-width="1.2" stroke-dasharray="3 2" />

          <!-- Minimalist Back Graphic (Upper Center) -->
          <g transform="translate(154, 108)">
            <!-- Subtle Isometric Hexagon Motif -->
            <polygon points="0,-28 24.2,-14 24.2,14 0,28 -24.2,14 -24.2,-14" fill="none" stroke="${accentBlue}" stroke-width="1.8" opacity="0.9" />
            <path d="M0,-28 L0,0 M-24.2,-14 L0,0 L24.2,-14" fill="none" stroke="${accentBlue}" stroke-width="1.2" opacity="0.65" />
            <text x="0" y="48" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10.5" font-weight="700" fill="${textColor}" letter-spacing="2.5">HCMUT</text>
            <text x="0" y="61" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6.8" fill="${isNavy ? '#93C5FD' : '#475569'}" letter-spacing="1.2">268 LY THUONG KIET · EST. 1957</text>
          </g>
        </g>

        <!-- Macro Detail Lens (Right Corner) -->
        <g transform="translate(384, 240)" filter="url(#${uid}_softShadow)">
          <circle cx="0" cy="0" r="54" fill="${bodyBase}" stroke="#FFFFFF" stroke-width="4" />
          <circle cx="0" cy="0" r="50" fill="none" stroke="#1488DB" stroke-width="1.5" opacity="0.55" />
          <!-- Simulated Woven Hem Tag -->
          <rect x="-26" y="-12" width="52" height="24" rx="3" fill="${isNavy ? '#0B154D' : '#F8FAFC'}" stroke="${isNavy ? '#1488DB' : '#CBD5E1'}" stroke-width="1" />
          <rect x="-26" y="-12" width="12" height="24" rx="2" fill="#030391" />
          <rect x="-14" y="-12" width="6" height="24" fill="#1488DB" />
          <text x="8" y="3" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="8" font-weight="700" fill="${isNavy ? '#FFFFFF' : '#030391'}">HCMUT</text>
          <text x="0" y="36" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7" fill="${isNavy ? '#CBD5E1' : '#475569'}">TAG DỆT 2 MÀU</text>
        </g>
      `;
    }

    // View 0: Front Realistic Studio Mockup
    return `
      ${fabricDefs}
      <g transform="translate(86, 16)" filter="url(#${uid}_shadow)">
        <!-- Left & Right Sleeves -->
        <path d="M70 30 L14 92 L52 142 L76 114 Z" fill="url(#${uid}_sleeveL)" />
        <path d="M238 30 L294 92 L256 142 L232 114 Z" fill="url(#${uid}_sleeveR)" />
        <!-- Minimalist Dual-Blue Sleeve Cuff Trim (Subtle Detail) -->
        ${
          isNavy
            ? `<path d="M16 90 L52 138" stroke="#1488DB" stroke-width="2.5" opacity="0.85" />
               <path d="M292 90 L256 138" stroke="#1488DB" stroke-width="2.5" opacity="0.85" />`
            : `<path d="M16 90 L52 138" stroke="#030391" stroke-width="2" opacity="0.28" />
               <path d="M292 90 L256 138" stroke="#1488DB" stroke-width="2" opacity="0.35" />`
        }

        <!-- Garment Body -->
        <path d="M110 22 C132 52, 176 52, 198 22 L238 30 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L70 30 Z"
              fill="url(#${uid}_teeBody)" />
        <path d="M110 22 C132 52, 176 52, 198 22 L238 30 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L70 30 Z"
              fill="url(#${uid}_chestSheen)" />

        <!-- Inner Neck Cavity & Woven Collar Label -->
        <path d="M110 22 C134 10, 174 10, 198 22 C176 48, 132 48, 110 22 Z" fill="${isNavy ? '#010145' : '#D5DCE4'}" />
        <rect x="142" y="21" width="24" height="13" rx="2" fill="#FFFFFF" />
        <rect x="142" y="21" width="24" height="3.5" fill="#1488DB" />
        <text x="154" y="31" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="4.8" font-weight="700" fill="#030391">HCMUT</text>

        <!-- Ribbed Crew Neck Collar -->
        <path d="M106 24 C130 58, 178 58, 202 24 L196 20 C174 50, 134 50, 112 20 Z"
              fill="${bodyShade}" stroke="${seamStroke}" stroke-width="0.9" />

        <!-- Natural Cotton Fold & Twin-Needle Stitch Details -->
        <path d="M96 118 Q100 202 92 284" fill="none" stroke="${foldStroke}" stroke-width="6" stroke-linecap="round" />
        <path d="M214 124 Q209 208 216 284" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
        <path d="M74 284 C122 290, 186 290, 234 284" fill="none" stroke="${seamStroke}" stroke-width="1.2" stroke-dasharray="3 2" />

        <!-- Minimalist Chest Brand Identity Placement -->
        ${
          isNavy
            ? `
          <!-- Centered Minimalist Navy Lockup with Official White-Border Emblem -->
          <g transform="translate(154, 108)">
            ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: 0, r: 22, darkBg: true }) : ''}
            <line x1="-22" y1="32" x2="22" y2="32" stroke="#1488DB" stroke-width="2" />
            <text x="0" y="47" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="2.4">HCMUT</text>
          </g>
        `
            : `
          <!-- Minimalist Left-Chest Placement -->
          <g transform="translate(194, 96)">
            ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: 0, r: 16, darkBg: false }) : ''}
            <text x="0" y="27" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="8.2" font-weight="700" fill="#030391" letter-spacing="1.4">HCMUT</text>
          </g>
        `
        }

        <!-- Minimalist Hem Woven Tab (Bottom Left) -->
        <g transform="translate(86, 266)">
          <rect x="0" y="0" width="26" height="11" rx="2" fill="${isNavy ? '#1488DB' : '#030391'}" />
          <rect x="0" y="0" width="7" height="11" rx="1" fill="${isNavy ? '#FFFFFF' : '#1488DB'}" />
          <text x="16" y="7.8" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="5" font-weight="700" fill="#FFFFFF">BK</text>
        </g>

        <!-- Minimalist Coordinate Micro-Text (Bottom Right) -->
        <text x="220" y="275" text-anchor="end" font-family="'Space Mono', monospace" font-size="5.8" fill="${isNavy ? '#93C5FD' : '#64748B'}" letter-spacing="0.4">10°46'20"N 106°39'35"E</text>
      </g>
    `;
  }

  function renderRealisticDeskMat(item, pal, viewIndex, uid) {
    const isDark = item.designVariant === 'pad-dark' || pal[0] === '#030391' || pal[3] === '#050C2E';
    const isHcmut = !item.campusId || item.campusId === 'hcmut';

    const padBg1 = isDark ? '#030391' : '#FFFFFF';
    const padBg2 = isDark ? '#050942' : '#EDF2F7';
    const stitchColor = isDark ? '#1488DB' : '#CBD5E1';
    const lineAccent = '#1488DB';
    const textMain = isDark ? '#FFFFFF' : '#030391';
    const textSub = isDark ? '#93C5FD' : '#64748B';

    const padDefs = `
      <defs>
        <linearGradient id="${uid}_padSurface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${padBg1}" />
          <stop offset="100%" stop-color="${padBg2}" />
        </linearGradient>
        <linearGradient id="${uid}_deskSurface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0" />
          <stop offset="100%" stop-color="#CBD5E1" />
        </linearGradient>
        <pattern id="${uid}_microWeave" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.6" fill="${isDark ? '#FFFFFF' : '#030391'}" fill-opacity="0.045" />
          <circle cx="4.5" cy="4.5" r="0.6" fill="${isDark ? '#FFFFFF' : '#030391'}" fill-opacity="0.045" />
        </pattern>
      </defs>
    `;

    function renderMatArtwork(x, y, w, h) {
      return `
        <g transform="translate(${x}, ${y})">
          <!-- 4mm Rubber Base Lip -->
          <rect x="0" y="3" width="${w}" height="${h}" rx="14" fill="#0F172A" opacity="0.45" />
          <!-- Main Microfiber Pad -->
          <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="url(#${uid}_padSurface)" />
          <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="url(#${uid}_microWeave)" />
          <!-- Anti-Fray Overlock Stitched Perimeter -->
          <rect x="3.5" y="3.5" width="${w - 7}" height="${h - 7}" rx="11" fill="none" stroke="${stitchColor}" stroke-width="1.4" stroke-dasharray="3.5 2.5" opacity="0.72" />

          ${
            isDark
              ? `
            <!-- Minimalist Isometric Honeycomb Wireframe on Right Wing -->
            <g transform="translate(${w - 135}, ${h / 2})" stroke="#1488DB" fill="none" opacity="0.28">
              <polygon points="0,-42 36.4,-21 36.4,21 0,42 -36.4,21 -36.4,-21" stroke-width="1.4" />
              <polygon points="48,-24 74,-9 74,21 48,36 22,21 22,-9" stroke-width="1.1" />
              <polygon points="-48,-14 -22,1 -22,31 -48,46 -74,31 -74,1" stroke-width="1" />
              <line x1="-110" y1="0" x2="100" y2="0" stroke-width="0.8" stroke-dasharray="4 4" />
            </g>
            <!-- White-Outlined Official HCMUT Crest (Top Right) -->
            <g transform="translate(${w - 42}, 40)">
              ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: 0, r: 19, darkBg: true }) : ''}
            </g>
            <!-- Minimalist Bottom-Left Typographic Lockup -->
            <rect x="22" y="${h - 38}" width="26" height="3" rx="1.5" fill="#1488DB" />
            <text x="22" y="${h - 21}" font-family="Arial, Helvetica, sans-serif" font-size="11.5" font-weight="700" fill="${textMain}" letter-spacing="2.2">HCMUT</text>
            <text x="74" y="${h - 21}" font-family="'Space Mono', monospace" font-size="7.5" fill="${textSub}" letter-spacing="1">· ENGINEERING &amp; INNOVATION</text>
          `
              : `
            <!-- Minimalist Dual-Blue Identity Ribbon on Left Margin -->
            <rect x="20" y="18" width="5" height="${h - 36}" rx="2.5" fill="#030391" />
            <rect x="28" y="18" width="2.5" height="${h - 36}" rx="1.2" fill="#1488DB" />
            <!-- Standard White-Bg Official HCMUT Crest (Top Left) -->
            <g transform="translate(64, 46)">
              ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: 0, r: 20, darkBg: false }) : ''}
            </g>
            <text x="94" y="43" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" fill="#030391" letter-spacing="1.4">HCMUT</text>
            <text x="94" y="56" font-family="Arial, Helvetica, sans-serif" font-size="7" font-weight="700" fill="#1488DB" letter-spacing="0.8">ĐẠI HỌC BÁCH KHOA TP.HCM</text>

            <!-- Subtle Calibration Ruler along Bottom Edge -->
            <g transform="translate(42, ${h - 22})" stroke="#94A3B8" stroke-width="1">
              <line x1="0" y1="6" x2="290" y2="6" stroke-opacity="0.45" />
              ${Array.from({ length: 15 }, (_, idx) => `<line x1="${idx * 20}" y1="${idx % 5 === 0 ? 0 : 3}" x2="${idx * 20}" y2="6" />`).join('')}
            </g>
            <!-- Faint Geometric Honeycomb Watermark (Bottom Right) -->
            <g transform="translate(${w - 58}, ${h - 50})" stroke="#1488DB" fill="none" opacity="0.22">
              <polygon points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12" stroke-width="1.5" />
              <polygon points="0,-13 11.2,-6.5 11.2,6.5 0,13 -11.2,6.5 -11.2,-6.5" stroke-width="1" />
            </g>
          `
          }
        </g>
      `;
    }

    if (viewIndex === 2) {
      // View 2: Dimension & HCMUT Spec Sheet
      return `
        ${padDefs}
        <g transform="translate(34, 24)">
          <rect x="0" y="0" width="412" height="302" rx="14" fill="#FFFFFF" filter="url(#${uid}_softShadow)" />
          <rect x="0" y="0" width="412" height="44" rx="14" fill="#030391" />
          <rect x="0" y="28" width="412" height="16" fill="#030391" />
          <text x="20" y="27" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="0.8">QUY CHUẨN LÓT CHUỘT DESKPAD · HCMUT</text>

          ${renderMatArtwork(46, 68, 320, 142)}

          <!-- Dimension Guide Lines -->
          <line x1="46" y1="224" x2="366" y2="224" stroke="#1488DB" stroke-width="1.5" />
          <line x1="46" y1="219" x2="46" y2="229" stroke="#1488DB" stroke-width="1.5" />
          <line x1="366" y1="219" x2="366" y2="229" stroke="#1488DB" stroke-width="1.5" />
          <text x="206" y="239" text-anchor="middle" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#030391">
            ${isDark ? '900mm × 400mm × 4mm (XL FULL DESK)' : '800mm × 350mm × 4mm (COMPACT DESK)'}
          </text>

          <line x1="20" y1="258" x2="392" y2="258" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="20" y="278" font-family="'Space Mono', monospace" font-size="9" fill="#334155">BỀ MẶT JACQUARD CHỐNG THẤM · BO VIỀN CHỈ CHÌM · ĐẾ CAO SU TỰ NHIÊN</text>
        </g>
      `;
    }

    if (viewIndex === 1) {
      // View 1: Real-World Workspace Scale Setup (Keyboard + Mouse + Macro Edge Zoom)
      return `
        ${padDefs}
        <rect x="18" y="24" width="444" height="304" rx="16" fill="url(#${uid}_deskSurface)" />
        <g filter="url(#${uid}_shadow)">
          ${renderMatArtwork(36, 70, 408, 200)}
        </g>

        <!-- Compact 65% Mechanical Keyboard Silhouette (Realistic Proportion) -->
        <g transform="translate(66, 108)" filter="url(#${uid}_softShadow)">
          <rect x="0" y="0" width="214" height="82" rx="7" fill="${isDark ? '#1E293B' : '#334155'}" />
          <rect x="7" y="7" width="200" height="68" rx="4" fill="#0F172A" />
          ${[0, 1, 2, 3].map((row) => `<rect x="12" y="${12 + row * 15}" width="190" height="11" rx="2" fill="#E2E8F0" opacity="0.88" />`).join('')}
          <!-- Spacebar & Blue Escape Accent Key -->
          <rect x="12" y="12" width="14" height="11" rx="2" fill="#1488DB" />
          <rect x="56" y="57" width="84" height="11" rx="2" fill="#FFFFFF" />
        </g>

        <!-- Realistic Wireless Mouse Silhouette -->
        <g transform="translate(314, 128)" filter="url(#${uid}_softShadow)">
          <rect x="0" y="0" width="44" height="72" rx="21" fill="${isDark ? '#F8FAFC' : '#1E293B'}" />
          <line x1="22" y1="6" x2="22" y2="26" stroke="#94A3B8" stroke-width="1.2" />
          <rect x="19.5" y="12" width="5" height="11" rx="2.5" fill="#1488DB" />
        </g>

        <!-- Macro Stitched Edge Zoom -->
        <g transform="translate(392, 266)" filter="url(#${uid}_softShadow)">
          <circle cx="0" cy="0" r="42" fill="#FFFFFF" stroke="#030391" stroke-width="3" />
          <rect x="-26" y="-8" width="52" height="14" rx="4" fill="${isDark ? '#030391' : '#E2E8F0'}" />
          <rect x="-26" y="4" width="52" height="8" rx="2" fill="#1E293B" />
          <line x1="-24" y1="-4" x2="24" y2="-4" stroke="#1488DB" stroke-width="2" stroke-dasharray="3 2" />
          <text x="0" y="27" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7" font-weight="700" fill="#0F172A">DÀY 4MM</text>
        </g>
      `;
    }

    // View 0: Top-Down Realistic Studio Desk Mat Shot
    return `
      ${padDefs}
      <rect x="20" y="28" width="440" height="296" rx="16" fill="url(#${uid}_deskSurface)" opacity="0.55" />
      <g filter="url(#${uid}_shadow)">
        ${renderMatArtwork(44, 78, 392, 198)}
      </g>
      <!-- Subtle Studio Label in Corner -->
      <text x="44" y="298" font-family="'Space Mono', monospace" font-size="8.5" fill="#475569">
        ${isDark ? 'DESKPAD 900×400×4MM · WATER-REPELLENT MICROFIBER' : 'DESKPAD 800×350×4MM · MATTE PLATINUM FINISH'}
      </text>
    `;
  }

  function renderRealisticFallback(item, pal, viewIndex, uid) {
    // Clean realistic studio card for any additional user-submitted categories
    const code = (item && item.campusShort) || 'UNI';
    const [c1, c2, c3, c4] = pal;
    const isHcmut = !item.campusId || item.campusId === 'hcmut';
    return `
      <g transform="translate(70, 34)" filter="url(#${uid}_shadow)">
        <rect x="0" y="0" width="340" height="270" rx="16" fill="${c4 || '#FFFFFF'}" />
        <rect x="0" y="0" width="340" height="64" rx="16" fill="${c1}" />
        <rect x="0" y="44" width="340" height="20" fill="${c1}" />
        <g transform="translate(46, 32)">
          ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: 0, r: 20, darkBg: true }) : `<circle cx="0" cy="0" r="18" fill="${c2}" />`}
        </g>
        <text x="80" y="37" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${escapeXml(code)} · CONCEPT PREVIEW</text>
        <text x="24" y="112" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#0F172A">${escapeXml((item && item.title ? item.title : 'Concept').slice(0, 34))}</text>
        <text x="24" y="138" font-family="'Space Mono', monospace" font-size="10.5" fill="#475569">Góc nhìn ${viewIndex + 1} · Studio Realistic Mockup</text>
        <rect x="24" y="168" width="292" height="72" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <circle cx="56" cy="204" r="14" fill="${c1}" />
        <circle cx="94" cy="204" r="14" fill="${c2}" />
        <circle cx="132" cy="204" r="14" fill="${c3}" />
        <text x="164" y="208" font-family="'Space Mono', monospace" font-size="10" fill="#334155">PALETTE SPEC</text>
      </g>
    `;
  }

  function renderMerchIllustration(item, viewIndex = 0) {
    if (item && item.customImageUrl && viewIndex === 0) {
      return `
        <div class="w-full h-full relative bg-[#F4F6F9] flex items-center justify-center overflow-hidden">
          <img src="${escapeXml(item.customImageUrl)}" alt="${escapeXml(item.title)}" class="w-full h-full object-cover" loading="lazy" />
        </div>
      `;
    }

    const pal = safePalette(item && item.palette);
    const category = (item && item.category) || 'tee';
    const uid = makeUid(item, viewIndex);
    const isDarkSubject =
      (item && (item.designVariant === 'tee-navy' || item.designVariant === 'pad-dark')) || false;

    let inner = '';
    if (category === 'tee' || category === 'polo') {
      inner = renderRealisticTee(item || {}, pal, viewIndex, uid);
    } else if (category === 'mousepad') {
      inner = renderRealisticDeskMat(item || {}, pal, viewIndex, uid);
    } else {
      inner = renderRealisticFallback(item || {}, pal, viewIndex, uid);
    }

    return `
      <svg viewBox="0 0 480 360" class="w-full h-full block" role="img" aria-label="${escapeXml(item ? item.title : 'Mockup sản phẩm thực tế')}">
        ${renderStudioBackdrop(uid, isDarkSubject)}
        ${inner}
      </svg>
    `;
  }

  function renderCampusEmblem(campus) {
    if (campus && campus.logo) {
      const shortName = campus.shortName || 'UNI';
      return `
        <div class="w-11 h-11 rounded-xl bg-white border-2 border-[#1E1E24] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-[2px_2px_0px_#1E1E24]">
          <img src="${escapeXml(campus.logo)}" alt="Logo ${escapeXml(shortName)}" class="w-full h-full object-contain" loading="lazy" />
        </div>
      `;
    }
    if (campus && campus.id === 'hcmut') {
      return `
        <svg viewBox="0 0 112 112" class="w-11 h-11 shrink-0" aria-hidden="true">
          ${renderHcmutBrandMark({ cx: 56, cy: 56, r: 50, darkBg: false })}
        </svg>
      `;
    }
    const c1 = (campus && campus.color) || '#030391';
    const c2 = (campus && campus.secondaryColor) || '#1488DB';
    const shortName = (campus && campus.shortName) || 'UNI';
    return `
      <svg viewBox="0 0 56 56" class="w-11 h-11 shrink-0" aria-hidden="true">
        <path d="M10 10 L46 8 L44 36 Q28 50 12 36 Z" fill="${c2}" stroke="#1E1E24" stroke-width="2.6" stroke-linejoin="round" />
        <path d="M15 15 L41 13 L39 34 Q28 44 17 34 Z" fill="${c1}" stroke="#1E1E24" stroke-width="1.8" stroke-linejoin="round" />
        <text x="28" y="31" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10.5" font-weight="700" fill="#FFFFFF">${escapeXml(shortName.slice(0, 5))}</text>
      </svg>
    `;
  }

  // Realistic Studio Mockup Prompt Recipes (matching realistic artwork output)
  const HAND_DRAWN_RECIPES = [
    {
      id: 'studio-tee-flatlay',
      name: 'Studio Apparel Flat-Lay (Áo thun thực tế)',
      badge: 'Style #01 · Studio Product Photo',
      desc: 'Ảnh chụp studio phẳng trên phông nền sáng dịu, thấy rõ chất liệu cotton 250gsm, đường may và logo tối giản.',
      template:
        'Photorealistic overhead studio flat-lay photography of a minimalist heavyweight 250gsm cotton {subject} for {campus} university, crisp fabric weave texture, subtle embroidery details in {colors}, soft diffused studio softbox lighting, subtle natural drop shadow on neutral light grey cyclorama surface, clean commercial lookbook aesthetic.',
    },
    {
      id: 'desk-mat-workspace',
      name: 'Minimalist Desk Setup (Lót chuột thực tế)',
      badge: 'Style #02 · Workspace Mockup',
      desc: 'Ảnh chụp góc trên xuống bàn làm việc tối giản với bàn phím cơ, chuột không dây và đường chỉ may bo viền thực tế.',
      template:
        'Photorealistic top-down desk setup photography featuring a minimalist stitched-edge {subject} representing {campus}, matte microfiber surface in {colors}, crisp overlock stitched border, paired with a compact silver mechanical keyboard and wireless mouse on matte light concrete desk, natural daylight shadows, ultra-clean product photography.',
    },
    {
      id: 'macro-embroidery',
      name: 'Macro Detail & Woven Tag (Cận cảnh chi tiết)',
      badge: 'Style #03 · Macro Material Shot',
      desc: 'Cận cảnh chất liệu vải, tem dệt gấu áo hoặc bề mặt chống thấm của lót chuột với độ nét cao.',
      template:
        'Extreme macro commercial product photography zooming in on the woven label and stitching detail of a {subject} for {campus}, color palette {colors}, shallow depth of field, visible cotton knit and high-density thread texture, crisp studio rim light.',
    },
    {
      id: 'lifestyle-campus',
      name: 'Natural Daylight Campus Lookbook',
      badge: 'Style #04 · Real Campus Vibe',
      desc: 'Chụp thực tế trong ánh nắng sân trường tự nhiên, giữ tinh thần tối giản và dễ mặc hằng ngày.',
      template:
        'Editorial lifestyle product photography of a minimalist {subject} with {campus} identity colors {colors}, soft natural morning sunlight, clean architectural university courtyard background softly blurred, realistic fabric folds, high-craft campus apparel.',
    },
  ];

  global.UniVibeIllustrations = {
    renderMerchIllustration,
    renderCampusEmblem,
    renderHcmutBrandMark,
    HAND_DRAWN_RECIPES,
  };
})(typeof window !== 'undefined' ? window : globalThis);
