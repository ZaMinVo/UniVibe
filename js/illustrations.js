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

  /**
   * Official HCMUT Wordmark (Geometric Ligature Lockup: HCM #030391 + UT #1488DB on white,
   * or full #FFFFFF on deep navy #030391). Coordinate box: width 250, height 46.
   */
  function renderHcmutWordmark({ x = 0, y = 0, scale = 1, variant = 'two-tone', align = 'left' }) {
    const isWhite = variant === 'white';
    const cHcm = isWhite ? '#FFFFFF' : '#030391';
    const cUt = isWhite ? '#FFFFFF' : '#1488DB';
    const ox = align === 'center' ? -125 : align === 'right' ? -250 : 0;

    return `
      <g transform="translate(${x}, ${y}) scale(${scale}) translate(${ox}, 0)">
        <!-- H -->
        <path d="M0 0 L11.5 0 L11.5 17.5 L34.5 17.5 L34.5 0 L46 0 L46 46 L34.5 46 L34.5 28.5 L11.5 28.5 L11.5 46 L0 46 Z" fill="${cHcm}" />
        <!-- C -->
        <path d="M98 0 L66 0 C56.5 0 53 4.2 53 13 L53 33 C53 41.8 56.5 46 66 46 L98 46 L98 35 L68.5 35 C65 35 64 33.8 64 30.5 L64 15.5 C64 12.2 65 11 68.5 11 L98 11 Z" fill="${cHcm}" />
        <!-- M -->
        <path d="M105 46 L105 0 L119.5 0 L132 25.5 L144.5 0 L159 0 L159 46 L147.5 46 L147.5 17.5 L136 40.5 L128 40.5 L116.5 17.5 L116.5 46 Z" fill="${cHcm}" />
        <!-- U + T Geometric Ligature with Diagonal Bevel Cut -->
        <path d="M166 0 L177.5 0 L177.5 29 C177.5 34.8 180.5 36.2 188.5 36.2 C196.5 36.2 199.5 34.8 199.5 29 L199.5 3.8 L211.2 11.2 L213 8.8 L200.5 0 L250 0 L250 10.5 L216.5 10.5 L216.5 46 L188.5 46 C172.5 46 166 40 166 28.5 Z" fill="${cUt}" />
      </g>
    `;
  }

  /**
   * Full HCMUT Identity Lockup (Wordmark + TRƯỜNG ĐẠI HỌC BÁCH KHOA + English subtitle)
   */
  function renderHcmutWordmarkLockup({ x = 0, y = 0, scale = 1, variant = 'two-tone', align = 'left' }) {
    const isWhite = variant === 'white';
    const cMain = isWhite ? '#FFFFFF' : '#030391';
    const cSub = isWhite ? '#BFDBFE' : '#1488DB';
    const ox = align === 'center' ? -125 : align === 'right' ? -250 : 0;

    return `
      <g transform="translate(${x}, ${y}) scale(${scale}) translate(${ox}, 0)">
        ${renderHcmutWordmark({ x: 0, y: 0, scale: 1, variant, align: 'left' })}
        <text x="0" y="61" font-family="Arial, Helvetica, sans-serif" font-size="13.2" font-weight="800" fill="${cMain}" letter-spacing="0.2">TRƯỜNG ĐẠI HỌC BÁCH KHOA</text>
        <text x="0" y="74" font-family="Arial, Helvetica, sans-serif" font-size="8.6" font-weight="700" fill="${cSub}" letter-spacing="0.15">HO CHI MINH CITY UNIVERSITY OF TECHNOLOGY</text>
      </g>
    `;
  }

  /**
   * Signature HCMUT Stepped Vertical Line Motif (seen on Tote & Stationery system)
   */
  function renderSteppedVerticalLines({ x = 0, y = 0, count = 11, stepX = 8, baseLen = 14, growth = 7, dir = 'up', color = '#030391', strokeWidth = 1.4, opacity = 0.72 }) {
    const lines = [];
    for (let i = 0; i < count; i += 1) {
      const lx = i * stepX;
      const len = baseLen + i * growth;
      const y1 = 0;
      const y2 = dir === 'up' ? -len : len;
      lines.push(`<line x1="${lx}" y1="${y1}" x2="${lx}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}" stroke-opacity="${opacity}" />`);
    }
    return `<g transform="translate(${x}, ${y})">${lines.join('')}</g>`;
  }

  /**
   * Minimal Geometric Triangle Mosaic (derived from HCMUT Brand Stationery)
   */
  function renderTriangleMosaic({ x = 0, y = 0, cols = 3, rows = 4, size = 18, darkBg = false }) {
    const h = size * 0.866;
    const tones = darkBg
      ? ['#1488DB', '#1E40AF', '#60A5FA', '#0F172A']
      : ['#DBEAFE', '#93C5FD', '#1488DB', '#030391'];
    const polys = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const px = c * size;
        const py = r * h;
        const t1 = tones[(r * 2 + c) % tones.length];
        const t2 = tones[(r + c * 3 + 1) % tones.length];
        polys.push(
          `<polygon points="${px},${py} ${px + size},${py + h * 0.5} ${px},${py + h}" fill="${t1}" fill-opacity="${darkBg ? '0.26' : '0.45'}" />`,
          `<polygon points="${px + size},${py - h * 0.5} ${px + size},${py + h * 0.5} ${px},${py}" fill="${t2}" fill-opacity="${darkBg ? '0.18' : '0.32'}" />`
        );
      }
    }
    return `<g transform="translate(${x}, ${y})">${polys.join('')}</g>`;
  }

  function renderStudioBackdrop(uid, isDarkSubject, useNavyStage = false) {
    const bgTop = useNavyStage ? '#02053D' : isDarkSubject ? '#E5EBF3' : '#EEF2F6';
    const bgBottom = useNavyStage ? '#040B66' : isDarkSubject ? '#CBD5E1' : '#D5DCE5';
    return `
      <defs>
        <linearGradient id="${uid}_bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${bgTop}" />
          <stop offset="72%" stop-color="${bgBottom}" />
          <stop offset="100%" stop-color="${useNavyStage ? '#050F7A' : '#C2CCD9'}" />
        </linearGradient>
        <radialGradient id="${uid}_spot" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stop-color="${useNavyStage ? '#1488DB' : '#FFFFFF'}" stop-opacity="${useNavyStage ? '0.22' : '0.88'}" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <filter id="${uid}_shadow" x="-18%" y="-18%" width="136%" height="145%">
          <feDropShadow dx="0" dy="14" stdDeviation="11" flood-color="#050824" flood-opacity="${useNavyStage ? '0.52' : '0.22'}" />
        </filter>
        <filter id="${uid}_softShadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#050824" flood-opacity="${useNavyStage ? '0.42' : '0.16'}" />
        </filter>
      </defs>
      <rect x="0" y="0" width="480" height="360" fill="url(#${uid}_bg)" />
      ${
        useNavyStage
          ? `<polygon points="0,360 480,145 480,360" fill="#06148C" opacity="0.68" />
             <rect x="0" y="0" width="480" height="360" fill="url(#${uid}_spot)" />`
          : `<rect x="0" y="0" width="480" height="360" fill="url(#${uid}_spot)" />
             <!-- Soft Sunlit Architectural Cast Shadow & Horizon -->
             <polygon points="0,0 130,0 24,360 0,360" fill="#94A3B8" fill-opacity="0.14" />
             <line x1="0" y1="298" x2="480" y2="298" stroke="#94A3B8" stroke-opacity="0.22" stroke-width="1" />`
      }
    `;
  }

  function renderRealisticTee(item, pal, viewIndex, uid) {
    const isNavy = item.designVariant === 'tee-navy' || pal[0] === '#030391';
    const isHcmut = !item.campusId || item.campusId === 'hcmut';
    const bodyBase = isNavy ? '#030391' : '#FFFFFF';
    const bodyShade = isNavy ? '#02026B' : '#E9EEF4';
    const bodyMid = isNavy ? '#0710A6' : '#F8FAFC';
    const foldStroke = isNavy ? 'rgba(255,255,255,0.09)' : 'rgba(15,23,42,0.08)';
    const seamStroke = isNavy ? 'rgba(20,136,219,0.42)' : 'rgba(15,23,42,0.14)';
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
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="${isNavy ? '0.14' : '0.68'}" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <clipPath id="${uid}_refClip">
          <rect x="0" y="0" width="90" height="58" rx="6" />
        </clipPath>
      </defs>
    `;

    if (viewIndex === 2) {
      // View 2: Minimalist Spec & Official Brand Wordmark Compliance Sheet
      return `
        ${fabricDefs}
        <g transform="translate(34, 24)">
          <rect x="0" y="0" width="412" height="302" rx="14" fill="#FFFFFF" filter="url(#${uid}_softShadow)" />
          <rect x="0" y="0" width="412" height="44" rx="14" fill="#030391" />
          <rect x="0" y="28" width="412" height="16" fill="#030391" />
          <text x="20" y="27" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="0.8">THÔNG SỐ KỸ THUẬT &amp; CHUẨN WORDMARK HCMUT</text>

          <!-- Dual Wordmark Usage Boxes (White bg two-tone & Deep Navy bg white) -->
          <g transform="translate(20, 60)">
            <rect x="0" y="0" width="180" height="58" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2" />
            ${renderHcmutWordmark({ x: 90, y: 15, scale: 0.48, variant: 'two-tone', align: 'center' })}
            <rect x="192" y="0" width="180" height="58" rx="8" fill="#030391" />
            ${renderHcmutWordmark({ x: 282, y: 15, scale: 0.48, variant: 'white', align: 'center' })}
          </g>

          <!-- Mini Front & Back Wireframe Silhouettes -->
          <g transform="translate(20, 128)">
            <path d="M28 6 L46 6 C50 11, 58 11, 62 6 L80 6 L98 25 L87 44 L78 37 L78 106 L30 106 L30 37 L21 44 L10 25 Z" fill="${bodyBase}" stroke="#94A3B8" stroke-width="1.4" />
            ${renderHcmutWordmark({ x: 64, y: 34, scale: 0.085, variant: isNavy ? 'white' : 'two-tone', align: 'center' })}
            <text x="54" y="121" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8.5" fill="#475569">MẶT TRƯỚC</text>
          </g>

          <g transform="translate(132, 128)">
            <path d="M28 6 L46 6 C50 9, 58 9, 62 6 L80 6 L98 25 L87 44 L78 37 L78 106 L30 106 L30 37 L21 44 L10 25 Z" fill="${bodyBase}" stroke="#94A3B8" stroke-width="1.4" />
            ${renderHcmutWordmark({ x: 54, y: 32, scale: 0.14, variant: isNavy ? 'white' : 'two-tone', align: 'center' })}
            <text x="54" y="51" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="4.6" font-weight="700" fill="${isNavy ? '#FFFFFF' : '#030391'}">TRƯỜNG ĐẠI HỌC BÁCH KHOA</text>
            <text x="54" y="121" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8.5" fill="#475569">MẶT SAU</text>
          </g>

          <!-- Brand Color Swatches + Official Reference Preview -->
          <g transform="translate(248, 134)">
            <rect x="0" y="0" width="44" height="26" rx="5" fill="#030391" />
            <text x="22" y="38" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7.8" font-weight="700" fill="#0F172A">#030391</text>
            <rect x="52" y="0" width="44" height="26" rx="5" fill="#1488DB" />
            <text x="74" y="38" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7.8" font-weight="700" fill="#0F172A">#1488DB</text>
            <rect x="104" y="0" width="44" height="26" rx="5" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="126" y="38" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7.8" font-weight="700" fill="#0F172A">#FFFFFF</text>

            <g transform="translate(0, 50)">
              <rect x="0" y="0" width="90" height="58" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
              <image href="assets/products/hcmut-wordmark.jpg" x="0" y="0" width="90" height="58" preserveAspectRatio="xMidYMid slice" clip-path="url(#${uid}_refClip)" />
              <text x="98" y="24" font-family="'Space Mono', monospace" font-size="8" font-weight="700" fill="#030391">NGUỒN: HCMUT</text>
              <text x="98" y="38" font-family="Arial, Helvetica, sans-serif" font-size="8" fill="#475569">Wordmark &amp; Line</text>
              <text x="98" y="50" font-family="Arial, Helvetica, sans-serif" font-size="8" fill="#475569">Pattern Identity</text>
            </g>
          </g>

          <line x1="20" y1="262" x2="392" y2="262" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="20" y="282" font-family="'Space Mono', monospace" font-size="9" fill="#334155">COTTON COMBED 250GSM · THÊU/IN PET CHUYỂN NHIỆT · BO CỔ KẺ XANH #030391</text>
        </g>
      `;
    }

    if (viewIndex === 1) {
      // View 1: Realistic Back View + Macro Hem Detail (Official Wordmark Style)
      return `
        ${fabricDefs}
        <g transform="translate(64, 20)" filter="url(#${uid}_shadow)">
          <!-- Back Tee Silhouette -->
          <path d="M112 22 C136 28, 172 28, 196 22 L238 30 L292 86 L256 138 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L52 138 L16 86 L70 30 Z"
                fill="url(#${uid}_teeBody)" />
          <!-- Sleeves Shading & Brand Cuff Accent -->
          <path d="M70 30 L16 86 L52 138 L74 114 Z" fill="url(#${uid}_sleeveL)" opacity="0.65" />
          <path d="M238 30 L292 86 L256 138 L234 114 Z" fill="url(#${uid}_sleeveR)" opacity="0.65" />
          <path d="M18 89 L52 134" stroke="${isNavy ? '#1488DB' : '#030391'}" stroke-width="3.2" stroke-linecap="round" />
          <path d="M290 89 L256 134" stroke="${isNavy ? '#1488DB' : '#030391'}" stroke-width="3.2" stroke-linecap="round" />

          <!-- Back Ribbed Neckline -->
          <path d="M112 22 C136 33, 172 33, 196 22 L192 31 C170 40, 138 40, 116 31 Z" fill="${bodyShade}" stroke="${seamStroke}" stroke-width="1" />
          <!-- Subtle Fabric Drape Folds -->
          <path d="M98 124 Q102 210 96 288" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
          <path d="M210 128 Q206 212 212 288" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
          <path d="M74 284 C122 290, 186 290, 234 284" fill="none" stroke="${seamStroke}" stroke-width="1.2" stroke-dasharray="3 2" />

          <!-- Minimalist Back Graphic (Upper Center Wordmark Lockup) -->
          <g transform="translate(154, 96)">
            ${isHcmut ? renderHcmutWordmarkLockup({ x: 0, y: 0, scale: 0.36, variant: isNavy ? 'white' : 'two-tone', align: 'center' }) : ''}
          </g>

          <!-- Subtle Stepped Vertical Lines Corner Accent on Bottom Right of Back Hem -->
          ${renderSteppedVerticalLines({
            x: 168,
            y: 284,
            count: 7,
            stepX: 7.5,
            baseLen: 12,
            growth: 6.5,
            dir: 'up',
            color: isNavy ? '#1488DB' : '#030391',
            strokeWidth: 1.3,
            opacity: isNavy ? 0.55 : 0.42,
          })}
        </g>

        <!-- Macro Detail Lens (Right Corner) -->
        <g transform="translate(384, 240)" filter="url(#${uid}_softShadow)">
          <circle cx="0" cy="0" r="54" fill="${bodyBase}" stroke="#FFFFFF" stroke-width="4" />
          <circle cx="0" cy="0" r="50" fill="none" stroke="${accentBlue}" stroke-width="1.5" opacity="0.55" />
          <!-- Simulated Woven Hem Tag with Official Wordmark -->
          <rect x="-32" y="-13" width="64" height="26" rx="4" fill="${isNavy ? '#061059' : '#F8FAFC'}" stroke="${isNavy ? '#1488DB' : '#CBD5E1'}" stroke-width="1" />
          <rect x="-32" y="-13" width="10" height="26" rx="2" fill="#030391" />
          <rect x="-22" y="-13" width="5" height="26" fill="#1488DB" />
          ${renderHcmutWordmark({ x: 8, y: -5, scale: 0.17, variant: isNavy ? 'white' : 'two-tone', align: 'center' })}
          <text x="0" y="34" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6.8" fill="${isNavy ? '#CBD5E1' : '#475569'}">TAG DỆT WORDMARK</text>
        </g>
      `;
    }

    // View 0: Front Realistic Studio Mockup (HCMUT Brand Kit Polo/Tee Aesthetic)
    return `
      ${fabricDefs}
      <g transform="translate(86, 16)" filter="url(#${uid}_shadow)">
        <!-- Left & Right Sleeves -->
        <path d="M70 30 L14 92 L52 142 L76 114 Z" fill="url(#${uid}_sleeveL)" />
        <path d="M238 30 L294 92 L256 142 L232 114 Z" fill="url(#${uid}_sleeveR)" />
        <!-- Clean Royal-Blue Sleeve Cuff Trim (Inspired by HCMUT Merch Kit) -->
        <path d="M16 90 L52 138" stroke="${isNavy ? '#1488DB' : '#030391'}" stroke-width="3.6" stroke-linecap="round" />
        <path d="M292 90 L256 138" stroke="${isNavy ? '#1488DB' : '#030391'}" stroke-width="3.6" stroke-linecap="round" />

        <!-- Garment Body -->
        <path d="M110 22 C132 52, 176 52, 198 22 L238 30 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L70 30 Z"
              fill="url(#${uid}_teeBody)" />
        <path d="M110 22 C132 52, 176 52, 198 22 L238 30 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L70 30 Z"
              fill="url(#${uid}_chestSheen)" />

        <!-- Inner Neck Cavity & Woven Collar Label -->
        <path d="M110 22 C134 10, 174 10, 198 22 C176 48, 132 48, 110 22 Z" fill="${isNavy ? '#010145' : '#D5DCE4'}" />
        <rect x="139" y="21" width="30" height="13" rx="2" fill="#FFFFFF" />
        ${renderHcmutWordmark({ x: 154, y: 24.5, scale: 0.09, variant: 'two-tone', align: 'center' })}

        <!-- Ribbed Collar with Subtle HCMUT Blue Trim -->
        <path d="M106 24 C130 58, 178 58, 202 24 L196 20 C174 50, 134 50, 112 20 Z"
              fill="${isNavy ? '#02026B' : '#F1F5F9'}" stroke="${isNavy ? '#1488DB' : '#030391'}" stroke-width="1.6" />

        <!-- Natural Cotton Fold & Twin-Needle Stitch Details -->
        <path d="M96 118 Q100 202 92 284" fill="none" stroke="${foldStroke}" stroke-width="6" stroke-linecap="round" />
        <path d="M214 124 Q209 208 216 284" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
        <path d="M74 284 C122 290, 186 290, 234 284" fill="none" stroke="${seamStroke}" stroke-width="1.2" stroke-dasharray="3 2" />

        <!-- Minimalist Chest Wordmark Placement -->
        ${
          isNavy
            ? `
          <!-- Centered Minimalist Navy Lockup with Official White Geometric Wordmark -->
          <g transform="translate(154, 110)">
            ${isHcmut ? renderHcmutWordmarkLockup({ x: 0, y: 0, scale: 0.42, variant: 'white', align: 'center' }) : ''}
          </g>
          ${renderSteppedVerticalLines({
            x: 174,
            y: 286,
            count: 7,
            stepX: 7,
            baseLen: 10,
            growth: 5.5,
            dir: 'up',
            color: '#1488DB',
            strokeWidth: 1.2,
            opacity: 0.52,
          })}
        `
            : `
          <!-- Minimalist Left-Chest Official Wordmark (Two-Tone #030391 + #1488DB) -->
          <g transform="translate(194, 98)">
            ${isHcmut ? renderHcmutWordmark({ x: 0, y: 0, scale: 0.21, variant: 'two-tone', align: 'center' }) : ''}
          </g>
          ${renderSteppedVerticalLines({
            x: 172,
            y: 286,
            count: 7,
            stepX: 7,
            baseLen: 10,
            growth: 5.5,
            dir: 'up',
            color: '#030391',
            strokeWidth: 1.2,
            opacity: 0.35,
          })}
        `
        }

        <!-- Minimalist Hem Woven Tab (Bottom Left) -->
        <g transform="translate(86, 266)">
          <rect x="0" y="0" width="28" height="11" rx="2" fill="${isNavy ? '#1488DB' : '#030391'}" />
          <rect x="0" y="0" width="7" height="11" rx="1" fill="${isNavy ? '#FFFFFF' : '#1488DB'}" />
          <text x="17.5" y="7.6" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="4.4" font-weight="700" fill="#FFFFFF">HCMUT</text>
        </g>

        <!-- Minimalist Coordinate Micro-Text (Bottom Right) -->
        <text x="220" y="276" text-anchor="end" font-family="'Space Mono', monospace" font-size="5.5" fill="${isNavy ? '#93C5FD' : '#64748B'}" letter-spacing="0.4">10°46'20"N · 106°39'35"E</text>
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
            <!-- Minimalist Geometric Triangle Mosaic on Right Wing (HCMUT Stationery Pattern) -->
            ${renderTriangleMosaic({ x: w - 88, y: 12, cols: 4, rows: Math.max(3, Math.floor((h - 24) / 24)), size: 19, darkBg: true })}
            <!-- Stepped Vertical Accent Lines (Top Right Corner) -->
            ${renderSteppedVerticalLines({
              x: w - 92,
              y: 10,
              count: 8,
              stepX: 9,
              baseLen: 12,
              growth: 6,
              dir: 'down',
              color: '#1488DB',
              strokeWidth: 1.2,
              opacity: 0.45,
            })}
            <!-- Minimalist Bottom-Left Official White Wordmark Lockup -->
            ${isHcmut ? renderHcmutWordmarkLockup({ x: 24, y: h - 56, scale: 0.46, variant: 'white', align: 'left' }) : ''}
          `
              : `
            <!-- Minimalist Geometric Triangle Mosaic on Right Margin -->
            ${renderTriangleMosaic({ x: w - 82, y: 12, cols: 4, rows: Math.max(3, Math.floor((h - 24) / 24)), size: 18, darkBg: false })}
            <!-- Stepped Vertical Lines Corner Accent (Inspired by HCMUT Tote & Stationery) -->
            ${renderSteppedVerticalLines({
              x: w - 96,
              y: h - 10,
              count: 9,
              stepX: 8.5,
              baseLen: 14,
              growth: 7.5,
              dir: 'up',
              color: '#030391',
              strokeWidth: 1.3,
              opacity: 0.55,
            })}
            <!-- Full Two-Tone Official HCMUT Wordmark Lockup (Top Left) -->
            ${isHcmut ? renderHcmutWordmarkLockup({ x: 24, y: 24, scale: 0.52, variant: 'two-tone', align: 'left' }) : ''}

            <!-- Subtle Calibration Ruler along Bottom Edge -->
            <g transform="translate(24, ${h - 22})" stroke="#94A3B8" stroke-width="1">
              <line x1="0" y1="6" x2="210" y2="6" stroke-opacity="0.45" />
              ${Array.from({ length: 11 }, (_, idx) => `<line x1="${idx * 20}" y1="${idx % 5 === 0 ? 0 : 3}" x2="${idx * 20}" y2="6" />`).join('')}
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

  function renderMerchIllustration(item, viewIndex = 0, options = {}) {
    const showSourceBadge = options.compact !== true && item && item.source;
    const sourceBadge = showSourceBadge
      ? `<span class="absolute bottom-2 left-2 z-10 px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1E1E24]/85 text-white rounded-md border border-white/25 pointer-events-none">Nguồn: ${escapeXml(item.source)}</span>`
      : '';

    if (item && Array.isArray(item.galleryImages) && item.galleryImages[viewIndex]) {
      return `
        <div class="w-full h-full relative bg-[#02053D] flex items-center justify-center overflow-hidden">
          <img src="${escapeXml(item.galleryImages[viewIndex])}" alt="${escapeXml(item.title)}" class="w-full h-full object-cover" loading="lazy" />
          ${sourceBadge}
        </div>
      `;
    }

    if (item && item.customImageUrl && viewIndex === 0) {
      return `
        <div class="w-full h-full relative bg-[#F4F6F9] flex items-center justify-center overflow-hidden">
          <img src="${escapeXml(item.customImageUrl)}" alt="${escapeXml(item.title)}" class="w-full h-full object-cover" loading="lazy" />
          ${sourceBadge}
        </div>
      `;
    }

    const pal = safePalette(item && item.palette);
    const category = (item && item.category) || 'tee';
    const uid = makeUid(item, viewIndex);
    const isDarkSubject =
      (item && (item.designVariant === 'tee-navy' || item.designVariant === 'pad-dark')) || false;
    const useNavyStage = Boolean(item && item.useNavyStage && viewIndex === 0);

    let inner = '';
    if (category === 'tee' || category === 'polo') {
      inner = renderRealisticTee(item || {}, pal, viewIndex, uid);
    } else if (category === 'mousepad') {
      inner = renderRealisticDeskMat(item || {}, pal, viewIndex, uid);
    } else {
      inner = renderRealisticFallback(item || {}, pal, viewIndex, uid);
    }

    return `
      <div class="w-full h-full relative">
        <svg viewBox="0 0 480 360" class="w-full h-full block" role="img" aria-label="${escapeXml(item ? item.title : 'Mockup sản phẩm thực tế')}">
          ${renderStudioBackdrop(uid, isDarkSubject, useNavyStage)}
          ${inner}
        </svg>
        ${sourceBadge}
      </div>
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
    renderHcmutWordmark,
    renderHcmutWordmarkLockup,
    HAND_DRAWN_RECIPES,
  };
})(typeof window !== 'undefined' ? window : globalThis);
