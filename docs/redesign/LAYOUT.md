# Layout Specification: Decluttered Navbar, Split-Center Home & Borderless About

## 1. Global Navigation Bar (`#navbar`) Decluttering

### 1.1 Live Audit Problem Statement
Before redesign, `#navbar` rendered 8 competing horizontal groups on a single row (`DR` coin logo + `👋 Say hi` pill, 5 numbered links `01 // About`..`05 // Contact`, accent picker, duplicate `Contact` button, `Download CV`, `Portfolio` PDF button, and `ID | EN` switcher), causing visual crowding and wrapping risk on 1024px–1280px laptops.

### 1.2 Final Clean Navbar Wireframe (64px Sticky Header)

```
+---------------------------------------------------------------------------------------------------+
|  [LEFT: BRAND]              [CENTER: 4 PRIMARY LINKS]                [RIGHT: UTILITIES + 1 CTA]   |
|  (DR Coin Logo)       About   Projects   Experience   Certificates   [Documents v] [o] [ID|EN] [Contact] |
+---------------------------------------------------------------------------------------------------+
```

#### Zone Responsibilities & Exact Element Budget
1. **Left Zone — Brand Anchor (1 item):**
   - `CoinLogo` (`DR` monogram / avatar flip, `36px × 36px`) linking to `/[locale]`.
   - **Removed:** `👋 Say hi` pill badge and any emoji status tag.
2. **Center Zone — Primary Navigation (4 items):**
   - `About` (`/about`), `Projects` (`/projects`), `Experience` (`/experience`), `Certificates` (`/certificates`).
   - **Removed:** `05 // Contact` link (eliminates duplication with the right-hand primary CTA) and `01 //` decorative numbering prefixes.
   - Sentence-case typography (`text-sm font-medium`), active indicator uses a quiet surface step (`bg-card border border-border-subtle`).
3. **Right Zone — Consolidated Utilities & Single CTA (4 compact controls):**
   - **Documents Dropdown (`CV / PDF`):** Consolidates `Download CV` (external Sanity PDF) and `Portfolio PDF` (generated deck API) into a single `32px`-tall popover button with keyboard Escape/outside-click handling.
   - **Accent Picker:** Single `32px × 32px` circular swatch trigger opening the 7-color popover.
   - **Language Switcher:** Minimal segmented toggle `ID | EN` (`height: 32px`).
   - **Primary CTA:** Single high-contrast `Contact` button linking to `/[locale]/contact` (`rounded-lg` matching control radius, no hover scale jump).
4. **Responsive Behavior:**
   - **Desktop (`>= 1024px`):** Single horizontal row, `h-16` (`64px`), zero wrapping verified at `1024px`, `1280px`, and `1440px`.
   - **Mobile & Tablet (`< 1024px`):** `CoinLogo` on left; `AccentPicker` + `MobileNav` hamburger button on right. Drawer holds all 5 routes (including Contact), `Download CV`, `Portfolio PDF`, and `ID | EN`.

---

## 2. Home Page (`/[locale]`) Layout Architecture

```
+---------------------------------------------------------------------------------------------------+
| [NAVBAR] Sticky h-16 (64px), scroll-padding-top: 64px                                             |
+---------------------------------------------------------------------------------------------------+
| [SECTION 1: HERO — 3-COLUMN SPLIT-CENTER] (min-h: calc(100svh - 64px), snap-start)                |
|  LEFT FLANK (1fr)                CENTERPIECE (minmax(320px, 480px))     RIGHT FLANK (1fr)         |
|  - Subtle status dot + text      - Borderless portrait cutout           - Short narrative bio     |
|  - H1: Dimas Rizki Ardiansyah      (`foto 1.png` via Sanity CMS)        - Secondary CTA:          |
|  - Specialization rotator        - Green suit, black tie, pointing        [Let's Connect]         |
|  - Primary CTA: [View Projects]  - Flush to bottom edge, subtle fade    (No 3rd CTA, no cards)    |
+---------------------------------------------------------------------------------------------------+
| [SECTION 2: IMAGE SEQUENCE SCROLL ANIMATION] (h-[200vh..240vh], data-snap="free")                 |
|  - Sticky 100svh viewport canvas scrubbing WebP frame sequence [0..N-1] on scroll progress        |
|  - Background: --bg-canvas (#090b0e)                                                              |
+---------------------------------------------------------------------------------------------------+
| [SECTION 3: FEATURED PROJECTS] (py-8 sm:py-10 lg:py-12, snap-start)                               |
|  - SectionHeader + "View all" link                                                                |
|  - Single Featured ProjectSlider carousel (PRUNED: 3-col ProjectGrid + filter tabs removed)       |
|  - Background: --bg-canvas (#090b0e)                                                              |
+---------------------------------------------------------------------------------------------------+
| [SECTION 4: EXPERIENCE PREVIEW] (py-8 sm:py-10 lg:py-12, snap-start)                              |
|  - Elevated Surface Band: bg-[var(--bg-surface-elevated)] (#111622) + top border-contrast         |
|  - Interactive Experience slider card with expandable details                                     |
+---------------------------------------------------------------------------------------------------+
| [SECTION 5: FEATURED CERTIFICATES] (py-8 sm:py-10 lg:py-12, snap-start if <= 1.08*vh)             |
|  - Alternating Subtle Surface Band: bg-[var(--bg-surface-subtle)] (#0e121b) + top border-subtle   |
|  - 3-column featured certificate cards with PDF verification links                                |
+---------------------------------------------------------------------------------------------------+
| * PRUNED: Bottom CTA Banner ("Let's build something together.") REMOVED                           |
+---------------------------------------------------------------------------------------------------+
| [FOOTER] Compact single-band footer                                                               |
+---------------------------------------------------------------------------------------------------+
```

### 2.1 Hero Home — 3-Column Split-Center CSS Grid & Breakpoints

Note on portrait asset geometry: `docs/Foto Orang/foto 1.png` has raw dimensions `666×375` (subject bounding box `341×373`, near-square `0.91:1` after transparent margin crop). The image container must use intrinsic `width={666} height={375}` (or Sanity cropped dimensions once uploaded) with `object-contain object-bottom` — never hardcoded mismatched `920×1150` props.

```css
/* Desktop (>= 1024px): Balanced 3-column split-center */
.hero-split-center {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 460px) minmax(0, 1fr);
  align-items: end;
  gap: 2rem; /* 32px */
  min-height: calc(100svh - 4rem);
  padding-top: 1.5rem;
}

.hero-flank-left,
.hero-flank-right {
  align-self: center;
  padding-bottom: 3rem;
}

.hero-centerpiece {
  position: relative;
  align-self: end;
  justify-self: center;
  width: 100%;
  max-width: 460px;
  /* Soft edge dissolve at waist/bottom only — NO radial color glow blob behind subject */
  mask-image: linear-gradient(to bottom, #000 84%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, #000 84%, transparent 100%);
}

/* Tablet (768px – 1023px): 2-column flanking above centered portrait */
@media (max-width: 1023px) {
  .hero-split-center {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 1.5rem;
    min-height: auto;
  }

  .hero-flank-left { grid-column: 1; padding-bottom: 0; }
  .hero-flank-right { grid-column: 2; padding-bottom: 0; }
  .hero-centerpiece {
    grid-column: 1 / -1;
    max-width: 380px;
  }
}

/* Mobile (< 768px): Single column stack in visual-first reading order */
@media (max-width: 767px) {
  .hero-split-center {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    text-align: left;
  }

  .hero-centerpiece {
    order: 1;
    max-width: 300px;
  }
  .hero-flank-left { order: 2; }
  .hero-flank-right { order: 3; padding-bottom: 1.5rem; }
}
```

### 2.2 Hero Home Element Pruning Checklist
- **Removed:** `BuildingCard` ("Currently Building / Live") from right column.
- **Removed:** `TestimonialSlider` ("Recommendations / Social Proof") from right column.
- **Removed:** Secondary `Download CV` button from hero bottom row (CV download lives in Navbar `CV / PDF` dropdown; Hero keeps strictly 1 primary CTA `View Projects` + 1 secondary CTA `Let's Connect`).
- **Removed:** Playful widgets (`DogBuddy`, `AiModal`, `TypewriterGreeting`) and unverified hardcoded `3+ / 15+ / 20+` stat blocks.
- **Removed:** Radial accent glow blob (`blur-3xl`) behind portrait and looping `animate-ping` on status dot.

---

## 3. About Page (`/[locale]/about`) Layout Architecture

```
+---------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                          |
+---------------------------------------------------------------------------------------------------+
| [SECTION 1: ABOUT HERO + STORY — 2-COLUMN BORDERLESS SIDE-BY-SIDE] (snap-start if <= 1.08*vh)     |
|  LEFT COLUMN (minmax(280px, 380px)):         RIGHT COLUMN (minmax(0, 1fr)):                       |
|  - Borderless cutout portrait                - Eyebrow: About me                                  |
|    (`foto 2.png` via Sanity CMS)             - H1: Dimas Rizki Ardiansyah                         |
|  - Black Teknik Informatika shirt            - Academic subtitle (localized en/id)                |
|  - Zero card box, zero border, zero glow     - 2 Actions: [Download CV] [Let's Connect]           |
|  - Bottom alpha mask fade into canvas        - Integrated "My Story" paragraphs (localized en/id) |
|                                                with interactive keyword modal pills               |
+---------------------------------------------------------------------------------------------------+
| [SECTION 2: TECH STACK ("The technologies I use every day")] (data-snap="free")                   |
|  - Long multi-category grid (~1800px+ tall) -> snapping strictly disabled (free-scroll)           |
+---------------------------------------------------------------------------------------------------+
| [SECTION 3: CORE COMPETENCIES / SKILLS] (py-8 sm:py-10 lg:py-12, snap-start)                      |
|  - Elevated surface contrast band (#111622)                                                       |
+---------------------------------------------------------------------------------------------------+
| [SECTION 4: EDUCATION] (Converted to <Section>, py-8 sm:py-10 lg:py-12, snap-start)               |
|  - Compact padding aligned with global vertical rhythm (replaces raw py-16)                       |
+---------------------------------------------------------------------------------------------------+
| [FOOTER]                                                                                          |
+---------------------------------------------------------------------------------------------------+
```

### 3.1 About Hero — 2-Column Borderless CSS Grid & Breakpoints

Note on portrait asset geometry: `docs/Foto Orang/foto 2.png` has raw dimensions `375×666` (vertical portrait, subject bounding box `279×552`). Use `width={375} height={666}` (or Sanity asset dimensions) with `object-contain object-bottom` and sticky alignment on tall desktop narratives.

```css
/* Desktop (>= 1024px): 2-column borderless side-by-side */
.about-hero-grid {
  display: grid;
  grid-template-columns: minmax(280px, 380px) minmax(0, 1fr);
  align-items: center;
  gap: 3rem; /* 48px */
}

.about-portrait-cutout {
  position: relative;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  border: 0;
  background: transparent;
  mask-image: linear-gradient(to bottom, #000 84%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, #000 84%, transparent 100%);
}

/* Tablet & Mobile (< 1024px): Vertical stack, left-aligned readable story */
@media (max-width: 1023px) {
  .about-hero-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-portrait-cutout {
    max-width: 260px;
  }
}
```

### 3.2 About Page Cleanup Checklist
- **Removed:** Small circular framed avatar (`rounded-full border-4`) and emoji quick-info pills (`📍 Indonesia`, `💼 Open to Work`, `🚀 Fullstack Engineer`).
- **Removed:** Separate `<AboutStory />` section gap (narrative merged cleanly into right column of `<AboutHero />`).
- **Fixed:** Localize academic subtitle and `My Story` paragraphs using `content.storyParagraphs` / i18n dictionary so `/id/about` does not render hardcoded English paragraphs.
- **Fixed:** Wrap `EducationSection` in `<Section>` instead of raw `<section className="py-16">` so it inherits compact vertical rhythm and smart snap observation.

---

## 4. Subpages Impact Boundary (What Is NOT Changed)

- `/[locale]/projects`: Retains `ProjectsList` + `ProjectGrid` + category filter tabs (grid removal applies to **Home** only).
- `/[locale]/certificates`: Full certificate list remains free-scrolling (`data-snap="free"` or auto-detected `> 1.08×vh`).
- `/[locale]/experience`: Full experience timeline remains free-scrolling (`~2184px` tall on live site); confirm whether bottom `<CTA />` on `/experience` stays or is pruned to match Home (default: keep subpage scope minimal unless requested).
- `/[locale]/contact`: Preserves existing contact form, info, and Spotify widget.
