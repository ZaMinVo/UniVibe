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
   * Official HCMUT (ĐH Bách Khoa TP.HCM) 3-Cube Hexagonal Emblem (matches hcmut-shop/product/1 sleeve logo)
   * Structure: Three interlocking 3D isometric cubes around a central white hexagon labeled BK / TP.HCM
   * Official Colors: Light Blue #1488DB | Dark Blue #030391 | White #FFFFFF
   */
  function renderHcmutBrandMark({ cx, cy, r, darkBg = false }) {
    const scale = r / 50;
    return `
      <g transform="translate(${cx}, ${cy}) scale(${scale})">
        ${
          darkBg
            ? `<polygon points="0,-49 42.4,-24.5 42.4,24.5 0,49 -42.4,24.5 -42.4,-24.5" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />`
            : ''
        }
        <!-- Outer Hexagon Outline (White Crisp Buffer) -->
        <polygon points="0,-46 39.8,-23 39.8,23 0,46 -39.8,23 -39.8,-23" fill="#FFFFFF" />

        <!-- Top Isometric Cube -->
        <polygon points="0,-44 19,-33 0,-22 -19,-33" fill="#1488DB" />
        <polygon points="-19,-33 0,-22 0,-11 -19,-22" fill="#030391" />
        <polygon points="19,-33 0,-22 0,-11 19,-22" fill="#0D63B8" />

        <!-- Bottom-Left Isometric Cube -->
        <polygon points="-38,-11 -19,-22 0,-11 -19,0" fill="#1488DB" />
        <polygon points="-38,-11 -19,0 -19,22 -38,11" fill="#030391" />
        <polygon points="-19,0 0,-11 0,11 -19,22" fill="#0D63B8" />

        <!-- Bottom-Right Isometric Cube -->
        <polygon points="38,-11 19,-22 0,-11 19,0" fill="#1488DB" />
        <polygon points="19,0 0,-11 0,11 19,22" fill="#030391" />
        <polygon points="38,-11 19,0 19,22 38,11" fill="#0D63B8" />

        <!-- Bottom Center Connecting Prism -->
        <polygon points="0,12 19,23 0,34 -19,23" fill="#1488DB" />
        <polygon points="-19,23 0,34 0,44 -19,33" fill="#030391" />
        <polygon points="19,23 0,34 0,44 19,33" fill="#0D63B8" />

        <!-- Crisp White Isometric Grid Dividers -->
        <path d="M0,-22 L0,44 M-38,-11 L19,22 M38,-11 L-19,22" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linejoin="round" />

        <!-- Central White Hexagon Shield: BK TP.HCM -->
        <polygon points="0,-19 16.5,-9.5 16.5,9.5 0,19 -16.5,9.5 -16.5,-9.5" fill="#FFFFFF" stroke="#030391" stroke-width="1.6" stroke-linejoin="round" />
        <text x="0" y="1" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11.5" font-weight="900" fill="#030391" letter-spacing="0.2">BK</text>
        <text x="0" y="10" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="5.3" font-weight="700" fill="#030391" letter-spacing="0.3">TP.HCM</text>
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
    const bgTop = useNavyStage ? '#02053D' : '#D5D7DC';
    const bgBottom = useNavyStage ? '#040B66' : isDarkSubject ? '#DBDEE3' : '#DCDFE4';
    return `
      <defs>
        <linearGradient id="${uid}_bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${bgTop}" />
          <stop offset="100%" stop-color="${bgBottom}" />
        </linearGradient>
        <radialGradient id="${uid}_spot" cx="50%" cy="44%" r="60%">
          <stop offset="0%" stop-color="${useNavyStage ? '#1488DB' : '#EAECF0'}" stop-opacity="${useNavyStage ? '0.22' : '0.92'}" />
          <stop offset="100%" stop-color="#D5D7DC" stop-opacity="0" />
        </radialGradient>
        <filter id="${uid}_shadow" x="-18%" y="-18%" width="136%" height="145%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#050824" flood-opacity="${useNavyStage ? '0.50' : '0.16'}" />
        </filter>
        <filter id="${uid}_softShadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#050824" flood-opacity="${useNavyStage ? '0.40' : '0.13'}" />
        </filter>
      </defs>
      <rect x="0" y="0" width="480" height="360" fill="url(#${uid}_bg)" />
      ${
        useNavyStage
          ? `<polygon points="0,360 480,145 480,360" fill="#06148C" opacity="0.68" />
             <rect x="0" y="0" width="480" height="360" fill="url(#${uid}_spot)" />`
          : `<rect x="0" y="0" width="480" height="360" fill="url(#${uid}_spot)" />`
      }
    `;
  }

  function renderRealisticTee(item, pal, viewIndex, uid) {
    const isNavy = item.designVariant === 'tee-navy' || pal[0] === '#030391';
    const isHcmut = !item.campusId || item.campusId === 'hcmut';
    const bodyBase = isNavy ? '#081244' : '#FAFAFA';
    const bodyShade = isNavy ? '#040928' : '#E9ECEF';
    const bodyMid = isNavy ? '#0C1A5C' : '#FFFFFF';
    const foldStroke = isNavy ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)';
    const seamStroke = isNavy ? 'rgba(191,219,254,0.28)' : 'rgba(15,23,42,0.12)';
    const accentBand = isNavy ? '#FFFFFF' : '#1488DB';
    const accentPiping = isNavy ? '#1488DB' : '#030391';

    const fabricDefs = `
      <defs>
        <linearGradient id="${uid}_teeBody" x1="15%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stop-color="${bodyMid}" />
          <stop offset="52%" stop-color="${bodyBase}" />
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
        <radialGradient id="${uid}_chestSheen" cx="46%" cy="34%" r="54%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="${isNavy ? '0.11' : '0.72'}" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <clipPath id="${uid}_refClip">
          <rect x="0" y="0" width="90" height="58" rx="6" />
        </clipPath>
      </defs>
    `;

    if (viewIndex === 2) {
      // View 2: HCMUT Shop Product #1 Compliance & Spec Sheet
      return `
        ${fabricDefs}
        <g transform="translate(34, 24)">
          <rect x="0" y="0" width="412" height="302" rx="14" fill="#FFFFFF" filter="url(#${uid}_softShadow)" />
          <rect x="0" y="0" width="412" height="44" rx="14" fill="#030391" />
          <rect x="0" y="28" width="412" height="16" fill="#030391" />
          <text x="20" y="27" font-family="Arial, Helvetica, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" letter-spacing="0.6">THÔNG SỐ THIẾT KẾ · STYLE HCMUT SHOP (#1)</text>

          <!-- Front & Back Polo Silhouettes with Dual-Logo Placement -->
          <g transform="translate(22, 62)">
            <path d="M40 12 L68 6 L92 12 L118 28 L108 54 L94 46 L94 148 L38 148 L38 46 L24 54 L14 28 Z" fill="${bodyBase}" stroke="#94A3B8" stroke-width="1.4" />
            <!-- Collar & Placket Dual-Tone Trim -->
            <path d="M52 10 L66 28 L80 10" fill="none" stroke="${accentPiping}" stroke-width="1.8" />
            <rect x="63" y="24" width="6" height="22" rx="1" fill="${bodyMid}" stroke="#CBD5E1" stroke-width="0.8" />
            <!-- Dual-tone cuff bands -->
            <path d="M16 32 L24 52" stroke="${accentBand}" stroke-width="3" />
            <path d="M116 32 L108 52" stroke="${accentBand}" stroke-width="3" />
            <!-- Right Sleeve Logo + Left Chest Wordmark -->
            ${renderHcmutBrandMark({ cx: 28, cy: 36, r: 8, darkBg: isNavy })}
            ${renderHcmutWordmark({ x: 80, y: 40, scale: 0.08, variant: isNavy ? 'white' : 'two-tone', align: 'center' })}
            <text x="66" y="168" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8.5" fill="#475569">MẶT TRƯỚC · REGULAR FIT</text>
          </g>

          <g transform="translate(154, 62)">
            <path d="M40 12 L68 6 L92 12 L118 28 L108 54 L94 46 L94 148 L38 148 L38 46 L24 54 L14 28 Z" fill="${bodyBase}" stroke="#94A3B8" stroke-width="1.4" />
            <path d="M48 11 C60 15, 72 15, 84 11" fill="none" stroke="${accentBand}" stroke-width="2.6" />
            <path d="M48 9 C60 13, 72 13, 84 9" fill="none" stroke="${accentPiping}" stroke-width="1.2" />
            <path d="M16 32 L24 52" stroke="${accentBand}" stroke-width="3" />
            <path d="M116 32 L108 52" stroke="${accentBand}" stroke-width="3" />
            <text x="66" y="168" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8.5" fill="#475569">MẶT SAU · TỐI GIẢN</text>
          </g>

          <!-- Brand Color Swatches + Dual-Logo Breakdown -->
          <g transform="translate(292, 66)">
            <text x="0" y="10" font-family="Arial, Helvetica, sans-serif" font-size="8.5" font-weight="700" fill="#030391">PHỐI BO VIỀN 2 TÔNG</text>
            <rect x="0" y="18" width="98" height="22" rx="5" fill="#FFFFFF" stroke="#CBD5E1" />
            <rect x="0" y="31" width="98" height="5" fill="#1488DB" />
            <rect x="0" y="36" width="98" height="3" fill="#030391" />
            <text x="0" y="54" font-family="'Space Mono', monospace" font-size="7.6" fill="#334155">#1488DB × #030391</text>

            <text x="0" y="76" font-family="Arial, Helvetica, sans-serif" font-size="8.5" font-weight="700" fill="#030391">BỐ CỤC SONG LOGO</text>
            <text x="0" y="92" font-family="'Space Mono', monospace" font-size="7.5" fill="#475569">• Ngực trái: HCMUT</text>
            <text x="0" y="105" font-family="'Space Mono', monospace" font-size="7.5" fill="#475569">• Tay phải: BK TP.HCM</text>

            <g transform="translate(0, 120)">
              <rect x="0" y="0" width="90" height="58" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
              <image href="assets/products/hcmut-polo-white.png" x="0" y="0" width="90" height="58" preserveAspectRatio="xMidYMid slice" clip-path="url(#${uid}_refClip)" />
            </g>
          </g>

          <line x1="20" y1="262" x2="392" y2="262" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="20" y="282" font-family="'Space Mono', monospace" font-size="8.6" fill="#334155">70% COTTON · 25% POLYESTER · 5% SPANDEX · REGULAR FIT · NGUỒN: HCMUT</text>
        </g>
      `;
    }

    if (viewIndex === 1) {
      // View 1: Clean Back Polo Silhouette + Macro Sleeve Emblem & Dual-Tone Cuff Zoom
      return `
        ${fabricDefs}
        <g transform="translate(64, 18)" filter="url(#${uid}_shadow)">
          <!-- Back Polo Silhouette -->
          <path d="M110 22 C136 28, 172 28, 198 22 L240 30 L294 92 L256 142 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L52 142 L14 92 L68 30 Z"
                fill="url(#${uid}_teeBody)" />
          <!-- Sleeves Shading -->
          <path d="M68 30 L14 92 L52 142 L74 114 Z" fill="url(#${uid}_sleeveL)" opacity="0.6" />
          <path d="M240 30 L294 92 L256 142 L234 114 Z" fill="url(#${uid}_sleeveR)" opacity="0.6" />
          <!-- Dual-Tone Ribbed Sleeve Cuffs (#1488DB wide stripe + #030391 outer piping) -->
          <path d="M17 90 L53 137" stroke="${accentBand}" stroke-width="7" stroke-linecap="butt" />
          <path d="M14 93 L50 140" stroke="${accentPiping}" stroke-width="2.2" stroke-linecap="butt" />
          <path d="M291 90 L255 137" stroke="${accentBand}" stroke-width="7" stroke-linecap="butt" />
          <path d="M294 93 L258 140" stroke="${accentPiping}" stroke-width="2.2" stroke-linecap="butt" />

          <!-- Folded Back Polo Collar with Dual-Tone Edge Trim -->
          <path d="M108 22 C134 14, 174 14, 200 22 L195 34 C172 28, 136 28, 113 34 Z" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.9" />
          <path d="M113 33 C136 27, 172 27, 195 33" fill="none" stroke="${accentBand}" stroke-width="2.6" />
          <path d="M113 35.5 C136 29.5, 172 29.5, 195 35.5" fill="none" stroke="${accentPiping}" stroke-width="1.3" />

          <!-- Subtle Natural Pique Drape Folds -->
          <path d="M98 124 Q102 210 96 286" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
          <path d="M210 128 Q206 212 212 286" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
          <path d="M74 286 C122 292, 186 292, 234 286" fill="none" stroke="${seamStroke}" stroke-width="1" stroke-dasharray="3 2" />
        </g>

        <!-- Macro Detail Lens: Sleeve 3-Cube BK TP.HCM Emblem + Dual-Tone Cuff Rib -->
        <g transform="translate(384, 240)" filter="url(#${uid}_softShadow)">
          <circle cx="0" cy="0" r="54" fill="${bodyMid}" stroke="#FFFFFF" stroke-width="4" />
          <circle cx="0" cy="0" r="50" fill="none" stroke="${accentPiping}" stroke-width="1.2" opacity="0.35" />
          ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: -8, r: 22, darkBg: isNavy }) : ''}
          <!-- Dual-tone sleeve cuff trim bar -->
          <rect x="-38" y="21" width="76" height="5" fill="${accentBand}" />
          <rect x="-38" y="26" width="76" height="2.2" fill="${accentPiping}" />
          <text x="0" y="39" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6.4" font-weight="700" fill="${isNavy ? '#E2E8F0' : '#030391'}">THÊU TAY ÁO BK TP.HCM</text>
        </g>
      `;
    }

    // View 0: Front Studio Polo Mockup (Matches hcmut.edu.vn/hcmut-shop/product/1)
    return `
      ${fabricDefs}
      <g transform="translate(86, 16)" filter="url(#${uid}_shadow)">
        <!-- Left & Right Sleeves -->
        <path d="M68 30 L14 92 L52 142 L76 114 Z" fill="url(#${uid}_sleeveL)" />
        <path d="M240 30 L294 92 L256 142 L232 114 Z" fill="url(#${uid}_sleeveR)" />
        <!-- Signature Dual-Tone Sleeve Cuff Trim (#1488DB stripe + #030391 edge) -->
        <path d="M17 90 L53 137" stroke="${accentBand}" stroke-width="7.2" stroke-linecap="butt" />
        <path d="M14 93 L50 140" stroke="${accentPiping}" stroke-width="2.4" stroke-linecap="butt" />
        <path d="M291 90 L255 137" stroke="${accentBand}" stroke-width="7.2" stroke-linecap="butt" />
        <path d="M294 93 L258 140" stroke="${accentPiping}" stroke-width="2.4" stroke-linecap="butt" />

        <!-- Polo Garment Body -->
        <path d="M110 22 C132 46, 176 46, 198 22 L240 30 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L68 30 Z"
              fill="url(#${uid}_teeBody)" />
        <path d="M110 22 C132 46, 176 46, 198 22 L240 30 L234 114 L234 294 C186 300, 122 300, 74 294 L74 114 L68 30 Z"
              fill="url(#${uid}_chestSheen)" />

        <!-- Inner Collar Cavity -->
        <path d="M110 22 C134 12, 174 12, 198 22 C176 42, 132 42, 110 22 Z" fill="${isNavy ? '#030620' : '#D4D8DF'}" />

        <!-- Clean Polo Placket (Trụ cổ áo kín tối giản như hcmut-shop/product/1) -->
        <rect x="148" y="42" width="12" height="44" rx="1.5" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.9" />
        <line x1="148" y1="78" x2="160" y2="78" stroke="${seamStroke}" stroke-width="0.8" />

        <!-- Folded Polo Collar Leaves + Dual-Tone Outer Edge Stripe -->
        <path d="M110 22 L106 34 L148 56 L154 44 C136 39, 120 31, 110 22 Z" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.8" />
        <path d="M198 22 L202 34 L160 56 L154 44 C172 39, 188 31, 198 22 Z" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.8" />
        <!-- Collar Edge Piping (#1488DB + #030391) -->
        <path d="M107 32 L147 54" stroke="${accentBand}" stroke-width="2.4" stroke-linecap="round" />
        <path d="M106 34.5 L146 56" stroke="${accentPiping}" stroke-width="1.3" stroke-linecap="round" />
        <path d="M201 32 L161 54" stroke="${accentBand}" stroke-width="2.4" stroke-linecap="round" />
        <path d="M202 34.5 L162 56" stroke="${accentPiping}" stroke-width="1.3" stroke-linecap="round" />

        <!-- Natural Pique Fabric Fold & Clean Bottom Hem -->
        <path d="M96 122 Q100 206 94 284" fill="none" stroke="${foldStroke}" stroke-width="5.5" stroke-linecap="round" />
        <path d="M212 126 Q208 210 214 284" fill="none" stroke="${foldStroke}" stroke-width="4.5" stroke-linecap="round" />
        <path d="M74 286 C122 292, 186 292, 234 286" fill="none" stroke="${seamStroke}" stroke-width="1" stroke-dasharray="3 2" />

        <!-- Right Sleeve (Viewer Left): 3-Cube Hexagonal BK TP.HCM Emblem -->
        <g transform="translate(46, 86) rotate(-14)">
          ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: 0, r: 17, darkBg: isNavy }) : ''}
        </g>

        <!-- Left Chest (Viewer Right): Embroidered HCMUT Geometric Wordmark -->
        <g transform="translate(194, 92)">
          ${isHcmut ? renderHcmutWordmark({ x: 0, y: 0, scale: 0.16, variant: isNavy ? 'white' : 'two-tone', align: 'center' }) : ''}
        </g>
      </g>
    `;
  }

  function renderRealisticDeskMat(item, pal, viewIndex, uid) {
    const isDark = item.designVariant === 'pad-dark' || pal[0] === '#030391' || pal[3] === '#050C2E';
    const isHcmut = !item.campusId || item.campusId === 'hcmut';

    const padBg1 = isDark ? '#030391' : '#FFFFFF';
    const padBg2 = isDark ? '#050942' : '#EDF2F7';
    const outerPiping = isDark ? '#1488DB' : '#030391';
    const innerStripe = isDark ? '#FFFFFF' : '#1488DB';
    const stitchColor = isDark ? '#93C5FD' : '#64748B';

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
          <circle cx="1.5" cy="1.5" r="0.6" fill="${isDark ? '#FFFFFF' : '#030391'}" fill-opacity="0.04" />
          <circle cx="4.5" cy="4.5" r="0.6" fill="${isDark ? '#FFFFFF' : '#030391'}" fill-opacity="0.04" />
        </pattern>
        <pattern id="${uid}_hexCubePattern" width="28" height="32" patternUnits="userSpaceOnUse">
          <path d="M14 2 L25 8.5 L25 21.5 L14 28 L3 21.5 L3 8.5 Z" fill="none" stroke="${isDark ? '#FFFFFF' : '#030391'}" stroke-width="0.9" stroke-opacity="${isDark ? '0.11' : '0.07'}" />
          <path d="M14 2 L14 15 M14 15 L25 8.5 M14 15 L3 8.5" fill="none" stroke="${isDark ? '#93C5FD' : '#1488DB'}" stroke-width="0.8" stroke-opacity="${isDark ? '0.12' : '0.075'}" />
        </pattern>
      </defs>
    `;

    function renderMatArtwork(x, y, w, h) {
      const clipId = `${uid}_matClip_${Math.round(w)}_${Math.round(h)}`;
      const badgeRadius = Math.max(15, Math.min(20, Math.round(h * 0.12)));
      return `
        <g transform="translate(${x}, ${y})">
          <defs>
            <clipPath id="${clipId}">
              <rect x="0" y="0" width="${w}" height="${h}" rx="14" />
            </clipPath>
          </defs>
          <!-- 4mm Rubber Base Lip -->
          <rect x="0" y="3.5" width="${w}" height="${h}" rx="14" fill="#0F172A" opacity="0.4" />
          <!-- Main Microfiber Pad -->
          <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="url(#${uid}_padSurface)" />
          <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="url(#${uid}_microWeave)" />
          <!-- Subtle Hexagonal Cube Motif Wing (Product/1 BK Signature) -->
          <rect x="${Math.round(w * 0.66)}" y="0" width="${Math.round(w * 0.34)}" height="${h}" fill="url(#${uid}_hexCubePattern)" clip-path="url(#${clipId})" />

          <!-- Dual-Tone Outer Piping & Inner Accent Stripe (Style HCMUT Shop #1) -->
          <rect x="2.5" y="2.5" width="${w - 5}" height="${h - 5}" rx="12" fill="none" stroke="${outerPiping}" stroke-width="2.6" opacity="0.92" />
          <rect x="6.5" y="6.5" width="${w - 13}" height="${h - 13}" rx="9.5" fill="none" stroke="${innerStripe}" stroke-width="1.5" opacity="0.88" />
          <!-- Anti-Fray Overlock Stitch Detail -->
          <rect x="9.5" y="9.5" width="${w - 19}" height="${h - 19}" rx="7.5" fill="none" stroke="${stitchColor}" stroke-width="0.9" stroke-dasharray="3 2.5" opacity="0.45" />

          <!-- Dual-Logo Pairing: Left Wordmark + Bottom-Right 3-Cube BK Emblem -->
          ${isHcmut ? renderHcmutWordmark({ x: 22, y: 20, scale: Math.min(0.46, w / 860), variant: isDark ? 'white' : 'two-tone', align: 'left' }) : ''}
          ${isHcmut ? renderHcmutBrandMark({ cx: w - 34, cy: h - 30, r: badgeRadius, darkBg: isDark }) : ''}
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
          <text x="18" y="27" font-family="Arial, Helvetica, sans-serif" font-size="11.2" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">QUY CHUẨN LÓT CHUỘT DESKPAD · STYLE HCMUT SHOP (#1)</text>

          ${renderMatArtwork(46, 62, 320, 140)}

          <!-- Dimension Guide Lines -->
          <line x1="46" y1="216" x2="366" y2="216" stroke="#1488DB" stroke-width="1.5" />
          <line x1="46" y1="211" x2="46" y2="221" stroke="#1488DB" stroke-width="1.5" />
          <line x1="366" y1="211" x2="366" y2="221" stroke="#1488DB" stroke-width="1.5" />
          <text x="206" y="233" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9.5" font-weight="700" fill="#030391">
            ${isDark ? '900mm × 400mm × 4mm (XL FULL DESK)' : '800mm × 350mm × 4mm (STANDARD DESK)'}
          </text>

          <line x1="20" y1="248" x2="392" y2="248" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="20" y="268" font-family="'Space Mono', monospace" font-size="8.6" font-weight="700" fill="#0F172A">VIỀN KÉP ${isDark ? 'TRẮNG + XANH BK' : 'XANH TRỜI + ROYAL'} · PHỐI LOGO KÉP HCMUT &amp; BK</text>
          <text x="20" y="285" font-family="'Space Mono', monospace" font-size="8.4" fill="#475569">VẢI DỆT MICROFIBER CHỐNG THẤM · ĐẾ CAO SU TỰ NHIÊN CHỐNG TRƯỢT</text>
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
        <g transform="translate(66, 114)" filter="url(#${uid}_softShadow)">
          <rect x="0" y="0" width="214" height="82" rx="7" fill="${isDark ? '#1E293B' : '#334155'}" />
          <rect x="7" y="7" width="200" height="68" rx="4" fill="#0F172A" />
          ${[0, 1, 2, 3].map((row) => `<rect x="12" y="${12 + row * 15}" width="190" height="11" rx="2" fill="#E2E8F0" opacity="0.88" />`).join('')}
          <!-- Spacebar & Blue Escape Accent Key -->
          <rect x="12" y="12" width="14" height="11" rx="2" fill="#1488DB" />
          <rect x="56" y="57" width="84" height="11" rx="2" fill="#FFFFFF" />
        </g>

        <!-- Realistic Wireless Mouse Silhouette -->
        <g transform="translate(310, 126)" filter="url(#${uid}_softShadow)">
          <rect x="0" y="0" width="44" height="72" rx="21" fill="${isDark ? '#F8FAFC' : '#1E293B'}" />
          <line x1="22" y1="6" x2="22" y2="26" stroke="#94A3B8" stroke-width="1.2" />
          <rect x="19.5" y="12" width="5" height="11" rx="2.5" fill="#1488DB" />
        </g>

        <!-- Macro Dual-Tone Bo Viền & 4mm Edge Zoom -->
        <g transform="translate(402, 274)" filter="url(#${uid}_softShadow)">
          <circle cx="0" cy="0" r="38" fill="#FFFFFF" stroke="#030391" stroke-width="3" />
          <rect x="-24" y="-9" width="48" height="14" rx="4" fill="${isDark ? '#030391' : '#FFFFFF'}" stroke="#94A3B8" stroke-width="0.6" />
          <rect x="-24" y="4" width="48" height="7" rx="2" fill="#1E293B" />
          <line x1="-22" y1="-6" x2="22" y2="-6" stroke="${outerPiping}" stroke-width="2.2" />
          <line x1="-22" y1="-2.5" x2="22" y2="-2.5" stroke="${innerStripe}" stroke-width="1.5" />
          <text x="0" y="25" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6.8" font-weight="700" fill="#0F172A">BO KÉP 4MM</text>
        </g>
      `;
    }

    // View 0: Clean Floating Studio Render on Neutral Cyclorama (Style HCMUT Shop #1)
    return `
      ${padDefs}
      <ellipse cx="240" cy="282" rx="188" ry="12" fill="#0F172A" opacity="0.1" />
      <g filter="url(#${uid}_shadow)">
        ${renderMatArtwork(44, 76, 392, 198)}
      </g>
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

  const STUDIO_IMAGE_STYLES = {
    'assets/products/hcmut-polo-white.png': {
      background: '#D7D9DE',
      imgClass: 'object-contain p-1.5',
    },
    'assets/products/hcmut-polo-navy.png': {
      background: '#FFFEF9',
      imgClass: 'object-contain p-1.5',
    },
    'assets/products/hcmut-tee-sport.png': {
      background: 'linear-gradient(180deg, #CBD6EA 0%, #BCC8DF 100%)',
      imgClass: 'object-contain p-1.5',
    },
    'assets/products/hcmut-tote-studio.png': {
      background: 'linear-gradient(180deg, #004498 0%, #2BB0F5 100%)',
      imgClass: 'object-contain p-1.5',
    },
    'assets/products/hcmut-tote-lifestyle.png': {
      background: '#E5E7EB',
      imgClass: 'object-cover',
    },
  };

  function renderMerchIllustration(item, viewIndex = 0, options = {}) {
    const showSourceBadge = options.compact !== true && item && item.source;
    const sourceBadge = showSourceBadge
      ? `<span class="absolute bottom-2 left-2 z-10 px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1E1E24]/85 text-white rounded-md border border-white/25 pointer-events-none">Nguồn: ${escapeXml(item.source)}</span>`
      : '';

    const imageSrc = item && Array.isArray(item.galleryImages) ? item.galleryImages[viewIndex] : null;
    if (imageSrc) {
      const studioStyle = STUDIO_IMAGE_STYLES[imageSrc] || {
        background: '#02053D',
        imgClass: 'object-cover',
      };
      return `
        <div class="w-full h-full relative flex items-center justify-center overflow-hidden" style="background: ${studioStyle.background}">
          <img src="${escapeXml(imageSrc)}" alt="${escapeXml(item.title)}" class="w-full h-full ${studioStyle.imgClass}" loading="lazy" />
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
