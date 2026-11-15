# Design System: UniVibe — Hand-Drawn Campus Merch & Mascot Gallery

> **Source of Truth** synthesized from `ui-ux-pro-max` (*Sketch Hand-Drawn* #84 + *Anti-Polish / Raw Aesthetic* #59), `uupm.cc/demo/nft-art-gallery` (*Galerie* curated exhibition architecture), and `threerocks/hand-drawn-styles` illustration prompt recipes.

---

## 1. Visual Direction & Layout Architecture

- **Product Identity:** Phòng trưng bày số (*Pure Gallery & Showcase*) dành riêng cho văn hóa và vật phẩm sinh viên các trường đại học Việt Nam (áo khoác, áo polo/thun, túi tote, dây đeo thẻ, linh vật mascot, sticker).
- **Exhibition Structure (adapted from Galerie / `nft-art-gallery`):**
  1. **Curated Header:** Brand mark + navigation (`Khám phá`, `Không gian Trường`, `Bảng Vàng`, `Tác giả`), Campus Hub selector, Saved Bookmarks counter, Hand-Drawn Prompt Studio helper, and `+ Đăng Concept` CTA.
  2. **Hero Exhibition Spotlight:** Split exhibition layout featuring platform vision & live metrics on the left, and a hand-taped, pushpinned Featured Concept frame with live 3-criteria bars on the right (transforms into a dedicated **Campus Hub Banner** when a specific university is selected).
  3. **Multi-Campus Hubs Strip:** Interactive sketchbook cards switching between **Khám phá Chung (Inter-Uni)** and **6 Campus Hubs** (HCMUT, UEH, UAH, FPTU, HCMUS, HCMUSSH).
  4. **Filterable Concept Gallery Grid:** Category pills, search bar, multi-criteria sort, and tactile rotated cards (`-1deg` / `+1deg`) with masking tape, palette dots, 3-criteria mini-bars, composite score, and bookmark toggles.
  5. **Evergreen Leaderboard (`Bảng Vàng UniVibe`):** Timeframe tabs (*Tuần*, *Tháng*, *Năm*) across *Top Tác Phẩm* (Podium + Ranked List) and *Top Tác Giả*.
  6. **Curated Creators & Collaboration Bridge (`Hồ sơ Tác giả`):** Student designer cards opening full Portfolio modals with direct external contact links (Email, Facebook, Instagram, Behance) for real-world production outreach.

---

## 2. Color Tokens (Warm Sketchbook & Marker Ink)

| Token | Hex | Role |
|---|---|---|
| `--bg-paper` | `#FDFBF7` | Warm sketchbook paper canvas with subtle 24px dot-grid |
| `--bg-paper-alt` | `#F4EFE6` | Secondary aged paper panels & inset well backgrounds |
| `--surface-card` | `#FFFFFF` | Framed exhibition cards, modals, and critique panels |
| `--ink` | `#1E1E24` | Charcoal marker ink for all borders (`2.5px–3px`), headings, and hard shadows |
| `--ink-muted` | `#52525B` | Secondary pencil copy (meets WCAG AA >= 4.5:1 on `#FDFBF7` & `#FFFFFF`) |
| `--accent-red` | `#FF4D4D` | Red felt-tip marker accent, primary highlights, badges |
| `--accent-blue` | `#2D5DA1` | Blue ballpoint ink for focus rings, secondary actions, and school identity highlights |
| `--postit-yellow` | `#FFF3B0` | Post-it note highlight for primary CTAs, podium badges, and pinned callouts |
| `--highlighter-mint` | `#B8F2E6` | Mint marker wash for verified `.edu.vn` badges & practicality tags |
| `--kraft` | `#E6CCB2` | Kraft paper / masking tape accents |

---

## 3. Typography Scale (Vietnamese-Safe Hand-Drawn Stack)

- **Display / Headings:** `'Shantell Sans', 'Patrick Hand', cursive` — expressive felt-tip marker feel with full Vietnamese diacritic support.
- **Handwritten Notes & Labels:** `'Patrick Hand', cursive` — legible notebook captioning for callouts, quotes (*The Vibe Story*), and tape notes.
- **UI Body & Critique Text:** `'Be Vietnam Pro', sans-serif` — crisp Vietnamese readability at `15px–16px` (`line-height: 1.55`).
- **Scores, Hex Codes & Stats:** `'Space Mono', monospace` — tabular-nums alignment for 3-criteria ratings (`4.8 / 5.0`), vote counts, and color hex codes.

---

## 4. Tactile Hand-Drawn Surface Rules

- **Wobbly Borders:** Asymmetric multi-radii CSS rules:
  - `.sketch-box`: `border: 2.5px solid var(--ink); border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;`
  - `.sketch-card`: `border: 2.5px solid var(--ink); border-radius: 18px 220px 15px 240px / 230px 15px 210px 18px;` (or crisp notebook card `14px 20px 16px 18px` with `box-shadow: 4px 4px 0px var(--ink)`).
- **Hard Offset Shadows:** Never use blurry SaaS shadows. Always use solid ink offset shadows (`4px 4px 0px #1E1E24`, `6px 6px 0px #1E1E24` on hover).
- **Button Press Physics:** On `:hover`, button shifts `(-1px, -1px)` with `5px 5px 0px` shadow; on `:active`, button shifts `(+3px, +3px)` to press directly into its offset shadow (`1px 1px 0px`).
- **Organic Rotation & Straightening:** Gallery cards alternate subtle tilt (`-0.8deg` / `+0.8deg`) and straighten smoothly (`0deg`) on hover/focus.
- **Stationery Accents:** Semi-transparent masking tape (`.washi-tape`), SVG pushpins, and hand-drawn squiggle underlines.

---

## 5. Pre-Delivery Accessibility & UX Checklist

- [x] **No emoji as UI icons:** All icons rendered via clean inline SVG (`stroke-width: 2.2`, `stroke-linecap: round`, `stroke-linejoin: round`).
- [x] **Touch targets >= 44x44px:** All buttons, star rating inputs, campus pills, and filter controls meet comfortable hit targets with >= 8px gap.
- [x] **Contrast >= 4.5:1:** Charcoal `#1E1E24` and `#52525B` against `#FDFBF7` / `#FFFFFF` / `#FFF3B0`.
- [x] **Keyboard navigation & focus states:** Clear `3px solid #2D5DA1` focus-visible rings + `ESC` closes active modals/drawers.
- [x] **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables tilt/float transitions and keyframe motion.
- [x] **Responsive breakpoints:** Tested layout behavior across `375px` (mobile), `768px` (tablet), `1024px` (laptop), and `1440px` (desktop).
