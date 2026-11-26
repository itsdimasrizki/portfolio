# Redesign Progress Tracker (Persistent Context)

## Wave A: Structural Overhaul Baseline (Committed in `1464eeb` on `redesign/v2`)
- [x] Compact `<Section>` padding (`py-8 sm:py-10 lg:py-14`) & elevated surface token `#111622`
- [x] Navbar decluttering: removed `👋 Say hi`, consolidated 4 center links, merged `CV / PDF` dropdown, removed duplicate Contact link
- [x] Home Hero converted to 3-column split-center (`foto 1.png`); removed `BuildingCard`, `TestimonialSlider`, `DogBuddy`, `AiModal`, `TypewriterGreeting`
- [x] Home pruning: removed `ProjectGrid` from Home `FeaturedProjects` and removed bottom `<CTA />` banner
- [x] Added `ImageSequenceCanvas` (`src/components/motion/image-sequence-canvas.tsx`) and `useSmartScrollSnap` (`src/hooks/use-smart-scroll-snap.ts`)
- [x] About Hero converted to 2-column borderless side-by-side (`foto 2.png`) with merged `My Story`; `TechStack` marked `data-snap="free"`
- [x] Deployed to `https://dimasrizkiportofolio.vercel.app` (verified live via Playwright MCP, 0 console errors)

## Wave B: v2.1 Unslop, Sanity Portraits & Behind-Hero Ring Sequence (Implemented)
- [x] **Sanity Portrait Pipeline:** Added `heroPortrait`, `aboutPortrait`, `scrollSequenceFrames` to `siteSettings` schema, GROQ query, types, and `settings.service.ts` with pure fallback helper (`src/lib/portraits.ts` + unit tests)
- [x] **Ring Sequence Behind Hero Photo:** Positioned `ImageSequenceCanvas` (`variant="backdrop"`) directly centered behind the Home Hero portrait cutout (`foto 1.png`) and removed standalone dead-space sequence section
- [x] **Hero Cleanup:** Removed 3rd CTA (`Download CV`), radial `blur-3xl` glow blob, looping `animate-ping`, and unverified hardcoded `3+ / 15+ / 20+` stats
- [x] **About Cleanup:** Removed radial `blur-3xl` glow blob, localized `My Story` & subtitle for `/id/about`, converted `EducationSection` to `<Section>`
- [x] **Navbar & Typography Unslop:** Removed `01 //` numbering clutter and uppercase tracking; added `--bg-surface-subtle` (`#0e121b`) on `FeaturedCertificates`
- [x] **Scroll-Snap & Canvas Hardening:** Added `scroll-padding-top: 4rem` for sticky header clearance, `ImageBitmap.close()` cleanup, and nearest-frame scrub fallback
- [x] **Dead Code Cleanup:** Deleted 10 verified orphan component files + unused looping keyframes in `globals.css` (kept `project-grid.tsx`, `cta/index.tsx`, `download-portfolio-button.tsx`)
- [ ] **Sanity Studio Content Fix (Manual in Studio):** Upload `docs/Foto Orang/foto 1.png` & `foto 2.png` to `siteSettings`, fix `"Leaguage Programming"` typo -> `"Programming Languages"`

---

Status: **Wave A + Wave B Selesai & Terverifikasi** (`pnpm test` 46/46, `pnpm lint` 0 error, `pnpm build` PASS, Playwright MCP `1440×900` / `1024×768` / `390×844`). Sisa 1 aksi manual di Sanity Studio (upload `foto 1.png`, `foto 2.png`, fix typo `"Leaguage Programming"`).
