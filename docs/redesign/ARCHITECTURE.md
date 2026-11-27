# Technical Architecture: Sanity Assets, Image Sequence & Hybrid Scroll-Snapping

## 1. System Stack & Constraints

- **Framework:** Next.js 16 (App Router, Server Components) + React 19
- **Styling:** Tailwind CSS v4 (`@theme inline` + CSS custom properties in `src/app/globals.css`)
- **Animation & Scroll:** Framer Motion (`useScroll`, `useReducedMotion`) + HTML5 Canvas 2D + `ResizeObserver`
- **CMS & Media CDN:** Sanity CMS v5 (`cdn.sanity.io` already allowlisted in `next.config.ts`)
- **i18n:** Dual locale (`en` / `id`) via `src/i18n/messages/{en,id}.json` + Sanity localized fields

---

## 2. Portrait Assets & Sanity CMS Pipeline (`docs/Foto Orang/`)

The two cutout portrait assets currently stored in `docs/Foto Orang/` will be managed in **Sanity CMS** so portraits can be updated without code redeploys, while retaining local static fallbacks in `public/assets/` during local dev or if Sanity fields are empty.

### 2.1 Asset Inventory & True Dimensions

| Source File | Subject Description | Raw Dimensions | Subject BBox | Target Slot | Fallback Path |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `docs/Foto Orang/foto 1.png` | Green suit, black tie, pointing pose (transparent RGBA PNG) | `666 × 375` | `341 × 373` (`x:137..478, y:2..375`) | Home Hero Split-Centerpiece | `/assets/dimas-pointing.png` |
| `docs/Foto Orang/foto 2.png` | Black Teknik Informatika shirt (transparent RGBA PNG) | `375 × 666` | `279 × 552` (`x:74..353, y:114..666`) | About Hero Borderless Left Anchor | `/assets/dimas-about.png` |

> **Asset Prep Note:** Trim excess horizontal transparent padding on `foto 1.png` before uploading to Sanity (or configure crisp framing) so the cutout occupies maximum visual width without empty side margins, and pass real intrinsic `width`/`height` from Sanity metadata (`asset->metadata.dimensions`) to `next/image`.

### 2.2 Sanity Schema Addition (`src/sanity/schemaTypes/siteSettings.schema.ts`)

Add two dedicated image fields (plus optional sequence frames array) to `siteSettings`:

```ts
defineField({
  name: "heroPortrait",
  title: "Hero Portrait Cutout (Home)",
  description: "Transparent PNG cutout for the Home split-center hero (foto 1.png).",
  type: "image",
  options: { hotspot: false },
}),
defineField({
  name: "aboutPortrait",
  title: "About Portrait Cutout (/about)",
  description: "Transparent PNG cutout for the About borderless side-by-side hero (foto 2.png).",
  type: "image",
  options: { hotspot: false },
}),
defineField({
  name: "scrollSequenceFrames",
  title: "Home Scroll Sequence Frames (Optional)",
  description: "Ordered WebP frames for Home scroll scrubbing animation.",
  type: "array",
  of: [{ type: "image" }],
}),
```

### 2.3 GROQ Query & TypeScript Contract

Extend `src/sanity/queries/siteSettings.queries.ts` and `src/types/siteSettings.ts`:

```groq
"heroPortrait": heroPortrait.asset->{
  url,
  "width": metadata.dimensions.width,
  "height": metadata.dimensions.height
},
"aboutPortrait": aboutPortrait.asset->{
  url,
  "width": metadata.dimensions.width,
  "height": metadata.dimensions.height
},
"scrollSequenceFrames": scrollSequenceFrames[].asset->url
```

```ts
export type SanityImageMeta = {
  url: string;
  width: number;
  height: number;
};

// In SiteSettings / ResolvedSettings:
heroPortrait?: SanityImageMeta | null;
aboutPortrait?: SanityImageMeta | null;
scrollSequenceFrames?: string[];
```

Resolution helper in `settings.service.ts` falls back cleanly to `{ url: "/assets/dimas-pointing.png", width: 666, height: 375 }` and `{ url: "/assets/dimas-about.png", width: 375, height: 666 }` when Sanity fields are unset.

---

## 3. Image Sequence Scroll Animation Architecture

### 3.1 Pipeline Overview

```
Scroll Container (height: 200vh..240vh, data-snap="free")
  └── Sticky Viewport (position: sticky; top: 4rem; height: calc(100svh - 4rem))
        └── <canvas /> (DPR-scaled 2D context, aspect-cover draw)
              ▲
              │ requestAnimationFrame (only redraws when frameIndex changes)
              │
    Framer Motion useScroll({ target, offset: ["start start", "end end"] })
      progress [0..1] -> frameIndex = Math.round(progress * (totalFrames - 1))
```

### 3.2 Preloading, Decoding & Memory Hygiene

1. **Frame Asset Spec (Production):**
   - Format: `WebP` (lossy quality `78–82`), target resolution `1280×720` (desktop) / `720×960` (optional mobile), `48–72` frames total.
   - Budget: `<= 25 KB` per frame (~`1.2–1.6 MB` total), served from `public/sequence/frame_000.webp` or Sanity CDN URLs (`settings.scrollSequenceFrames`).
2. **Critical Frame 0 (No Blank Canvas):**
   - Fetch and decode `frames[0]` immediately on mount with `priority: "high"`. Draw immediately so the sticky viewport is never empty before scroll starts.
3. **Concurrency-Limited Background Preloader:**
   - Load remaining frames with a worker pool capped at `MAX_CONCURRENCY = 4` (never fire 60 parallel requests that saturate the browser connection pool).
   - Decode off the main thread via `createImageBitmap(blob)` when supported, falling back to `HTMLImageElement` + `img.decode()`.
4. **Nearest-Loaded Frame Fallback:**
   - If the user scrubs fast past an unloaded frame index `i`, draw the nearest decoded frame `< i` instead of flashing blank black.
5. **Memory Cleanup (Prevent GPU Leaks):**
   - On component unmount (route navigation to `/about`, `/projects`, etc.), iterate cached `ImageBitmap` instances and call `bitmap.close()` to release GPU texture memory immediately.
6. **Reduced Motion & Fallback Mode:**
   - When `prefers-reduced-motion: reduce` is enabled, collapse container height to `h-[70svh]` and render frame `0` (or final hero keyframe) statically with zero scroll scrubbing.
   - Until real WebP frames are supplied, keep the lightweight procedural canvas fallback capped at `h-[160vh]` (not `220vh`) so visitors do not scroll through excessive empty canvas.

---

## 4. Hybrid CSS/JS Smart Scroll-Snapping (`useSmartScrollSnap`)

### 4.1 Why Pure CSS Snapping Fails
Setting `scroll-snap-type: y mandatory` globally traps users inside sections taller than `100vh` (e.g., `/about` Tech Stack measured at `1822px` = `2.02×vh`, or `/experience` timeline at `2184px`). Additionally, snapping to `scroll-snap-align: start` without `scroll-padding-top` causes the sticky `64px` navbar to overlap section headers.

### 4.2 Hybrid Architecture

```
1. CSS Root Rules (src/app/globals.css):
   html.snap-proximity-y {
     scroll-snap-type: y proximity;
     scroll-padding-top: 4rem; /* 64px sticky navbar offset */
   }

2. Section Opt-In / Opt-Out Contract (<Section>):
   - Default sections render `data-snap-target="true"`.
   - Known long/scrubbed sections (`ImageSequenceCanvas`, `TechStack`) explicitly pass `data-snap="free"`.
   - Every page section (including `EducationSection`) must use `<Section>` for consistent spacing & snap observation.

3. Runtime ResizeObserver Controller (src/hooks/use-smart-scroll-snap.ts):
   - Abort & clear snap classes if `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
   - Observe every `section[data-snap-target]` via `ResizeObserver` + `window.resize`:
       const isOverflowing = target.offsetHeight > window.innerHeight * 1.08;
       target.style.scrollSnapAlign = isOverflowing ? "none" : "start";
   - Re-evaluate on Next.js route transitions (`usePathname()`).
```

---

## 5. Verified Dead Code Cleanup & Caller Graph

Verified via codebase `grep` across `src/` (zero assumptions):

### 5.1 Safe to Delete (0 Callers Remaining)

| File Path | Legacy Purpose | Callers | Action |
| :--- | :--- | :--- | :--- |
| `src/components/sections/hero/building-card.tsx` | Right-column "Currently Building" widget | 0 | **Delete** |
| `src/components/sections/hero/testimonial-slider.tsx` | Right-column "Recommendations" carousel | 0 | **Delete** |
| `src/components/sections/hero/dog-buddy.tsx` | "Pet the Dog" interactive button | 0 | **Delete** |
| `src/components/sections/hero/ai-modal.tsx` | "Ask me anything" modal | 0 | **Delete** |
| `src/components/sections/hero/typewriter-greeting.tsx` | Terminal `> npm start` typewriter | 0 | **Delete** |
| `src/components/sections/hero/hero-console.tsx` | Unused legacy hero console | 0 | **Delete** |
| `src/components/sections/hero/hero-image.tsx` | Unused legacy hero image | 0 | **Delete** |
| `src/components/sections/hero/hero-stats.tsx` | Unused legacy hero stats | 0 | **Delete** |
| `src/components/sections/about/about-story.tsx` | Standalone story section (merged into `AboutHero`) | 0 | **Delete** |
| `src/components/sections/about/about-section.tsx` | Unused legacy about section | 0 | **Delete** |
| Unused keyframes in `src/app/globals.css` | `sayhiWave`, `waterSlosh`, `avatarBounce` | Verify 0 refs | **Prune** |
| `src/components/effects/svg-filters.tsx` | `#navGoo`, `#glassDistortion`, `#waterRipple` | Mounted in `layout.tsx`, verify 0 CSS filter refs | **Prune if unused** |

### 5.2 Pruned from Home/Desktop ONLY — MUST KEEP (Active Callers Exist)

| File Path | Active Caller | Rule |
| :--- | :--- | :--- |
| `src/components/sections/projects/project-grid.tsx` | `src/components/sections/projects/projects-list.tsx` (`/[locale]/projects`) | **Keep file** — removed from Home `FeaturedProjects` only |
| `src/components/sections/cta/index.tsx` | `src/app/(site)/[locale]/experience/page.tsx` | **Keep file** — removed from Home only (remove from `/experience` only if requested) |
| `src/components/common/download-portfolio-button.tsx` | `src/components/layout/mobile-nav.tsx` | **Keep file** — consolidated into dropdown on desktop navbar |
agy --conversation=65560e67-a5b6-4c9e-bb98-05a5234436a9
