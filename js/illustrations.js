/* ==========================================================================
   UniVibe — Hand-Drawn SVG Illustration Engine & Prompt Recipes
   Inspired by threerocks/hand-drawn-styles & Sketchbook Marker Aesthetics
   ========================================================================== */

(function (global) {
  'use strict';

  const INK = '#1E1E24';

  function escapeXml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safePalette(palette) {
    const fallback = ['#2D5DA1', '#FFF3B0', '#FF4D4D', '#FDFBF7'];
    if (!Array.isArray(palette) || palette.length === 0) return fallback;
    return [
      palette[0] || fallback[0],
      palette[1] || fallback[1],
      palette[2] || fallback[2],
      palette[3] || fallback[3],
    ];
  }

  function renderBackgroundGrid(isBlueprint, accentTint) {
    if (isBlueprint) {
      return `
        <rect x="0" y="0" width="480" height="360" fill="#F4F7FB" />
        <g stroke="#2D5DA1" stroke-opacity="0.16" stroke-width="1">
          ${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 32}" y1="0" x2="${i * 32}" y2="360" />`).join('')}
          ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 32}" x2="480" y2="${i * 32}" />`).join('')}
        </g>
        <rect x="14" y="14" width="452" height="332" rx="12" fill="none" stroke="#2D5DA1" stroke-width="1.8" stroke-dasharray="7 5" opacity="0.55" />
      `;
    }
    return `
      <rect x="0" y="0" width="480" height="360" fill="#FDFBF7" />
      <circle cx="245" cy="180" r="132" fill="${accentTint}" opacity="0.18" />
      <path d="M98 286 C155 294, 322 292, 384 282" stroke="${INK}" stroke-opacity="0.14" stroke-width="6" stroke-linecap="round" fill="none" />
      <g fill="${INK}" fill-opacity="0.09">
        <circle cx="52" cy="48" r="2" /><circle cx="76" cy="48" r="2" /><circle cx="100" cy="48" r="2" />
        <circle cx="52" cy="72" r="2" /><circle cx="76" cy="72" r="2" /><circle cx="100" cy="72" r="2" />
        <circle cx="382" cy="292" r="2" /><circle cx="406" cy="292" r="2" /><circle cx="430" cy="292" r="2" />
      </g>
    `;
  }

  function renderJacket(pal, code, viewIndex, titleNote) {
    const [c1, c2, c3, c4] = pal;
    if (viewIndex === 1) {
      // Mặt sau & thêu chi tiết
      return `
        <g transform="translate(86, 36)">
          <!-- Back Varsity Jacket Silhouette -->
          <path d="M96 36 C120 26, 188 26, 212 36 L278 66 L298 188 L254 196 L242 106 L240 258 C196 266, 112 266, 68 258 L66 106 L54 196 L10 188 L30 66 Z"
                fill="${c1}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
          <!-- Sleeves -->
          <path d="M30 66 L10 188 L54 196 L66 106 Z" fill="${c2}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" />
          <path d="M278 66 L298 188 L254 196 L242 106 Z" fill="${c2}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" />
          <!-- Ribbed Collar & Hem -->
          <path d="M96 36 C124 52, 184 52, 212 36 C192 24, 116 24, 96 36 Z" fill="${c3}" stroke="${INK}" stroke-width="3" />
          <path d="M68 242 C112 249, 196 249, 240 242 L240 260 C196 267, 112 267, 68 260 Z" fill="${c3}" stroke="${INK}" stroke-width="3" />
          <!-- Giant Chenille Back Crest -->
          <path d="M106 86 Q154 72 202 86 L196 164 Q154 196 112 164 Z" fill="${c4}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" />
          <path d="M114 94 Q154 83 194 94 L189 158 Q154 184 119 158 Z" fill="${c2}" stroke="${INK}" stroke-width="2" stroke-dasharray="5 3" />
          <text x="154" y="132" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="23" font-weight="800" fill="${INK}">${escapeXml(code)}</text>
          <text x="154" y="156" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="13" font-weight="700" fill="${c3}">BACK CHENILLE PATCH</text>
          <!-- Callout -->
          <path d="M206 120 Q258 106 272 72" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3" />
          <circle cx="206" cy="120" r="4" fill="${c3}" stroke="${INK}" stroke-width="2" />
          <text x="276" y="66" font-family="'Patrick Hand', cursive" font-size="13" fill="${INK}">Thêu xù 3D</text>
        </g>
      `;
    }
    if (viewIndex === 2) {
      // Phác thảo Blueprint
      return `
        <g transform="translate(88, 36)">
          <path d="M96 36 C120 26, 188 26, 212 36 L278 66 L298 188 L254 196 L242 106 L240 258 C196 266, 112 266, 68 258 L66 106 L54 196 L10 188 L30 66 Z"
                fill="none" stroke="#2D5DA1" stroke-width="2.6" stroke-dasharray="7 4" stroke-linejoin="round" />
          <line x1="154" y1="26" x2="154" y2="266" stroke="#2D5DA1" stroke-width="2" stroke-dasharray="4 4" />
          <path d="M96 36 C120 56, 188 56, 212 36" fill="none" stroke="#2D5DA1" stroke-width="2" />
          <rect x="176" y="88" width="44" height="44" rx="8" fill="${c2}" fill-opacity="0.45" stroke="#2D5DA1" stroke-width="2" />
          <text x="198" y="115" text-anchor="middle" font-family="'Space Mono', monospace" font-size="12" font-weight="700" fill="#1E1E24">${escapeXml(code)}</text>
          <!-- Dimension arrows -->
          <line x1="68" y1="284" x2="240" y2="284" stroke="${INK}" stroke-width="1.8" />
          <line x1="68" y1="278" x2="68" y2="290" stroke="${INK}" stroke-width="1.8" />
          <line x1="240" y1="278" x2="240" y2="290" stroke="${INK}" stroke-width="1.8" />
          <text x="154" y="300" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" fill="${INK}">BOXY FIT · FORM RỘNG 62cm</text>
          <text x="154" y="16" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="#2D5DA1">SKETCH SPEC: ${escapeXml(titleNote)}</text>
        </g>
      `;
    }
    // View 0: Front Concept
    return `
      <g transform="translate(88, 34)">
        <!-- Left & Right Sleeves -->
        <path d="M30 66 L10 188 L54 196 L66 108 Z" fill="${c2}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <path d="M278 66 L298 188 L254 196 L242 108 Z" fill="${c2}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <!-- Cuffs -->
        <path d="M10 188 L54 196 L51 212 L8 204 Z" fill="${c3}" stroke="${INK}" stroke-width="2.8" />
        <path d="M298 188 L254 196 L257 212 L300 204 Z" fill="${c3}" stroke="${INK}" stroke-width="2.8" />
        <!-- Torso -->
        <path d="M96 36 L66 66 L66 254 C112 262, 196 262, 242 254 L242 66 L212 36 Z"
              fill="${c1}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <!-- Collar & Bottom Ribbing -->
        <path d="M96 36 Q154 64 212 36 L196 24 Q154 44 112 24 Z" fill="${c3}" stroke="${INK}" stroke-width="3" />
        <path d="M66 242 C112 250, 196 250, 242 242 L242 258 C196 266, 112 266, 66 258 Z" fill="${c3}" stroke="${INK}" stroke-width="3" />
        <!-- Snap Placket -->
        <line x1="154" y1="56" x2="154" y2="245" stroke="${INK}" stroke-width="3" />
        ${[76, 112, 148, 184, 220].map((y) => `<circle cx="154" cy="${y}" r="5" fill="${c4}" stroke="${INK}" stroke-width="2.2" />`).join('')}
        <!-- Diagonal Pockets -->
        <path d="M84 188 L116 218" stroke="${c2}" stroke-width="6" stroke-linecap="round" />
        <path d="M84 188 L116 218" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" />
        <path d="M224 188 L192 218" stroke="${c2}" stroke-width="6" stroke-linecap="round" />
        <path d="M224 188 L192 218" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" />
        <!-- Chest Patch -->
        <rect x="174" y="88" width="46" height="44" rx="10" transform="rotate(-3 197 110)" fill="${c4}" stroke="${INK}" stroke-width="2.6" />
        <text x="197" y="116" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="14" font-weight="800" fill="${INK}" transform="rotate(-3 197 110)">${escapeXml(code)}</text>
        <!-- Sketchbook Callout -->
        <path d="M226 108 Q286 92 312 68" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3" />
        <rect x="278" y="42" width="96" height="28" rx="8" fill="#FFF3B0" stroke="${INK}" stroke-width="2" transform="rotate(2 326 56)" />
        <text x="326" y="61" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="13" fill="${INK}">Huy hiệu thêu</text>
      </g>
    `;
  }

  function renderTote(pal, code, viewIndex, titleNote) {
    const [c1, c2, c3, c4] = pal;
    if (viewIndex === 1) {
      return `
        <g transform="translate(115, 34)">
          <!-- Inside Organizer View -->
          <path d="M36 92 L214 92 L224 274 C180 282, 70 282, 26 274 Z" fill="${c4}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
          <path d="M72 92 C72 28, 178 28, 178 92" fill="none" stroke="${c1}" stroke-width="14" stroke-linecap="round" />
          <path d="M72 92 C72 28, 178 28, 178 92" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" />
          <!-- Inner Laptop & Bottle Pocket -->
          <rect x="52" y="124" width="146" height="96" rx="8" fill="${c2}" stroke="${INK}" stroke-width="2.6" stroke-dasharray="6 4" />
          <text x="125" y="168" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="16" font-weight="700" fill="${INK}">Ngăn Laptop 15.6"</text>
          <text x="125" y="190" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" fill="${INK}">CANVAS 16OZ</text>
          <circle cx="192" cy="112" r="14" fill="${c3}" stroke="${INK}" stroke-width="2.4" />
          <text x="192" y="116" text-anchor="middle" font-family="'Space Mono', monospace" font-size="10" fill="#FFF">KEY</text>
        </g>
      `;
    }
    if (viewIndex === 2) {
      return `
        <g transform="translate(115, 34)">
          <path d="M36 92 L214 92 L224 274 C180 282, 70 282, 26 274 Z" fill="none" stroke="#2D5DA1" stroke-width="2.8" stroke-dasharray="7 4" />
          <path d="M76 92 C76 26, 174 26, 174 92" fill="none" stroke="#2D5DA1" stroke-width="2.8" stroke-dasharray="5 4" />
          <line x1="26" y1="292" x2="224" y2="292" stroke="${INK}" stroke-width="1.8" />
          <text x="125" y="310" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" fill="${INK}">38cm × 42cm · ĐÁY HỘP 10cm</text>
          <rect x="64" y="138" width="122" height="84" rx="8" fill="${c2}" fill-opacity="0.35" stroke="#2D5DA1" stroke-width="2" />
          <text x="125" y="184" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="18" fill="#1E1E24">${escapeXml(code)}</text>
          <text x="125" y="20" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="#2D5DA1">BLUEPRINT: ${escapeXml(titleNote)}</text>
        </g>
      `;
    }
    // View 0
    return `
      <g transform="translate(115, 30)">
        <!-- Back handle -->
        <path d="M84 96 C84 22, 166 22, 166 96" fill="none" stroke="${c3}" stroke-width="12" stroke-linecap="round" />
        <path d="M84 96 C84 22, 166 22, 166 96" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" />
        <!-- Bag Body -->
        <path d="M36 96 L214 96 L224 274 C180 283, 70 283, 26 274 Z" fill="${c4}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <!-- Gusset Stitch Line -->
        <path d="M38 106 L212 106" stroke="${INK}" stroke-width="2" stroke-dasharray="6 4" />
        <!-- Graphic Print Box -->
        <path d="M56 128 L194 124 L198 238 L52 242 Z" fill="${c1}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" />
        <circle cx="125" cy="176" r="36" fill="${c2}" stroke="${INK}" stroke-width="2.6" />
        <path d="M104 176 L120 192 L148 160" fill="none" stroke="${c3}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        <text x="125" y="228" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="18" font-weight="800" fill="${c4}">${escapeXml(code)} EDITION</text>
        <!-- Enamel Pin Detail -->
        <circle cx="192" cy="116" r="14" fill="${c3}" stroke="${INK}" stroke-width="2.4" />
        <path d="M187 116 L191 120 L198 112" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" />
        <!-- Front handle overlap -->
        <path d="M72 98 C72 28, 178 28, 178 98" fill="none" stroke="${c2}" stroke-width="13" stroke-linecap="round" />
        <path d="M72 98 C72 28, 178 28, 178 98" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" />
      </g>
    `;
  }

  function renderLanyard(pal, code, viewIndex, titleNote) {
    const [c1, c2, c3, c4] = pal;
    if (viewIndex === 1) {
      return `
        <g transform="translate(95, 36)">
          <!-- Zoomed Ribbon Pattern + Metal Clasp -->
          <rect x="44" y="26" width="202" height="58" rx="10" transform="rotate(-4 145 55)" fill="${c1}" stroke="${INK}" stroke-width="3" />
          <text x="145" y="62" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="20" font-weight="800" fill="${c4}" transform="rotate(-4 145 55)">${escapeXml(code)} · CAMPUS PRIDE</text>
          <rect x="44" y="108" width="202" height="58" rx="10" transform="rotate(3 145 137)" fill="${c2}" stroke="${INK}" stroke-width="3" />
          <text x="145" y="143" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="18" font-weight="700" fill="${INK}" transform="rotate(3 145 137)">IN CHUYỂN NHIỆT 2 MẶT</text>
          <!-- Safety Buckle + Hook -->
          <rect x="115" y="196" width="60" height="36" rx="8" fill="${c3}" stroke="${INK}" stroke-width="2.8" />
          <circle cx="145" cy="258" r="20" fill="none" stroke="${INK}" stroke-width="4" />
          <text x="145" y="298" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="${INK}">Móc xoay kim loại nhám + Khóa an toàn</text>
        </g>
      `;
    }
    if (viewIndex === 2) {
      return `
        <g transform="translate(115, 28)">
          <path d="M72 20 L118 190 L132 190 L178 20" fill="none" stroke="#2D5DA1" stroke-width="3" stroke-dasharray="6 4" />
          <rect x="85" y="220" width="80" height="106" rx="10" fill="${c2}" fill-opacity="0.3" stroke="#2D5DA1" stroke-width="2.6" stroke-dasharray="6 4" />
          <text x="125" y="276" text-anchor="middle" font-family="'Space Mono', monospace" font-size="12" fill="#1E1E24">54mm × 86mm</text>
          <text x="125" y="16" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="#2D5DA1">DÂY 20mm · THẺ CỨNG PVC: ${escapeXml(titleNote)}</text>
        </g>
      `;
    }
    return `
      <g transform="translate(120, 22)">
        <!-- Ribbon Strap -->
        <path d="M58 18 L112 184 L128 184 L182 18 L156 12 L120 140 L84 12 Z" fill="${c1}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <!-- Pattern stripes -->
        <path d="M84 62 L98 58 M96 102 L110 98 M142 98 L156 102 M154 58 L168 62" stroke="${c2}" stroke-width="5" stroke-linecap="round" />
        <!-- Metal Clasp -->
        <rect x="108" y="182" width="24" height="24" rx="5" fill="${c3}" stroke="${INK}" stroke-width="2.8" />
        <circle cx="120" cy="214" r="7" fill="${c4}" stroke="${INK}" stroke-width="2.5" />
        <!-- Acrylic / Leather Card Holder -->
        <rect x="70" y="222" width="100" height="108" rx="14" fill="${c2}" stroke="${INK}" stroke-width="3.2" />
        <rect x="82" y="236" width="76" height="82" rx="8" fill="${c4}" stroke="${INK}" stroke-width="2.2" />
        <circle cx="120" cy="264" r="14" fill="${c1}" stroke="${INK}" stroke-width="2.2" />
        <text x="120" y="298" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="13" font-weight="800" fill="${INK}">${escapeXml(code)} ID</text>
        <!-- Callout -->
        <rect x="184" y="148" width="94" height="30" rx="8" fill="#FFF3B0" stroke="${INK}" stroke-width="2" transform="rotate(-3 231 163)" />
        <text x="231" y="168" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="13" fill="${INK}">Thẻ SV + Charm</text>
      </g>
    `;
  }

  function renderMascot(pal, code, viewIndex, titleNote) {
    const [c1, c2, c3, c4] = pal;
    if (viewIndex === 1) {
      // Turnaround & Expressions
      return `
        <g transform="translate(46, 56)">
          <!-- Chibi Pose 1: Happy -->
          <circle cx="96" cy="110" r="56" fill="${c2}" stroke="${INK}" stroke-width="3" />
          <path d="M56 70 L46 32 L82 54 Z" fill="${c1}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" />
          <path d="M136 70 L146 32 L110 54 Z" fill="${c1}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" />
          <path d="M74 102 Q82 92 90 102 M102 102 Q110 92 118 102" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" />
          <path d="M84 122 Q96 138 108 122" fill="${c3}" stroke="${INK}" stroke-width="2.6" />
          <text x="96" y="196" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="15" fill="${INK}">Hào hứng (Cheer)</text>

          <!-- Chibi Pose 2: Deadline Mode -->
          <circle cx="290" cy="110" r="56" fill="${c1}" stroke="${INK}" stroke-width="3" />
          <circle cx="272" cy="104" r="10" fill="#FFF" stroke="${INK}" stroke-width="2.5" />
          <circle cx="308" cy="104" r="10" fill="#FFF" stroke="${INK}" stroke-width="2.5" />
          <circle cx="272" cy="104" r="4" fill="${INK}" />
          <circle cx="308" cy="104" r="4" fill="${INK}" />
          <path d="M274 132 L306 126" stroke="${INK}" stroke-width="3" stroke-linecap="round" />
          <rect x="330" y="64" width="38" height="24" rx="6" fill="${c4}" stroke="${INK}" stroke-width="2.2" />
          <text x="349" y="81" text-anchor="middle" font-family="'Space Mono', monospace" font-size="10" fill="${INK}">100%</text>
          <text x="290" y="196" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="15" fill="${INK}">Chạy Deadline</text>
        </g>
      `;
    }
    if (viewIndex === 2) {
      return `
        <g transform="translate(104, 42)">
          <circle cx="136" cy="112" r="76" fill="none" stroke="#2D5DA1" stroke-width="2.5" stroke-dasharray="6 4" />
          <line x1="60" y1="112" x2="212" y2="112" stroke="#2D5DA1" stroke-width="1.6" stroke-dasharray="4 4" />
          <line x1="136" y1="36" x2="136" y2="188" stroke="#2D5DA1" stroke-width="1.6" stroke-dasharray="4 4" />
          <path d="M88 184 Q136 268 184 184" fill="none" stroke="#2D5DA1" stroke-width="2.5" stroke-dasharray="6 4" />
          <text x="136" y="256" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" fill="${INK}">TỶ LỆ CHIBI 1:1.5 · MASCOT ${escapeXml(code)}</text>
          <text x="136" y="14" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="#2D5DA1">CHARACTER CONSTRUCTION: ${escapeXml(titleNote)}</text>
        </g>
      `;
    }
    return `
      <g transform="translate(106, 26)">
        <!-- Mascot Body & Cape -->
        <path d="M72 190 C60 250, 74 284, 134 284 C194 284, 208 250, 196 190 Z" fill="${c1}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <!-- Belly Patch -->
        <ellipse cx="134" cy="236" rx="34" ry="36" fill="${c4}" stroke="${INK}" stroke-width="2.6" />
        <text x="134" y="242" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="16" font-weight="800" fill="${c3}">${escapeXml(code)}</text>
        <!-- Scarf -->
        <path d="M82 178 Q134 202 186 178 L194 196 Q134 218 74 196 Z" fill="${c3}" stroke="${INK}" stroke-width="2.8" />
        <!-- Ears / Horns -->
        <path d="M74 88 L56 30 L108 62 Z" fill="${c2}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <path d="M194 88 L212 30 L160 62 Z" fill="${c2}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <!-- Head -->
        <ellipse cx="134" cy="116" rx="70" ry="62" fill="${c2}" stroke="${INK}" stroke-width="3.2" />
        <!-- Eyes & Cheeks -->
        <circle cx="106" cy="112" r="10" fill="${INK}" />
        <circle cx="103" cy="108" r="3" fill="#FFF" />
        <circle cx="162" cy="112" r="10" fill="${INK}" />
        <circle cx="159" cy="108" r="3" fill="#FFF" />
        <ellipse cx="88" cy="128" rx="9" ry="5" fill="${c3}" opacity="0.7" />
        <ellipse cx="180" cy="128" rx="9" ry="5" fill="${c3}" opacity="0.7" />
        <path d="M124 128 Q134 140 144 128" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" />
        <!-- Graduation Cap / Gadget -->
        <path d="M96 58 L134 40 L172 58 L134 74 Z" fill="${c1}" stroke="${INK}" stroke-width="2.8" />
        <line x1="172" y1="58" x2="176" y2="84" stroke="${c3}" stroke-width="3" stroke-linecap="round" />
        <!-- Speech Bubble -->
        <rect x="208" y="42" width="110" height="36" rx="12" fill="#FFF3B0" stroke="${INK}" stroke-width="2.4" />
        <text x="263" y="65" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" font-weight="700" fill="${INK}">Go ${escapeXml(code)}!</text>
      </g>
    `;
  }

  function renderPolo(pal, code, viewIndex, titleNote) {
    const [c1, c2, c3, c4] = pal;
    if (viewIndex === 1) {
      return `
        <g transform="translate(96, 36)">
          <path d="M90 36 L198 36 L274 78 L254 148 L220 132 L220 258 L68 258 L68 132 L34 148 L14 78 Z"
                fill="${c4}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
          <path d="M100 94 L188 94 L188 182 L100 182 Z" fill="${c1}" stroke="${INK}" stroke-width="2.8" />
          <text x="144" y="138" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="22" font-weight="800" fill="${c2}">${escapeXml(code)}</text>
          <text x="144" y="162" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="13" fill="${c4}">GRAPHIC IN LỤA LƯNG</text>
        </g>
      `;
    }
    if (viewIndex === 2) {
      return `
        <g transform="translate(96, 36)">
          <path d="M90 36 L198 36 L274 78 L254 148 L220 132 L220 258 L68 258 L68 132 L34 148 L14 78 Z"
                fill="none" stroke="#2D5DA1" stroke-width="2.8" stroke-dasharray="6 4" />
          <text x="144" y="148" text-anchor="middle" font-family="'Space Mono', monospace" font-size="12" fill="${INK}">CÁ SẤU COTTON 260GSM · ${escapeXml(code)}</text>
          <text x="144" y="14" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="#2D5DA1">${escapeXml(titleNote)}</text>
        </g>
      `;
    }
    return `
      <g transform="translate(96, 36)">
        <!-- Shirt Silhouette -->
        <path d="M90 36 L198 36 L274 78 L254 148 L220 132 L220 258 C180 264, 108 264, 68 258 L68 132 L34 148 L14 78 Z"
              fill="${c4}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" />
        <!-- Colorblock Stripes -->
        <path d="M68 198 L220 198 L220 222 L68 222 Z" fill="${c1}" stroke="${INK}" stroke-width="2.5" />
        <!-- Polo Collar -->
        <path d="M96 36 L144 68 L192 36 L176 24 L144 46 L112 24 Z" fill="${c1}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" />
        <rect x="136" y="64" width="16" height="44" rx="4" fill="${c2}" stroke="${INK}" stroke-width="2.2" />
        <circle cx="144" cy="76" r="3" fill="${INK}" />
        <circle cx="144" cy="94" r="3" fill="${INK}" />
        <!-- Sleeve Cuffs -->
        <path d="M14 78 L34 148 L46 142 L28 72 Z" fill="${c3}" stroke="${INK}" stroke-width="2.4" />
        <path d="M274 78 L254 148 L242 142 L260 72 Z" fill="${c3}" stroke="${INK}" stroke-width="2.4" />
        <!-- Pocket Emblem -->
        <rect x="166" y="88" width="38" height="36" rx="6" fill="${c2}" stroke="${INK}" stroke-width="2.4" />
        <text x="185" y="111" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="12" font-weight="800" fill="${INK}">${escapeXml(code)}</text>
      </g>
    `;
  }

  function renderSticker(pal, code, viewIndex, titleNote) {
    const [c1, c2, c3, c4] = pal;
    if (viewIndex === 1) {
      return `
        <g transform="translate(86, 44)">
          <rect x="16" y="16" width="276" height="240" rx="18" fill="${c4}" stroke="${INK}" stroke-width="3" />
          <text x="154" y="54" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="18" fill="${INK}">Gắn trên Laptop & Bình Nước</text>
          <rect x="54" y="76" width="200" height="132" rx="12" fill="#D4D4D8" stroke="${INK}" stroke-width="2.8" />
          <!-- Stickers on laptop lid -->
          <circle cx="110" cy="134" r="30" fill="${c2}" stroke="${INK}" stroke-width="2.4" />
          <text x="110" y="139" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="13" font-weight="800" fill="${INK}">${escapeXml(code)}</text>
          <rect x="152" y="102" width="76" height="34" rx="10" transform="rotate(-6 190 119)" fill="${c3}" stroke="${INK}" stroke-width="2.4" />
          <text x="190" y="124" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="#FFF" transform="rotate(-6 190 119)">DEADLINE</text>
          <rect x="144" y="152" width="84" height="34" rx="10" transform="rotate(4 186 169)" fill="${c1}" stroke="${INK}" stroke-width="2.4" />
          <text x="186" y="174" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="14" fill="#FFF" transform="rotate(4 186 169)">GPA 4.0</text>
        </g>
      `;
    }
    if (viewIndex === 2) {
      return `
        <g transform="translate(90, 44)">
          <rect x="20" y="20" width="260" height="236" rx="16" fill="none" stroke="#2D5DA1" stroke-width="2.5" stroke-dasharray="6 4" />
          <text x="150" y="132" text-anchor="middle" font-family="'Space Mono', monospace" font-size="12" fill="${INK}">DIE-CUT VINYL CHỐNG NƯỚC · KHỔ A5</text>
          <text x="150" y="160" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="15" fill="#2D5DA1">${escapeXml(titleNote)}</text>
        </g>
      `;
    }
    return `
      <g transform="translate(70, 34)">
        <!-- Sticker Sheet -->
        <rect x="22" y="14" width="296" height="262" rx="18" fill="#FFFFFF" stroke="${INK}" stroke-width="3" />
        <text x="170" y="44" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="15" font-weight="800" fill="${INK}">${escapeXml(code)} STICKER PACK · 06 MÓN</text>
        <!-- Sticker 1 -->
        <circle cx="96" cy="110" r="42" fill="${c2}" stroke="${INK}" stroke-width="2.8" />
        <text x="96" y="116" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="17" font-weight="800" fill="${INK}">${escapeXml(code)}</text>
        <!-- Sticker 2 -->
        <rect x="160" y="72" width="126" height="58" rx="16" transform="rotate(-4 223 101)" fill="${c1}" stroke="${INK}" stroke-width="2.8" />
        <text x="223" y="108" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="18" fill="${c4}" transform="rotate(-4 223 101)">CAMPUS VIBES</text>
        <!-- Sticker 3 -->
        <path d="M62 178 L142 172 L152 240 L54 244 Z" fill="${c3}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" />
        <text x="102" y="214" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="15" font-weight="800" fill="#FFF">NO SLEEP</text>
        <!-- Sticker 4 -->
        <ellipse cx="222" cy="206" rx="64" ry="38" transform="rotate(3 222 206)" fill="${c4}" stroke="${INK}" stroke-width="2.8" />
        <text x="222" y="212" text-anchor="middle" font-family="'Patrick Hand', cursive" font-size="16" font-weight="700" fill="${INK}">Canteen &amp; Chill</text>
      </g>
    `;
  }

  function renderMerchIllustration(item, viewIndex = 0) {
    if (item && item.customImageUrl && viewIndex === 0) {
      return `
        <div class="w-full h-full relative bg-[#FDFBF7] flex items-center justify-center overflow-hidden">
          <img src="${escapeXml(item.customImageUrl)}" alt="${escapeXml(item.title)}" class="w-full h-full object-cover" loading="lazy" />
        </div>
      `;
    }

    const pal = safePalette(item && item.palette);
    const code = (item && item.campusShort) || 'UNI';
    const titleNote = (item && item.title) ? item.title.slice(0, 26) : 'Campus Merch';
    const category = (item && item.category) || 'jacket';
    const isBlueprint = viewIndex === 2;

    let inner = '';
    switch (category) {
      case 'tote':
        inner = renderTote(pal, code, viewIndex, titleNote);
        break;
      case 'lanyard':
        inner = renderLanyard(pal, code, viewIndex, titleNote);
        break;
      case 'mascot':
        inner = renderMascot(pal, code, viewIndex, titleNote);
        break;
      case 'polo':
        inner = renderPolo(pal, code, viewIndex, titleNote);
        break;
      case 'sticker':
        inner = renderSticker(pal, code, viewIndex, titleNote);
        break;
      case 'jacket':
      default:
        inner = renderJacket(pal, code, viewIndex, titleNote);
        break;
    }

    const viewTags = ['BẢN PHỐI CHÍNH', 'CHI TIẾT / MẶT SAU', 'PHÁC THẢO SKETCH'];
    const tagText = viewTags[viewIndex] || viewTags[0];

    return `
      <svg viewBox="0 0 480 360" class="w-full h-full block" role="img" aria-label="${escapeXml(item ? item.title : 'Minh họa concept')} - ${tagText}">
        ${renderBackgroundGrid(isBlueprint, pal[1])}
        ${inner}
        <!-- Corner Sketch Tag -->
        <g transform="translate(18, 316)">
          <rect x="0" y="0" width="144" height="26" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="2" />
          <text x="12" y="17" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="${INK}">${tagText}</text>
        </g>
        <!-- Color Swatch Dots in Bottom Right -->
        <g transform="translate(362, 320)">
          ${pal
            .map(
              (color, idx) =>
                `<circle cx="${idx * 24}" cy="10" r="8" fill="${escapeXml(color)}" stroke="${INK}" stroke-width="2" />`
            )
            .join('')}
        </g>
      </svg>
    `;
  }

  function renderCampusEmblem(campus) {
    const c1 = (campus && campus.color) || '#2D5DA1';
    const c2 = (campus && campus.secondaryColor) || '#FFF3B0';
    const shortName = (campus && campus.shortName) || 'ALL';
    return `
      <svg viewBox="0 0 56 56" class="w-11 h-11 shrink-0" aria-hidden="true">
        <path d="M10 10 L46 8 L44 36 Q28 50 12 36 Z" fill="${c2}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" />
        <path d="M15 15 L41 13 L39 34 Q28 44 17 34 Z" fill="${c1}" stroke="${INK}" stroke-width="2" stroke-linejoin="round" />
        <text x="28" y="31" text-anchor="middle" font-family="'Shantell Sans', cursive" font-size="11.5" font-weight="800" fill="#FFFFFF">${escapeXml(shortName.slice(0, 5))}</text>
      </svg>
    `;
  }

  // Hand-drawn AI Prompt Recipes adapted from threerocks/hand-drawn-styles
  const HAND_DRAWN_RECIPES = [
    {
      id: 'marker-sketchbook',
      name: 'Marker Sketchbook & Ink Callouts',
      badge: 'Style #01 · Nét mực + Marker',
      desc: 'Nét bút mực đen hơi run tự nhiên, tô màu marker loang nhẹ trên giấy kem kèm mũi tên chú thích vật liệu.',
      template:
        'Hand-drawn industrial sketch of a {subject} for {campus} university students, expressive black fineliner ink outlines, warm Copic marker color wash in {colors}, stitched seam details, handwritten annotation arrows on warm cream sketchbook paper (#FDFBF7), tactile raw aesthetic, no 3D render.',
    },
    {
      id: 'watercolor-journal',
      name: 'Watercolor Campus Zine',
      badge: 'Style #07 · Màu nước Zine sinh viên',
      desc: 'Phong cách sổ tay ký họa màu nước tươi sáng, phù hợp túi tote, áo polo và phụ kiện mang vibe đời sống sân trường.',
      template:
        'Indie student zine illustration of a {subject} inspired by {campus} campus life, delicate ink pen linework with soft watercolor washes in {colors}, pressed paper grain texture, charming handmade collage framing, clean white border.',
    },
    {
      id: 'sticker-doodle',
      name: 'Die-Cut Sticker Doodle Pack',
      badge: 'Style #12 · Sticker viền dày',
      desc: 'Đường viền ink đậm, màu phẳng nổi bật, viền cắt trắng kiểu sticker dán laptop hoặc huy hiệu thêu nổi.',
      template:
        'Hand-drawn die-cut sticker sheet design featuring {subject} for {campus} students, bold marker outlines, flat vibrant gouache fills in {colors}, playful doodle icons, thick white sticker border on light dot-grid notebook background.',
    },
    {
      id: 'mascot-sheet',
      name: 'Chibi Mascot Character Sheet',
      badge: 'Style #19 · Bảng nhân vật Linh vật',
      desc: 'Hiển thị nhân vật linh vật ở 3 biểu cảm sinh viên (Hào hứng, Cày bài, Tốt nghiệp) bằng nét vẽ tay ngộ nghĩnh.',
      template:
        'Hand-drawn character concept sheet of a cute university mascot ({subject}) representing {campus}, 3 expressive chibi poses (cheering, coding late-night, holding coffee), thick charcoal pencil lines, warm pastel shading in {colors}, sketchbook margin notes.',
    },
  ];

  global.UniVibeIllustrations = {
    renderMerchIllustration,
    renderCampusEmblem,
    HAND_DRAWN_RECIPES,
  };
})(typeof window !== 'undefined' ? window : globalThis);
