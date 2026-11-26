# Portfolio Visual & Interaction Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merombak total tata letak visual, hierarki antarmuka, dan sistem interaksi website portofolio pribadi (`dimasrizkiportofolio.vercel.app`) menjadi desain compact neo-brutalist dengan komposisi split-center hero, borderless about hero, decluttered navbar, surface contrast differentiation, image sequence scroll animation, dan smart scroll-snapping.

**Architecture:** Aplikasi menggunakan Next.js 16 App Router dengan React 19 dan Tailwind CSS v4. Animasi frame sequence berbasis scroll ditenagai oleh HTML5 Canvas dengan offscreen `ImageBitmap` decoding dan `requestAnimationFrame` render loop. Mekanik scroll snapping menerapkan arsitektur hybrid (`scroll-snap-type: y proximity` dikombinasikan dengan React hook `useSmartScrollSnap` berbasis `ResizeObserver` yang secara dinamis mematikan snapping pada section dengan tinggi `> 100vh`).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion v12, HTML5 Canvas, Sanity CMS v5, Playwright MCP.

**Spec:** `docs/redesign/DESIGN.md`, `docs/redesign/LAYOUT.md`, `docs/redesign/ARCHITECTURE.md`.

---

## Global Constraints
- Preserve full bilingual compatibility (`en` and `id`) in `src/i18n/messages/en.json` and `src/i18n/messages/id.json`.
- Zero broken links and zero regression on existing Sanity CMS data queries.
- Zero horizontal overflow (`overflow-x: hidden`) across all screen widths from 360px to 2560px.
- Accessibility compliance: proper alt text, ARIA attributes, semantic HTML tags (`<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`), and support for `prefers-reduced-motion`.
- Maintain strict typing with no TypeScript errors (`pnpm lint` and `tsc --noEmit` must pass cleanly).

---

## Review Focus
1. **Section Heights > 100vh (Scroll Trapping)**: Long lists (such as the 30+ items in Tech Stack on `/about`) must never force-snap or prevent smooth scrolling through the middle items. Test: Verify that scrolling through `/about` tech stack does not bounce back to section top.
2. **Navbar Layout on Narrow Desktop Viewports (1024px - 1280px)**: The decluttered navbar must never wrap items into two lines or truncate CTA buttons. Test: Verify layout at 1024px, 1280px, and 1440px with Playwright.
3. **Hero Image Aspect Ratio & Cutout Grounding**: The center cutout (`foto 1.png`) on desktop must be crisp, vertically grounded, and not obstruct left/right flanking typography on resizing. Test: Verify responsive rendering from mobile (390px) up to 4K.
4. **Canvas Image Sequence Memory Footprint**: Frame preloading must not cause memory leaks or UI frame drops during fast scrolling. Test: Frame rendering must use `createImageBitmap` and `requestAnimationFrame`.
5. **Surface Contrast Visibility in Dark Mode**: Elevated sections (`Experience` & `Certificates`) must have clear visual distinction (`#111622` vs `#090b0e`) without jarring border artifacts. Test: Verify visual hierarchy and contrast ratios under dark theme.

---

## Tasks

### Task 1: Spacing System & Design Tokens Update
- [ ] Update `src/components/layout/section.tsx`:
  - Change default vertical padding from `py-20 lg:py-32` to `py-10 lg:py-14` (mobile: `py-8`).
  - Add optional `variant?: "default" | "elevated"` prop to support contrasting background surfaces.
- [ ] Update `src/app/globals.css`:
  - Register `--bg-surface-elevated: #111622;` and `--border-contrast: rgba(255, 255, 255, 0.16);`.
  - Add utility classes: `.bg-surface-elevated { background-color: var(--bg-surface-elevated); }` and `.border-contrast { border-color: var(--border-contrast); }`.
  - Add scroll-snap utility classes: `.snap-proximity-y { scroll-snap-type: y proximity; }`, `.snap-section { scroll-snap-align: start; scroll-snap-stop: normal; }`, and `.snap-none { scroll-snap-align: none; }`.
- [ ] Verification: Run `pnpm lint` and inspect that tokens resolve correctly.

### Task 2: Navigation Bar (`#navbar`) Decluttering
- [ ] Modify `src/components/layout/coin-logo.tsx`:
  - Remove the separate "👋 Say hi" badge pill.
  - Keep the interactive 3D coin flip avatar lockup with an unobtrusive `Available` pulse dot indicator.
- [ ] Update `src/constants/navigation.ts` & `src/components/layout/navbar.tsx`:
  - Streamline desktop center links to 4 core sections: `About`, `Projects`, `Experience`, `Certificates` (remove `05 // Contact` from center list).
  - Remove the duplicate Contact button from the right-hand utility group.
  - Consolidate "Download CV" and "Portfolio PDF" into a compact split pill or dropdown component (`<DossierDownloadDropdown />`).
  - Compact `AccentPicker` trigger: single circular icon button with subtle border showing active accent color.
  - Style primary CTA button: prominent `Get in Touch` / `Contact` button linking to `/contact`.
- [ ] Verify responsive behavior on mobile and tablet (`MobileNav`).
- [ ] Verification: Check layout at 1024px, 1280px, and 1440px using Playwright.

### Task 3: Home Hero Section Overhaul (3-Column Split-Center)
- [ ] Place asset `docs/Foto Orang/foto 1.png` into `public/assets/dimas-pointing.png` (or configure for Sanity upload).
- [ ] Refactor `src/components/sections/hero/index.tsx`:
  - Remove imports and rendering of `BuildingCard` and `TestimonialSlider`.
  - Update grid structure to a 3-column layout:
    ```tsx
    <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">{/* Left Flank */}</div>
      <div className="lg:col-span-4 flex justify-center">{/* Centerpiece */}</div>
      <div className="lg:col-span-4">{/* Right Flank */}</div>
    </div>
    ```
- [ ] Update `src/components/sections/hero/hero-content.tsx`:
  - **Left Flank**: System status badge (`[ONLINE // AVAILABLE]`), Greeting & Large Heading ("Dimas Rizki Ardiansyah"), Specialization tagline, Primary action button ("View Projects" / "Explore Work").
  - **Centerpiece**: High-res cutout image (`dimas-pointing.png`) borderless, with smooth bottom grounding and subtle soft drop shadow.
  - **Right Flank**: Bio summary paragraph, technical manifesto, micro stats chips, and secondary action ("Get in Touch").
  - Clean up dead widget triggers (remove redundant action buttons).
- [ ] Add responsive styles for mobile (stacked column with photo centered) and tablet (2x2 balanced grid).
- [ ] Verification: Test rendering and responsive reflow with Playwright at 390px, 768px, and 1440px.

### Task 4: Main Page Pruning & Surface Contrast Differentiation
- [ ] Refactor `src/components/sections/projects/index.tsx`:
  - Remove `import { ProjectGrid } from "./project-grid";` and remove `<ProjectGrid projects={projects} />`.
  - Retain only `ProjectSlider` with full featured project highlights and tech stack tags.
- [ ] Refactor `src/app/(site)/[locale]/page.tsx`:
  - Remove `import { CTA } from "@/components/sections/cta";` and remove `<CTA ... />` from the page bottom.
- [ ] Update `src/components/sections/experience/index.tsx` & `src/components/sections/certificates/index.tsx`:
  - Apply `variant="elevated"` or `className="bg-[#111622] border-t border-white/10"` to both sections.
  - Ensure clear visual contrast against the obsidian void canvas (`#090b0e`).
- [ ] Verification: Verify that the 3-column project grid is gone, the bottom CTA banner is gone, and the Experience/Certificates sections have elevated dark surface contrast.

### Task 5: Image Sequence Scroll Animation Component
- [ ] Create `src/components/motion/image-sequence-canvas.tsx`:
  - Props: `totalFrames: number`, `frameUrlTemplate: (index: number) => string`, `heightVh?: number`.
  - HTML5 `<canvas>` ref with `requestAnimationFrame` render loop.
  - Use `createImageBitmap` for decoding on background threads without main thread lag.
  - Preload frame `0` as priority critical, then batch load subsequent frames in chunks of 4.
  - Bind scroll position via Framer Motion `useScroll({ target: containerRef, offset: ["start start", "end end"] })`.
  - Transform scroll progress `[0, 1]` to integer frame index `[0, totalFrames - 1]`.
  - Render with aspect-ratio `cover` and support `window.devicePixelRatio`.
- [ ] Integrate the image sequence canvas into `src/app/(site)/[locale]/page.tsx` between Hero and Featured Projects.
- [ ] Verification: Test smooth scrolling and frame scrubbing without dropped frames.

### Task 6: Smart Scroll-Snapping Behavior (`useSmartScrollSnap`)
- [ ] Create `src/hooks/use-smart-scroll-snap.ts`:
  - Check `window.matchMedia("(prefers-reduced-motion: reduce)")` — abort if user prefers reduced motion.
  - Setup `ResizeObserver` observing all sections marked with `data-snap-section`.
  - If `section.clientHeight > window.innerHeight * 1.08`:
    - Set `section.style.scrollSnapAlign = "none"`.
    - Mark as `free-scroll`.
  - Otherwise:
    - Set `section.style.scrollSnapAlign = "start"`.
- [ ] Apply `useSmartScrollSnap()` in the root site layout or page wrapper.
- [ ] Add `data-snap-section` attribute to each section component.
- [ ] Verification: Test that short sections (Hero, FeaturedProjects, Experience) dock cleanly on scroll, while long sections allow free, natural momentum scrolling without snapping loop.

### Task 7: About Page (`/about`) Overhaul (Borderless Side-by-Side)
- [ ] Place asset `docs/Foto Orang/foto 2.png` into `public/assets/dimas-about.png` (or configure for Sanity upload).
- [ ] Refactor `src/components/sections/about/about-hero.tsx`:
  - Remove the small circular framed avatar (`w-32 h-32 rounded-full border-4 border-card`).
  - Create a 2-column borderless side-by-side grid (`minmax(320px, 420px) 1fr`):
    - **Side A (Visual Anchor)**: Large borderless cutout photo (`dimas-about.png`) with bottom gradient fade mask (`mask-image: linear-gradient(...)`).
    - **Side B (Narrative)**:
      - Eyebrow: `01 // BIOGRAPHY`.
      - Heading: "Dimas Rizki Ardiansyah".
      - Sub-headline: Informatics Engineering student & Fullstack/AI practitioner.
      - Action buttons: "Download CV" & "Let's Connect".
      - Integrated "My Story" text with clickable keyword pills ("Full-stack + AI", "Production Systems", "Mission Critical", "Cloud Architecture").
- [ ] In `src/app/(site)/[locale]/about/page.tsx`:
  - Merge the content of `AboutStory` directly into `AboutHero` (or render `AboutStory` seamlessly side-by-side) to eliminate empty vertical gaps.
  - Ensure the Tech Stack section (`TechStack`) is marked with `data-snap-free="true"` to prevent scroll snapping lock.
- [ ] Verification: Check `/about` on desktop and mobile with Playwright, verifying borderless cutout and smooth reading flow.

### Task 8: End-to-End Verification & Quality Assurance
- [ ] Run `pnpm test` — all existing unit tests must pass with 0 failures.
- [ ] Run `pnpm lint` and `pnpm build` — zero TypeScript or linter errors.
- [ ] Use **Playwright MCP** to capture accessibility snapshots and screenshots:
  - Desktop (1440x900): Verify Navbar, Hero split-center, Project slider, Experience contrast, and About side-by-side.
  - Mobile (390x844): Verify vertical stack, touch targets, mobile navigation, and lack of horizontal overflow.
  - Console errors check: Ensure 0 hydration warnings or uncaught exceptions.
