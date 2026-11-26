# Portfolio Visual & Interaction Overhaul Implementation Plan (v2.1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finalize the portfolio redesign (`dimasrizkiportofolio.vercel.app`) on top of the `1464eeb` structural baseline by integrating Sanity CMS portrait assets (`docs/Foto Orang/`), resolving all Playwright live-audit & Unslop/Impeccable visual defects, hardening scroll-snapping and Image Sequence canvas memory handling, and deleting verified dead code.

**Architecture:** Next.js 16 App Router + React 19 + Tailwind CSS v4 with Sanity CMS v5 (`cdn.sanity.io` allowlisted in `next.config.ts`) delivering portrait cutouts (`heroPortrait`, `aboutPortrait`) and optional WebP scroll sequence frames with local static fallbacks. Scroll scrubbing runs on a DPR-scaled HTML5 2D `<canvas>` using `createImageBitmap` with explicit `.close()` teardown, paired with hybrid `scroll-snap-type: y proximity` (`scroll-padding-top: 4rem`) and `ResizeObserver` overflow opt-out (`> 1.08×vh`).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion v12, Sanity CMS v5, HTML5 Canvas 2D, Node test runner (`pnpm test`), Playwright MCP.

**Spec:** `docs/redesign/DESIGN.md`, `docs/redesign/LAYOUT.md`, `docs/redesign/ARCHITECTURE.md`.

## Global Constraints
- Bilingual parity (`en` and `id`) across `src/i18n/messages/en.json` and `src/i18n/messages/id.json`; `tests/i18n/messages.test.ts` must pass with 0 missing or mismatched keys.
- Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`) from `360px` to `2560px`.
- Zero console errors or React hydration warnings on `/en`, `/id`, `/en/about`, `/id/about`, `/en/projects`, `/en/experience`.
- Strict Unslop/Impeccable discipline: zero radial color glow blobs (`blur-3xl`), zero looping `animate-ping`/`sayhiWave`/`waterSlosh`, zero UI chrome emojis, sentence-case navigation/labels, max 2 CTAs in Hero (`View Projects` + `Let's Connect`), and zero unverified hardcoded stats.
- Never delete shared files still imported by subpages (`project-grid.tsx`, `cta/index.tsx`, `download-portfolio-button.tsx`).
- `pnpm test`, `pnpm lint`, and `pnpm build` must all pass with exit code 0.

## Review Focus
1. **Sanity Portrait Null Fallback:** When `heroPortrait` or `aboutPortrait` is not yet uploaded in Sanity Studio, `settings.service.ts` must return the local static fallback (`/assets/dimas-pointing.png` `666×375`, `/assets/dimas-about.png` `375×666`) without throwing or distorting aspect ratio — pinned in Task 1 tests.
2. **Sticky Navbar Occlusion on Scroll-Snap:** Snapping to a section with `scroll-snap-align: start` without `scroll-padding-top: 4rem` clips the section eyebrow behind the 64px sticky `<header>` — pinned in Task 2 CSS & Task 6 Playwright check.
3. **Long Section Scroll-Trapping (`/about` Tech Stack & Narrow-Viewport Certificates):** Sections taller than `1.08×vh` (including dynamic resize from desktop to tablet) must clear `scroll-snap-align` to `none` — pinned in Task 2 & Task 6 Playwright check.
4. **ImageBitmap GPU Memory Leak & Blank Scrubbing Frame:** Navigating away from Home must invoke `.close()` on all decoded `ImageBitmap` entries, and fast scrubbing past unloaded frames must render the nearest loaded frame instead of blank canvas — pinned in Task 5.
5. **Bilingual Leakage on `/id/about`:** `AboutHero` previously hardcoded English subtitle and `My Story` paragraphs regardless of locale; `/id/about` must render Indonesian strings from `messages`/`content` — pinned in Task 4 & Task 6.

---

### Task 1: Sanity CMS Portrait & Sequence Asset Pipeline

**Files:**
- Modify: `src/sanity/schemaTypes/siteSettings.schema.ts:84-111`
- Modify: `src/sanity/queries/siteSettings.queries.ts:1-19`
- Modify: `src/types/siteSettings.ts`
- Modify: `src/services/settings.service.ts`
- Test: `tests/services/settings-portraits.test.ts` (create)

**Interfaces:**
- Produces:
  - `SanityImageMeta = { url: string; width: number; height: number }` in `src/types/siteSettings.ts`
  - `DEFAULT_HERO_PORTRAIT: SanityImageMeta = { url: "/assets/dimas-pointing.png", width: 666, height: 375 }`
  - `DEFAULT_ABOUT_PORTRAIT: SanityImageMeta = { url: "/assets/dimas-about.png", width: 375, height: 666 }`
  - `resolvePortrait(image: SanityImageMeta | null | undefined, fallback: SanityImageMeta): SanityImageMeta` in `src/services/settings.service.ts`
  - `ResolvedSettings` extended with `heroPortrait: SanityImageMeta`, `aboutPortrait: SanityImageMeta`, `scrollSequenceFrames: string[]`

- [ ] **Step 1: Write failing unit test for portrait resolution and fallback**

```ts
// tests/services/settings-portraits.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ABOUT_PORTRAIT,
  DEFAULT_HERO_PORTRAIT,
  resolvePortrait,
} from "../../src/services/settings.service";

test("resolvePortrait falls back to local cutout with true dimensions when Sanity asset is absent", () => {
  assert.deepEqual(resolvePortrait(null, DEFAULT_HERO_PORTRAIT), {
    url: "/assets/dimas-pointing.png",
    width: 666,
    height: 375,
  });
  assert.deepEqual(resolvePortrait(undefined, DEFAULT_ABOUT_PORTRAIT), {
    url: "/assets/dimas-about.png",
    width: 375,
    height: 666,
  });
});

test("resolvePortrait returns Sanity CDN metadata when valid image is provided", () => {
  const remote = { url: "https://cdn.sanity.io/images/demo/hero.png", width: 800, height: 900 };
  assert.deepEqual(resolvePortrait(remote, DEFAULT_HERO_PORTRAIT), remote);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL because `resolvePortrait`, `DEFAULT_HERO_PORTRAIT`, `DEFAULT_ABOUT_PORTRAIT` are not exported.

- [ ] **Step 3: Add `heroPortrait`, `aboutPortrait`, and `scrollSequenceFrames` to Sanity schema, GROQ query, types, and service**

- In `src/sanity/schemaTypes/siteSettings.schema.ts`, add `heroPortrait` (`type: "image"`), `aboutPortrait` (`type: "image"`), and `scrollSequenceFrames` (`type: "array"`, `of: [{ type: "image" }]`).
- In `src/sanity/queries/siteSettings.queries.ts`, project `"heroPortrait": heroPortrait.asset->{ url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }`, same for `aboutPortrait`, and `"scrollSequenceFrames": scrollSequenceFrames[].asset->url`.
- In `src/types/siteSettings.ts`, export `SanityImageMeta` and add optional fields to `SiteSettings`.
- In `src/services/settings.service.ts`, export `DEFAULT_HERO_PORTRAIT`, `DEFAULT_ABOUT_PORTRAIT`, and `resolvePortrait(...)`, and populate `heroPortrait`, `aboutPortrait`, and `scrollSequenceFrames` in `getResolvedSettings`.

- [ ] **Step 4: Run test suite**

Run: `pnpm test`
Expected: PASS (0 failures).

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemaTypes/siteSettings.schema.ts src/sanity/queries/siteSettings.queries.ts src/types/siteSettings.ts src/services/settings.service.ts tests/services/settings-portraits.test.ts
git commit -m "feat(cms): add Sanity portrait cutout and scroll sequence fields with local fallback"
```

---

### Task 2: Global Surface Tokens, Scroll-Snap Sticky Offset & Compact Rhythm Alignment

**Files:**
- Modify: `src/app/globals.css:43-55,98-108,148-156,214-284,304-316`
- Modify: `src/components/layout/section.tsx:1-23`
- Modify: `src/components/sections/certificates/index.tsx:23-26`
- Modify: `src/components/sections/about/education-section.tsx:50-56`

**Interfaces:**
- Produces:
  - CSS custom property `--bg-surface-subtle` (`#0e121b` dark / `#f1f5f9` light)
  - `.snap-proximity-y` with `scroll-snap-type: y proximity; scroll-padding-top: 4rem;`
  - `<Section>` default compact padding `py-8 sm:py-10 lg:py-12`

- [ ] **Step 1: Update `src/app/globals.css`**

- Add `--bg-surface-subtle: #0e121b;` in `:root` and `.dark`, and `--bg-surface-subtle: #f1f5f9;` in `.light`, exposed via `@theme inline` as `--color-surface-subtle`.
- Add `scroll-padding-top: 4rem;` inside `.snap-proximity-y` so snapping clears the 64px sticky navbar.
- Remove unused looping keyframes and theme animation vars (`sayhiWave`, `waterSlosh`, `avatarBounce`) after verifying 0 references via `grep`.

- [ ] **Step 2: Align `<Section>`, `FeaturedCertificates`, and `EducationSection`**

- Tighten `src/components/layout/section.tsx` default padding to `py-8 sm:py-10 lg:py-12`.
- Update `src/components/sections/certificates/index.tsx` to use `border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]` so `Experience` (`#111622`) and `Featured Certificates` (`#0e121b`) read as distinct bands.
- Refactor `src/components/sections/about/education-section.tsx` outer `<section className="py-16">` to use `<Section>` + `<Container>` so it inherits compact spacing and `data-snap-target="true"`.

- [ ] **Step 3: Verify typecheck and lint**

Run: `pnpm lint`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/layout/section.tsx src/components/sections/certificates/index.tsx src/components/sections/about/education-section.tsx
git commit -m "style(tokens): add surface-subtle step, scroll-padding-top offset, and align EducationSection"
```

---

### Task 3: Navbar & Home Hero Unslop Refinement (Sanity Portrait + 2-CTA Cap)

**Files:**
- Modify: `src/components/layout/navbar.tsx`
- Modify: `src/components/sections/hero/index.tsx`
- Modify: `src/components/sections/hero/hero-content.tsx`
- Modify: `src/app/(site)/[locale]/page.tsx`

**Interfaces:**
- Consumes: `ResolvedSettings.heroPortrait`, `ResolvedSettings.scrollSequenceFrames` from Task 1.
- Produces:
  - `Hero({ content, settings, locale }: HeroProps)` (drops unused `cvUrl` prop from Hero since CV lives in Navbar).

- [ ] **Step 1: Declutter typography and chrome in `src/components/layout/navbar.tsx`**

- Remove `0${idx + 1} //` prefixes and `uppercase tracking-wider` from center nav links (`About`, `Projects`, `Experience`, `Certificates`); render sentence case with `text-sm font-medium`.
- Normalize control radius to `rounded-lg` (replace hover `scale-105` with quiet surface/color transition).
- Ensure `Contact` right-side button is the single primary CTA with `whitespace-nowrap`.

- [ ] **Step 2: Refine Home Split-Center Hero (`src/components/sections/hero/index.tsx`, `hero-content.tsx`, `page.tsx`)**

- Render `settings.heroPortrait.url` with true `width={settings.heroPortrait.width}` and `height={settings.heroPortrait.height}` inside the center column (`minmax(320px, 460px)`).
- Delete the `blur-3xl` radial color glow `<div>` behind the portrait.
- Delete the looping `animate-ping` span on the availability dot and change `[ONLINE // AVAILABLE]` to quiet sentence case from i18n messages.
- Delete the hardcoded unverified `3+ / 15+ / 20+` stats grid.
- Delete the redundant 3rd CTA (`Download CV` ghost button) in the right column so Hero contains strictly 1 primary CTA (`View Projects`, left) and 1 secondary CTA (`Let's Connect`, right).
- Pass `frames={settings.scrollSequenceFrames}` to `<ImageSequenceCanvas />` in `src/app/(site)/[locale]/page.tsx`.

- [ ] **Step 3: Verify lint and unit tests**

Run: `pnpm test && pnpm lint`
Expected: PASS (0 failures, 0 lint errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/navbar.tsx src/components/sections/hero/index.tsx src/components/sections/hero/hero-content.tsx src/app/\(site\)/\[locale\]/page.tsx
git commit -m "refactor(hero,navbar): wire Sanity hero portrait and apply Unslop restraint"
```

---

### Task 4: About Hero Borderless Refinement & Full Bilingual Localization

**Files:**
- Modify: `src/app/(site)/[locale]/about/page.tsx`
- Modify: `src/components/sections/about/about-hero.tsx`
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/id.json`

**Interfaces:**
- Consumes: `ResolvedSettings.aboutPortrait` from Task 1 (`getResolvedSettings(typedLocale)` in `about/page.tsx`).
- Produces:
  - `AboutHero({ cvUrl, locale, content, portrait }: AboutHeroProps)`

- [ ] **Step 1: Add missing About subtitle/story i18n keys to `en.json` and `id.json`**

- Add `about.eyebrow`, `about.academicSubtitle`, and `about.story.eyebrow` to both `src/i18n/messages/en.json` and `src/i18n/messages/id.json`.
- Run `pnpm test` to verify `tests/i18n/messages.test.ts` confirms exact key parity.

- [ ] **Step 2: Refactor `src/components/sections/about/about-hero.tsx` and `src/app/(site)/[locale]/about/page.tsx`**

- Fetch `settings` via `getResolvedSettings(typedLocale)` in `about/page.tsx` and pass `portrait={settings.aboutPortrait}` to `<AboutHero />`.
- Render `portrait.url` with intrinsic `width={portrait.width}` and `height={portrait.height}`.
- Remove the `blur-3xl` radial color glow `<div>` behind the cutout portrait.
- Replace hardcoded `01 // About Me` and hardcoded English subtitle/story copy with localized `messages` and `content.storyParagraphs` (falling back gracefully when Sanity paragraphs are empty), preserving clickable keyword pills without breaking Indonesian copy on `/id/about`.

- [ ] **Step 3: Verify tests and lint**

Run: `pnpm test && pnpm lint`
Expected: PASS (0 failures).

- [ ] **Step 4: Commit**

```bash
git add src/app/\(site\)/\[locale\]/about/page.tsx src/components/sections/about/about-hero.tsx src/i18n/messages/en.json src/i18n/messages/id.json
git commit -m "refactor(about): wire Sanity about portrait, remove glow blob, and localize story"
```

---

### Task 5: Image Sequence Canvas Memory Cleanup & Nearest-Frame Fallback

**Files:**
- Modify: `src/components/motion/image-sequence-canvas.tsx`

**Interfaces:**
- Consumes: `ImageSequenceCanvasProps` (`frames?: string[]`, `totalProceduralFrames?: number`, `heightClassName?: string`)

- [ ] **Step 1: Add GPU `ImageBitmap` cleanup and nearest-loaded frame lookup**

- In the frame preloader `useEffect` cleanup, iterate `loadedImagesRef.current` and invoke `img.close()` whenever `typeof ImageBitmap !== "undefined" && img instanceof ImageBitmap` to prevent GPU texture leaks across route transitions.
- Add `findNearestLoadedFrame(cache, targetIndex)` that scans downward from `targetIndex` (then upward) so rapid scrolling never flashes a blank black frame while frames are still streaming.
- Change default `heightClassName` for procedural fallback mode (when `frames.length === 0`) to `"h-[160vh]"` while keeping `"h-[220vh]"` when real WebP `frames` are supplied; collapse height to `"h-[70svh]"` when `useReducedMotion()` is true.

- [ ] **Step 2: Verify lint and typecheck**

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/motion/image-sequence-canvas.tsx
git commit -m "perf(canvas): close ImageBitmaps on unmount and add nearest-frame scrub fallback"
```

---

### Task 6: Verified Dead Code Deletion & Full End-to-End QA

**Files:**
- Delete (after `grep` confirms 0 callers):
  - `src/components/sections/hero/building-card.tsx`
  - `src/components/sections/hero/testimonial-slider.tsx`
  - `src/components/sections/hero/dog-buddy.tsx`
  - `src/components/sections/hero/ai-modal.tsx`
  - `src/components/sections/hero/typewriter-greeting.tsx`
  - `src/components/sections/hero/hero-console.tsx`
  - `src/components/sections/hero/hero-image.tsx`
  - `src/components/sections/hero/hero-stats.tsx`
  - `src/components/sections/about/about-story.tsx`
  - `src/components/sections/about/about-section.tsx`

- [ ] **Step 1: Verify 0 callers before deleting any file**

Run `grep` across `src/` for all 10 symbol names; confirm 0 external imports. Keep `project-grid.tsx`, `cta/index.tsx`, and `download-portfolio-button.tsx` intact.

- [ ] **Step 2: Delete orphan files and run full build + test + lint**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: All unit tests PASS, 0 lint errors, clean Next.js production build.

- [ ] **Step 3: Run Playwright MCP verification across viewports and locales**

Verify on local dev/prod server (`1440×900`, `1024×768`, `390×844`) across `/en`, `/id`, `/en/about`, `/id/about`, `/en/projects`:
- Navbar single row, 0 wrapping, 0 duplicate Contact links.
- Home Hero split-center portrait rendered cleanly with 0 glow blobs and 2 CTAs max.
- `Experience` (`#111622`) vs `Featured Certificates` (`#0e121b`) surface contrast visible.
- `scroll-padding-top: 64px` active on `html.snap-proximity-y`; `/about` Tech Stack (`data-snap="free"`) scrolls freely without snap trap.
- `0` console errors, `0` hydration warnings, `overflowX === false`.

- [ ] **Step 4: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove verified orphaned hero and about components"
```
