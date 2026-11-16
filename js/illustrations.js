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
            ? `<polygon points="0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25" fill="#FFFFFF" />`
            : `<polygon points="0,-48 41.6,-24 41.6,24 0,48 -41.6,24 -41.6,-24" fill="#FFFFFF" />`
        }
        <polygon points="-39.84,-23 0,-46 0,-21 -18.19,-10.5" fill="#030391" />
        <polygon points="0,-46 39.84,-23 18.19,-10.5 0,-21" fill="#1488DB" />
        <polygon points="39.84,-23 39.84,23 18.19,10.5 18.19,-10.5" fill="#030391" />
        <polygon points="39.84,23 0,46 0,21 18.19,10.5" fill="#1488DB" />
        <polygon points="0,46 -39.84,23 -18.19,10.5 0,21" fill="#030391" />
        <polygon points="-39.84,23 -39.84,-23 -18.19,-10.5 -18.19,10.5" fill="#1488DB" />
        <line x1="-39.84" y1="-23" x2="-18.19" y2="-10.5" stroke="#FFFFFF" stroke-width="2.4" />
        <line x1="39.84" y1="-23" x2="18.19" y2="-10.5" stroke="#FFFFFF" stroke-width="2.4" />
        <line x1="0" y1="46" x2="0" y2="21" stroke="#FFFFFF" stroke-width="2.4" />
        <polygon points="0,-21 18.19,-10.5 18.19,10.5 0,21 -18.19,10.5 -18.19,-10.5" fill="#FFFFFF" />
        <text x="0" y="1.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14.5" font-weight="900" fill="#030391" letter-spacing="0.2">BK</text>
        <text x="0" y="10.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="5.6" font-weight="800" fill="#1488DB" letter-spacing="0.3">TP.HCM</text>
      </g>
    `;
  }

  /**
   * Official HCMUT Wordmark (Geometric Lockup: HCM #030391 + UT #1488DB on white,
   * or full #FFFFFF on deep navy #030391). Coordinate box: width 250, height 46.
   */
  function renderHcmutWordmark({ x = 0, y = 0, scale = 1, variant = 'two-tone', align = 'left' }) {
    const isWhite = variant === 'white';
    const cHcm = isWhite ? '#FFFFFF' : '#030391';
    const cUt = isWhite ? '#FFFFFF' : '#1488DB';
    const ox = align === 'center' ? -125 : align === 'right' ? -250 : 0;

    return `
      <g transform="translate(${x}, ${y}) scale(${scale}) translate(${ox}, 0)">
        <path d="M0 0 H14 V17.5 H37.5 V0 H51.5 V46 H37.5 V28.5 H14 V46 H0 Z" fill="${cHcm}" />
        <path d="M103 0 H69 C59.5 0 55.5 4.5 55.5 13.5 V32.5 C55.5 41.5 59.5 46 69 46 H103 V34.5 H73 C70.2 34.5 69.5 33.4 69.5 30.5 V15.5 C69.5 12.6 70.2 11.5 73 11.5 H103 Z" fill="${cHcm}" />
        <path d="M107 46 V0 H123 L133.5 25 L144 0 H160 V46 H148 V18 L139.5 39 H127.5 L119 18 V46 Z" fill="${cHcm}" />
        <path d="M163.7 0 H178 V29.5 C178 33.2 181 35 187.8 35 C194.5 35 197.5 33.2 197.5 29.5 V6.2 L211.8 15.2 V31 C211.8 40.8 205.2 46 187.8 46 C170.3 46 163.7 40.8 163.7 31 Z" fill="${cUt}" />
        <path d="M197.8 0 H250 V11.2 H230.3 V46 H216.2 V11.6 Z" fill="${cUt}" />
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

  function renderPoloGarment({ subUid, uid, isNavy, isHcmut, side = 'front' }) {
    const bodyBase = isNavy ? '#081244' : '#FAFAFA';
    const bodyMid = isNavy ? '#0C1A5C' : '#FFFFFF';
    const foldStroke = isNavy ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)';
    const seamStroke = isNavy ? 'rgba(191,219,254,0.28)' : 'rgba(15,23,42,0.12)';
    const accentBand = isNavy ? '#FFFFFF' : '#1488DB';
    const accentPiping = isNavy ? '#1488DB' : '#030391';
    const garmentOutline =
      'M 106 24 C 132 30, 176 30, 202 24 L 242 33 L 294 94 L 256 142 L 234 116 L 234 292 C 186 299, 122 299, 74 292 L 74 116 L 52 142 L 14 94 L 66 33 Z';

    return `
      <defs>
        <clipPath id="${subUid}_garmentClip">
          <path d="${garmentOutline}" />
        </clipPath>
      </defs>
      <g clip-path="url(#${subUid}_garmentClip)">
        <!-- Main Garment Silhouette -->
        <path d="${garmentOutline}" fill="url(#${uid}_teeBody)" />
        <!-- Left & Right Sleeves Shading -->
        <path d="M 66 33 L 14 94 L 52 142 L 76 114 Z" fill="url(#${uid}_sleeveL)" opacity="0.65" />
        <path d="M 242 33 L 294 94 L 256 142 L 232 114 Z" fill="url(#${uid}_sleeveR)" opacity="0.65" />
        <path d="${garmentOutline}" fill="url(#${uid}_chestSheen)" />

        <!-- Clipped Dual-Tone Sleeve Cuff Ribbing (Never protrudes outside sleeve) -->
        <path d="M 16 86 L 60 141" stroke="${accentBand}" stroke-width="9" stroke-linecap="butt" />
        <path d="M 12 91 L 55 145" stroke="${accentPiping}" stroke-width="4.5" stroke-linecap="butt" />
        <path d="M 292 86 L 248 141" stroke="${accentBand}" stroke-width="9" stroke-linecap="butt" />
        <path d="M 296 91 L 253 145" stroke="${accentPiping}" stroke-width="4.5" stroke-linecap="butt" />

        <!-- Subtle Armhole, Fold & Hem Seams -->
        <path d="M 66 33 Q 73 76 74 116" fill="none" stroke="${seamStroke}" stroke-width="1" />
        <path d="M 242 33 Q 235 76 234 116" fill="none" stroke="${seamStroke}" stroke-width="1" />
        <path d="M 96 126 Q 100 208 94 284" fill="none" stroke="${foldStroke}" stroke-width="5" stroke-linecap="round" />
        <path d="M 212 126 Q 208 208 214 284" fill="none" stroke="${foldStroke}" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 74 285 C 122 292, 186 292, 234 285" fill="none" stroke="${seamStroke}" stroke-width="1" stroke-dasharray="3 2" />
      </g>

      <!-- Crisp Outer Contour Stroke -->
      <path d="${garmentOutline}" fill="none" stroke="${seamStroke}" stroke-width="1.1" />

      ${
        side === 'front'
          ? `
        <!-- Inner Neck Stand Shadow -->
        <path d="M 108 22 C 134 14, 174 14, 200 22 C 184 40, 124 40, 108 22 Z" fill="${isNavy ? '#030620' : '#D5DAE2'}" />
        <path d="M 140 28 L 154 44 L 168 28 Z" fill="${isNavy ? '#050C38' : '#E2E8F0'}" />

        <!-- Buttonless Placket (Meets collar blades seamlessly at y=40..53) -->
        <rect x="147.5" y="40" width="13" height="46" rx="1.5" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.9" />
        <line x1="147.5" y1="80" x2="160.5" y2="80" stroke="${seamStroke}" stroke-width="0.8" />

        <!-- Collar Back Stand Band -->
        <path d="M 108 21 C 134 12, 174 12, 200 21 C 174 26, 134 26, 108 21 Z" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.8" />

        <!-- Left & Right Folded Polo Collar Blades -->
        <path d="M 108 21 C 101 26, 98 34, 100 40 L 147.5 53 L 154 40 C 136 36, 120 29, 108 21 Z" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.9" stroke-linejoin="round" />
        <path d="M 200 21 C 207 26, 210 34, 208 40 L 160.5 53 L 154 40 C 172 36, 188 29, 200 21 Z" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.9" stroke-linejoin="round" />

        <!-- Dual-Tone Collar Edge Trim (#1488DB inner stripe + #030391 outer edge) -->
        <path d="M 101 37.5 L 147 50.2" stroke="${accentBand}" stroke-width="2.3" stroke-linecap="round" />
        <path d="M 100.2 39.8 L 147 52.5" stroke="${accentPiping}" stroke-width="1.4" stroke-linecap="round" />
        <path d="M 207 37.5 L 161 50.2" stroke="${accentBand}" stroke-width="2.3" stroke-linecap="round" />
        <path d="M 207.8 39.8 L 161 52.5" stroke="${accentPiping}" stroke-width="1.4" stroke-linecap="round" />

        <!-- Right Sleeve (Viewer Left): Official 3-Cube BK TP.HCM Emblem -->
        <g transform="translate(48, 84) rotate(-18)">
          ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: 0, r: 14.5, darkBg: isNavy }) : ''}
        </g>

        <!-- Left Chest (Viewer Right): Official HCMUT Geometric Wordmark -->
        <g transform="translate(192, 84)">
          ${isHcmut ? renderHcmutWordmark({ x: 0, y: 0, scale: 0.145, variant: isNavy ? 'white' : 'two-tone', align: 'center' }) : ''}
        </g>
      `
          : `
        <!-- Folded Back Polo Collar with Dual-Tone Trim -->
        <path d="M 106 23 C 134 15, 174 15, 202 23 L 197 36 C 172 30, 136 30, 111 36 Z" fill="${bodyMid}" stroke="${seamStroke}" stroke-width="0.9" stroke-linejoin="round" />
        <path d="M 111 33.2 C 136 27.2, 172 27.2, 197 33.2" fill="none" stroke="${accentBand}" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 111 35.6 C 136 29.6, 172 29.6, 197 35.6" fill="none" stroke="${accentPiping}" stroke-width="1.4" stroke-linecap="round" />
      `
      }
    `;
  }

  function renderRealisticTee(item, pal, viewIndex, uid) {
    const isNavy = item.designVariant === 'tee-navy' || pal[0] === '#030391';
    const isHcmut = !item.campusId || item.campusId === 'hcmut';
    const bodyBase = isNavy ? '#081244' : '#FAFAFA';
    const bodyShade = isNavy ? '#040928' : '#E9ECEF';
    const bodyMid = isNavy ? '#0C1A5C' : '#FFFFFF';
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
        <clipPath id="${uid}_lensClip">
          <circle cx="0" cy="0" r="52" />
        </clipPath>
      </defs>
    `;

    if (viewIndex === 2) {
      return `
        ${fabricDefs}
        <g transform="translate(34, 24)">
          <rect x="0" y="0" width="412" height="302" rx="14" fill="#FFFFFF" filter="url(#${uid}_softShadow)" />
          <rect x="0" y="0" width="412" height="44" rx="14" fill="#030391" />
          <rect x="0" y="28" width="412" height="16" fill="#030391" />
          <text x="20" y="27" font-family="Arial, Helvetica, sans-serif" font-size="11.5" font-weight="700" fill="#FFFFFF" letter-spacing="0.6">THÔNG SỐ THIẾT KẾ · STYLE HCMUT SHOP (#1)</text>

          <!-- Accurate Scaled Front & Back Polo Silhouettes -->
          <g transform="translate(12, 54)">
            <g transform="scale(0.42)">
              ${renderPoloGarment({ subUid: uid + '_f2', uid, isNavy, isHcmut, side: 'front' })}
            </g>
            <text x="65" y="142" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8.2" font-weight="700" fill="#334155">MẶT TRƯỚC · REGULAR FIT</text>
          </g>

          <g transform="translate(142, 54)">
            <g transform="scale(0.42)">
              ${renderPoloGarment({ subUid: uid + '_b2', uid, isNavy, isHcmut, side: 'back' })}
            </g>
            <text x="65" y="142" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8.2" font-weight="700" fill="#334155">MẶT SAU · TỐI GIẢN</text>
          </g>

          <!-- Brand Color Swatches + Dual-Logo Breakdown -->
          <g transform="translate(280, 62)">
            <text x="0" y="10" font-family="Arial, Helvetica, sans-serif" font-size="8.5" font-weight="700" fill="#030391">PHỐI BO VIỀN 2 TÔNG</text>
            <rect x="0" y="17" width="112" height="22" rx="5" fill="${isNavy ? '#081244' : '#FFFFFF'}" stroke="#CBD5E1" />
            <rect x="0" y="30" width="112" height="5" fill="${accentBand}" />
            <rect x="0" y="35" width="112" height="3.5" fill="${accentPiping}" />
            <text x="0" y="52" font-family="'Space Mono', monospace" font-size="7.5" fill="#334155">${isNavy ? '#FFFFFF × #1488DB' : '#1488DB × #030391'}</text>

            <text x="0" y="72" font-family="Arial, Helvetica, sans-serif" font-size="8.5" font-weight="700" fill="#030391">BỐ CỤC SONG LOGO</text>
            <g transform="translate(0, 80)">
              <rect x="0" y="0" width="112" height="42" rx="6" fill="${isNavy ? '#081244' : '#F8FAFC'}" stroke="#CBD5E1" />
              ${renderHcmutWordmark({ x: 10, y: 13, scale: 0.22, variant: isNavy ? 'white' : 'two-tone', align: 'left' })}
              ${renderHcmutBrandMark({ cx: 90, cy: 21, r: 14, darkBg: isNavy })}
            </g>
            <text x="0" y="136" font-family="'Space Mono', monospace" font-size="7.2" fill="#475569">Ngực trái + Tay áo phải</text>
          </g>

          <line x1="20" y1="224" x2="392" y2="224" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="20" y="244" font-family="'Space Mono', monospace" font-size="8.5" font-weight="700" fill="#030391">CHẤT LIỆU OWEN REGULAR FIT · 70% COTTON · 25% POLYESTER · 5% SPANDEX</text>
          <text x="20" y="262" font-family="'Space Mono', monospace" font-size="8.2" fill="#475569">CỔ BẺ PHỐI SỌC KÉP GIỮ PHOM · LOGO IN CHUYỂN NHIỆT SẮC NÉT · NGUỒN: HCMUT</text>
          <text x="20" y="280" font-family="'Space Mono', monospace" font-size="8.0" fill="#64748B">THAM CHIẾU TRỰC TIẾP: HCMUT.EDU.VN/HCMUT-SHOP/PRODUCT/1</text>
        </g>
      `;
    }

    if (viewIndex === 1) {
      return `
        ${fabricDefs}
        <g transform="translate(62, 18)" filter="url(#${uid}_shadow)">
          ${renderPoloGarment({ subUid: uid + '_b1', uid, isNavy, isHcmut, side: 'back' })}
        </g>

        <!-- Macro Detail Lens: Sleeve 3-Cube BK TP.HCM Emblem + Clipped Cuff Bar -->
        <g transform="translate(386, 242)" filter="url(#${uid}_softShadow)">
          <circle cx="0" cy="0" r="56" fill="#FFFFFF" />
          <g clip-path="url(#${uid}_lensClip)">
            <rect x="-56" y="-56" width="112" height="112" fill="${bodyMid}" />
            ${isHcmut ? renderHcmutBrandMark({ cx: 0, cy: -11, r: 21, darkBg: isNavy }) : ''}
            <rect x="-56" y="17" width="112" height="5.5" fill="${accentBand}" />
            <rect x="-56" y="22.5" width="112" height="2.8" fill="${accentPiping}" />
            <text x="0" y="38" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6.5" font-weight="700" fill="${isNavy ? '#E2E8F0' : '#030391'}">LOGO TAY ÁO BK</text>
          </g>
          <circle cx="0" cy="0" r="52" fill="none" stroke="${accentPiping}" stroke-width="1.5" opacity="0.4" />
        </g>
      `;
    }

    return `
      ${fabricDefs}
      <g transform="translate(86, 16)" filter="url(#${uid}_shadow)">
        ${renderPoloGarment({ subUid: uid + '_f0', uid, isNavy, isHcmut, side: 'front' })}
      </g>
    `;
  }

  function renderRealisticDeskMat(item, pal, viewIndex, uid) {
    const isDark = item.designVariant === 'pad-dark' || pal[0] === '#030391' || pal[3] === '#050C2E';
    const isHcmut = !item.campusId || item.campusId === 'hcmut';

    const padBg1 = isDark ? '#030391' : '#FFFFFF';
    const padBg2 = isDark ? '#040836' : '#F4F6FA';
    const outerPiping = isDark ? '#1488DB' : '#030391';
    const innerStripe = isDark ? '#FFFFFF' : '#1488DB';

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
          <circle cx="1.5" cy="1.5" r="0.55" fill="${isDark ? '#FFFFFF' : '#030391'}" fill-opacity="0.035" />
          <circle cx="4.5" cy="4.5" r="0.55" fill="${isDark ? '#FFFFFF' : '#030391'}" fill-opacity="0.035" />
        </pattern>
        <clipPath id="${uid}_padZoomClip">
          <circle cx="0" cy="0" r="35" />
        </clipPath>
      </defs>
    `;

    function renderMatArtwork(x, y, w, h) {
      const badgeRadius = Math.max(14, Math.min(18, Math.round(h * 0.105)));
      const wordmarkScale = Math.min(0.36, w / 1020);
      const wordmarkH = Math.round(46 * wordmarkScale);
      return `
        <g transform="translate(${x}, ${y})">
          <!-- 4mm Anti-Slip Rubber Base Shadow Lip -->
          <rect x="0" y="3.5" width="${w}" height="${h}" rx="15" fill="#0F172A" opacity="0.38" />
          <!-- Clean Minimalist Microfiber Surface (Matches Product/1 Uncluttered Surface) -->
          <rect x="0" y="0" width="${w}" height="${h}" rx="15" fill="url(#${uid}_padSurface)" />
          <rect x="0" y="0" width="${w}" height="${h}" rx="15" fill="url(#${uid}_microWeave)" />

          <!-- Signature Dual-Tone Edge Trim (Matches Product/1 Collar & Cuff Ribbing) -->
          <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="13" fill="none" stroke="${outerPiping}" stroke-width="2.8" />
          <rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="10" fill="none" stroke="${innerStripe}" stroke-width="1.6" opacity="0.92" />

          <!-- Dual-Logo Pairing: Bottom-Left HCMUT Wordmark + Top-Right 3-Cube BK TP.HCM Emblem -->
          ${isHcmut ? renderHcmutWordmark({ x: 22, y: h - 18 - wordmarkH, scale: wordmarkScale, variant: isDark ? 'white' : 'two-tone', align: 'left' }) : ''}
          ${isHcmut ? renderHcmutBrandMark({ cx: w - 30, cy: 30, r: badgeRadius, darkBg: isDark }) : ''}
        </g>
      `;
    }

    if (viewIndex === 2) {
      return `
        ${padDefs}
        <g transform="translate(34, 24)">
          <rect x="0" y="0" width="412" height="302" rx="14" fill="#FFFFFF" filter="url(#${uid}_softShadow)" />
          <rect x="0" y="0" width="412" height="44" rx="14" fill="#030391" />
          <rect x="0" y="28" width="412" height="16" fill="#030391" />
          <text x="18" y="27" font-family="Arial, Helvetica, sans-serif" font-size="11.2" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">QUY CHUẨN LÓT CHUỘT DESKPAD · STYLE HCMUT SHOP (#1)</text>

          ${renderMatArtwork(46, 60, 320, 142)}

          <!-- Dimension Guide Lines -->
          <line x1="46" y1="216" x2="366" y2="216" stroke="#1488DB" stroke-width="1.5" />
          <line x1="46" y1="211" x2="46" y2="221" stroke="#1488DB" stroke-width="1.5" />
          <line x1="366" y1="211" x2="366" y2="221" stroke="#1488DB" stroke-width="1.5" />
          <text x="206" y="233" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9.5" font-weight="700" fill="#030391">
            ${isDark ? '900mm × 400mm × 4mm (XL FULL DESK)' : '800mm × 350mm × 4mm (STANDARD DESK)'}
          </text>

          <line x1="20" y1="248" x2="392" y2="248" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="20" y="268" font-family="'Space Mono', monospace" font-size="8.6" font-weight="700" fill="#0F172A">VIỀN KÉP ${isDark ? 'TRẮNG + XANH BK' : 'XANH TRỜI + ROYAL'} · PHỐI LOGO KÉP HCMUT &amp; BK TP.HCM</text>
          <text x="20" y="285" font-family="'Space Mono', monospace" font-size="8.4" fill="#475569">BỀ MẶT MICROFIBER TỐI GIẢN · ĐẾ CAO SU TỰ NHIÊN DÀY 4MM CHỐNG TRƯỢT</text>
        </g>
      `;
    }

    if (viewIndex === 1) {
      const keyRows = [
        [14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 18],
        [17, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 15],
        [20, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 23],
        [16, 14, 14, 66, 14, 14, 11, 11, 11],
      ];
      let keysSvg = '';
      keyRows.forEach((row, rIdx) => {
        let curX = 9;
        const ky = 9 + rIdx * 14;
        row.forEach((kw, kIdx) => {
          let fill = '#F8FAFC';
          if (rIdx === 0 && kIdx === 0) fill = '#1488DB';
          else if (rIdx === 2 && kIdx === row.length - 1) fill = '#030391';
          else if (rIdx === 3 && kw === 66) fill = '#E2E8F0';
          else if (kIdx === 0 || kIdx === row.length - 1) fill = '#CBD5E1';
          keysSvg += `<rect x="${curX}" y="${ky}" width="${kw}" height="11" rx="2" fill="${fill}" />`;
          curX += kw + 2.2;
        });
      });

      return `
        ${padDefs}
        <rect x="18" y="24" width="444" height="304" rx="16" fill="url(#${uid}_deskSurface)" />
        <g filter="url(#${uid}_shadow)">
          ${renderMatArtwork(36, 66, 408, 200)}
        </g>

        <!-- Sleek 65% Mechanical Keyboard (Bottom-left HCMUT & Top-right BK remain 100% clear) -->
        <g transform="translate(64, 92)" filter="url(#${uid}_softShadow)">
          <rect x="0" y="0" width="204" height="72" rx="7" fill="#1E293B" stroke="#475569" stroke-width="1" />
          <rect x="5" y="5" width="194" height="62" rx="4" fill="#0F172A" />
          ${keysSvg}
        </g>

        <!-- Wireless Pro Mouse Silhouette -->
        <g transform="translate(298, 106)" filter="url(#${uid}_softShadow)">
          <rect x="0" y="0" width="40" height="66" rx="20" fill="${isDark ? '#F8FAFC' : '#1E293B'}" stroke="${isDark ? '#CBD5E1' : '#334155'}" stroke-width="1" />
          <line x1="20" y1="4" x2="20" y2="24" stroke="#94A3B8" stroke-width="1.1" />
          <rect x="17.8" y="10" width="4.4" height="10" rx="2.2" fill="#1488DB" />
        </g>

        <!-- Macro Dual-Tone Bo Viền & 4mm Edge Zoom (Bottom-Right) -->
        <g transform="translate(402, 268)" filter="url(#${uid}_softShadow)">
          <circle cx="0" cy="0" r="38" fill="#FFFFFF" />
          <g clip-path="url(#${uid}_padZoomClip)">
            <rect x="-36" y="-36" width="72" height="72" fill="#F1F5F9" />
            <rect x="-26" y="-11" width="52" height="15" rx="3" fill="${isDark ? '#030391' : '#FFFFFF'}" stroke="#94A3B8" stroke-width="0.6" />
            <rect x="-26" y="4" width="52" height="7" rx="2" fill="#0F172A" />
            <line x1="-24" y1="-8" x2="24" y2="-8" stroke="${outerPiping}" stroke-width="2.4" />
            <line x1="-24" y1="-4" x2="24" y2="-4" stroke="${innerStripe}" stroke-width="1.6" />
            <text x="0" y="24" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6.6" font-weight="700" fill="#0F172A">BO KÉP 4MM</text>
          </g>
          <circle cx="0" cy="0" r="35" fill="none" stroke="#030391" stroke-width="2.5" />
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
      background: '#D3D3D3',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-polo-navy.png': {
      background: '#FFFEF8',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-tee-sport.png': {
      background: '#CBD6EA',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-tote-studio.png': {
      background: '#004498',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-tote-lifestyle.png': {
      background: '#E5E7EB',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-tote.jpg': {
      background: '#E5E7EB',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-deskpad.png': {
      background: '#D3D3D3',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-deskpad-closeup.png': {
      background: '#D3D3D3',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-deskpad-top.png': {
      background: '#D3D3D3',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-cap.jpg': {
      background: '#071B4B',
      imgClass: 'object-cover',
      objectPosition: 'center 52%',
    },
    'assets/products/hcmut-bottle-studio.jpg': {
      background: '#D5DCE2',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-bottle-desk.jpg': {
      background: '#CFCBC4',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-merch-kit.jpg': {
      background: '#040B3C',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
    'assets/products/hcmut-metal-detail.jpg': {
      background: '#03082B',
      imgClass: 'object-cover',
      objectPosition: 'center center',
    },
  };

  function renderMerchIllustration(item, viewIndex = 0) {
    const galleryImages = item && Array.isArray(item.galleryImages) ? item.galleryImages : [];
    const imageSrc = galleryImages[viewIndex] || galleryImages[0] || null;
    if (imageSrc) {
      const studioStyle = STUDIO_IMAGE_STYLES[imageSrc] || {
        background: '#F3F0EA',
        imgClass: 'object-cover',
        objectPosition: 'center center',
      };
      return `
        <div class="w-full h-full relative flex items-center justify-center overflow-hidden" style="background: ${studioStyle.background}">
          <img src="${escapeXml(imageSrc)}" alt="${escapeXml(item.title)}" class="w-full h-full ${studioStyle.imgClass} transition-transform duration-500 ease-out group-hover:scale-[1.025]" style="object-position: ${studioStyle.objectPosition}" loading="lazy" />
        </div>
      `;
    }

    if (item && item.customImageUrl && viewIndex === 0) {
      return `
        <div class="w-full h-full relative bg-[#F3F0EA] flex items-center justify-center overflow-hidden">
          <img src="${escapeXml(item.customImageUrl)}" alt="${escapeXml(item.title)}" class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]" loading="lazy" />
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
      </div>
    `;
  }

  function renderCampusEmblem(campus) {
    if (campus && campus.logo) {
      const shortName = campus.shortName || 'UNI';
      return `
        <div class="w-10 h-10 bg-white border border-[#E2DDD5] p-1 flex items-center justify-center shrink-0 overflow-hidden">
          <img src="${escapeXml(campus.logo)}" alt="Logo ${escapeXml(shortName)}" class="w-full h-full object-contain" loading="lazy" />
        </div>
      `;
    }
    if (campus && campus.id === 'hcmut') {
      return `
        <svg viewBox="0 0 112 112" class="w-10 h-10 shrink-0" aria-hidden="true">
          ${renderHcmutBrandMark({ cx: 56, cy: 56, r: 50, darkBg: false })}
        </svg>
      `;
    }
    const c1 = (campus && campus.color) || '#030391';
    const c2 = (campus && campus.secondaryColor) || '#1488DB';
    const shortName = (campus && campus.shortName) || 'UNI';
    return `
      <svg viewBox="0 0 56 56" class="w-10 h-10 shrink-0" aria-hidden="true">
        <path d="M10 10 L46 8 L44 36 Q28 50 12 36 Z" fill="${c2}" stroke="#E2DDD5" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M15 15 L41 13 L39 34 Q28 44 17 34 Z" fill="${c1}" stroke="#FFFFFF" stroke-width="1" stroke-linejoin="round" />
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
