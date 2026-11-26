# Design Specification: Portfolio Overhaul (Impeccable + Unslop)

## 1. Design Direction (Unslop 5-Line Anchor)

Derived directly from Dimas Rizki Ardiansyah's actual engineering work (Full-Stack Web, AI/Data Systems, and ESP32/IoT Hardware) and **Impeccable Experience Mode** (let the portfolio work and portrait lead; the interface chrome recedes):

- **Product:** Personal engineering portfolio for Dimas Rizki Ardiansyah (`dimasrizkiportofolio.vercel.app`) showcasing full-stack web applications, AI systems, and IoT hardware projects to recruiters, engineering leads, and collaborators.
- **Character:** Grounded, technical, composed.
- **World:** Dark hardware workbench and editorial monograph — matte obsidian surfaces, fine 1px hairline borders, and warm amber instrument accents.
- **Moments:** (1) The borderless split-center portrait on Home (`foto 1.png`) and borderless side-by-side portrait on `/about` (`foto 2.png`), plus (2) the scroll-scrubbed Image Sequence canvas and real project previews in the Featured Projects slider.
- **Signature:** A single quiet hairline status dot and crisp monospace numeric/date metadata (`tabular-nums`) used consistently across sections — never scattered across pills, badges, or emojis.

---

## 2. Live Audit Baseline (`dimasrizkiportofolio.vercel.app` via Playwright MCP)

Comparison between the legacy design (pre-`1464eeb`), the current v2 draft deployed on `redesign/v2` (`1464eeb`), and the finalized v2.1 target specification:

| Area | Legacy State (Pre-Redesign) | Current Live v2 (`1464eeb`) | Final Target Spec (v2.1) |
| :--- | :--- | :--- | :--- |
| **Navbar** | 8 crowded clusters (`DR` + `👋 Say hi`, 5 numbered links, accent picker, duplicate `Contact`, `Download CV`, `Portfolio`, `ID\|EN`) | Decluttered to 4 center links, `CV / PDF` dropdown, accent dot, `ID\|EN`, `Let's Connect` | Remove `01 //` slash clutter & uppercase tracking; keep 4 clean sentence-case links + `CV / PDF` + accent dot + `ID\|EN` + single `Contact` CTA |
| **Home Hero** | 2-column with `Currently Building` + `Recommendations` cards + 4 buttons (`View Projects`, `Download CV`, `🐶 PET ME`, `Ask me anything`) | 3-column split-center (`foto 1.png`), cards removed, but still has radial glow blob, `animate-ping`, unverified `3+/15+/20+` stats, and 3 CTAs | Clean 3-column split-center (`foto 1.png` via Sanity CMS), **zero glow blobs**, **zero looping ping**, **max 2 CTAs** (1 primary left, 1 secondary right; drop duplicate `Download CV`), remove unverified hardcoded stats |
| **Home Sections** | Hero → Featured Projects + 3-col Project Grid → Experience → Certificates → Bottom CTA Banner | Hero → Procedural Sequence Canvas (1980px) → Featured Projects (slider only) → Experience (`#111622`) → Certificates (`#111622`) | Real WebP Image Sequence (or Sanity/CDN manifest) → Featured Projects → Experience (elevated `#111622`) → Certificates (distinct surface step `#0e121b` or hairline separation) |
| **About Hero (`/about`)** | Centered small circular avatar card + emoji pills (`📍`, `💼`, `🚀`) + separate `My Story` section | 2-column borderless side-by-side (`foto 2.png`) + merged `My Story`, but still has glow blob, hardcoded local asset, and non-localized English story | 2-column borderless side-by-side (`foto 2.png` via Sanity CMS), zero glow blob, bilingual `en`/`id` story copy, zero emojis |
| **Vertical Rhythm** | `py-20 lg:py-32` across sections | `py-8 sm:py-10 lg:py-14` via `<Section>`, except `EducationSection` still uses raw `py-16` | Unified compact rhythm (`py-8 sm:py-10 lg:py-12`) across **all** sections including `EducationSection` |
| **Smart Scroll Snap** | None | `y proximity` + `ResizeObserver` (`1.08×vh`), missing `scroll-padding-top` (sticky 65px header overlaps snapped tops) | Add `scroll-padding-top: 4rem` (64px) on `html`, fix `EducationSection` to use `<Section>`, keep `data-snap="free"` on long lists (`TechStack`, `ImageSequenceCanvas`) |
| **CMS Content Note** | Category typo `"Leaguage Programming"` on `/en/about` | Still `"Leaguage Programming"` in Sanity CMS | Fix category title in Sanity Studio to `"Programming Languages"` |

---

## 3. Color System & Surface Contrast Tokens

Single tinted graphite-obsidian neutral ramp (`#090b0e` base) with clear surface steps so card sections below the scroll sequence visually separate from the canvas without neon borders or colored shadows.

### 3.1 Canvas, Surface Elevation & Text Roles

| Token | Dark Mode (Primary) | Light Mode | Role |
| :--- | :--- | :--- | :--- |
| `--background` (`--bg-canvas`) | `#090b0e` | `#f7fafc` | Primary page canvas and Image Sequence viewport backdrop |
| `--bg-surface-elevated` | `#111622` | `#edf2f7` | Contrasting surface band for `Experience` section below sequence |
| `--bg-surface-subtle` | `#0e121b` | `#f1f5f9` | Secondary alternating surface band for `Featured Certificates` so adjacent bands stay distinct |
| `--card` (`--bg-card`) | `#151b26` | `#ffffff` | Card interiors, popovers, dropdown menus |
| `--bg-card-hover` | `#1c2433` | `#e2e8f0` | Subtle hover step (no scale jump, no colored glow) |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | `rgba(15, 23, 42, 0.08)` | Quiet 1px hairlines for cards and dividers |
| `--border-contrast` | `rgba(255, 255, 255, 0.14)` | `rgba(15, 23, 42, 0.14)` | Top divider hairline between canvas and elevated surface bands |
| `--text-primary` | `#f8fafc` | `#0f172a` | Headings, active navigation, primary labels |
| `--text-secondary` | `#94a3b8` | `#475569` | Body paragraphs, descriptions, secondary links |
| `--text-muted` | `#64748b` | `#64748b` | Dates, counters, technical metadata |

### 3.2 Dynamic Accent Governance

- Retain existing `AccentProvider` 7-palette selector (default Amber `#ffd460` on dark, `#090b0e` dark text on accent buttons for >= 4.5:1 WCAG AA contrast).
- **Unslop Restraint:** Accent is restricted to active nav state, primary CTA, active slider indicator, and focus rings.
- **Explicit Bans:**
  - Zero radial color washes / `blur-3xl` glow blobs behind hero or about portraits.
  - Zero gradient text, hue-to-hue surface gradients, or colored drop shadows.
  - Zero emojis in UI chrome (replace any remaining decorative emoji with 16px Lucide 1.5-stroke line icons inheriting text color).

---

## 4. Typography & Micro-Hierarchy

- **Display / Headings:** `Space Grotesk` (weights `500`, `600`) — tight tracking (`-0.025em`) on display headings only.
- **UI & Body Copy:** `Geist Sans` (weights `400`, `500`) — `line-height: 1.55`.
- **Technical Metadata / Figures:** `JetBrains Mono` / `ui-monospace` (weight `400`, `font-variant-numeric: tabular-nums`) — retire `Silkscreen` pixel font from body/navbar chrome to preserve legibility at 12px–14px.
- **Case & Tracking Rules (Unslop):**
  - Prefer sentence case for navigation links, buttons, and section labels (`About`, `Projects`, `Experience`, `Certificates`, `Selected work`, `View projects`).
  - Avoid wide-tracked all-caps labels (`uppercase tracking-widest`) and decorative `01 //` or `[ONLINE // AVAILABLE]` bracket clichés.
  - Zero negative letter-spacing on text smaller than `20px`.
  - No trailing periods on headlines, subheads, buttons, or labels; keep periods only on multi-sentence body paragraphs.

### Calibrated Scale

| Role | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- |
| Hero Name (`h1`) | `clamp(2.25rem, 4.5vw, 3.75rem)` | `600` | `-0.03em` |
| Section Heading (`h2`) | `clamp(1.5rem, 3vw, 2.25rem)` | `600` | `-0.02em` |
| Card Title (`h3`) | `1.125rem` – `1.25rem` | `500` | `-0.01em` |
| Body Copy | `0.9375rem` – `1rem` | `400` | `0` |
| Metadata / Mono | `0.75rem` – `0.8125rem` | `400` | `0.01em` |

---

## 5. Compact Vertical Rhythm (4px Grid)

Every spacing token sits on a 4px grid and trims vertical dead space by ~55% compared to legacy (`py-20 lg:py-32`):

- **Default Section Padding (`<Section>`):** `py-8 sm:py-10 lg:py-12` (`32px` / `40px` / `48px`).
- **Hero Home Padding:** `pt-4 pb-0 lg:pt-6 lg:pb-0`, grounded flush to the bottom edge of the viewport (`min-h-[calc(100svh-4rem)]`).
- **About Hero Padding:** `pt-6 pb-8 lg:py-10`.
- **Grid Gaps:** `gap-6 lg:gap-8` (compact, aligned, zero arbitrary pixel offsets).
- **Container:** `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Nested Border Radii:** Controls `8px` (`rounded-lg`), cards `12px` (`rounded-xl`), modals/panels `16px` (`rounded-2xl`). Avoid forcing pill shapes (`rounded-full`) on every rectangular container.

---

## 6. Motion Restraint & Purposeful Interaction

- **One easing curve:** `cubic-bezier(0.22, 1, 0.36, 1)` (`150ms` feedback, `350ms` entrance).
- **Explicit Transitions Only:** Animate `opacity`, `transform`, `color`, `background-color`, and `border-color`. Never use `transition-all` or animate `width`/`height`/`margin`.
- **Remove Looping Slop:** Delete `animate-ping` on static availability dots and remove unused looping keyframes (`sayhiWave`, `waterSlosh`, `avatarBounce`) from `globals.css`.
- **Purposeful Motion Only:**
  1. Scroll-driven Image Sequence canvas scrubbing (deterministic 1:1 with scroll progress, falls back to static frame under `prefers-reduced-motion`).
  2. Smart hybrid scroll-snapping (`y proximity` with automatic overflow opt-out).
  3. Subtle active-nav indicator and project/experience slide transitions.
