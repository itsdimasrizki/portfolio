# Implementation Task Breakdown: Portfolio Overhaul (v2 + v2.1 Unslop & Sanity Alignment)

Rencana kerja disusun berurutan dengan prinsip **zero regression**, menjaga kompatibilitas bilingual (`en` & `id`), integrasi Sanity CMS, serta kepatuhan standar `/skill:impeccable` dan `/skill:unslop`.

Status terbagi menjadi dua gelombang:
- **Wave A (v2 Baseline — Committed in `1464eeb`)**: Fondasi layout, declutter navbar, split-center hero, borderless about, sequence canvas, dan smart scroll-snap.
- **Wave B (v2.1 Polish, Sanity CMS Portraits & Unslop Audit Fixes — Pending Doc Approval)**: Menutup gap hasil audit Playwright live site, integrasi foto ke Sanity CMS, pembersihan sisa slop UI, perbaikan `scroll-padding-top`, dan penghapusan dead code orphan.

---

## Wave A: Structural Baseline (`1464eeb`)

### Phase 1: Design Tokens & Compact Spacing
- [x] Pangkas default vertical padding di `src/components/layout/section.tsx` (`py-8 sm:py-10 lg:py-14`).
- [x] Tambah token `--bg-surface-elevated: #111622`, `--border-contrast`, dan utility scroll-snap di `src/app/globals.css`.

### Phase 2: Navbar Decluttering
- [x] Hapus badge `👋 Say hi` dari `coin-logo.tsx`.
- [x] Sederhanakan link tengah ke 4 rute (`About`, `Projects`, `Experience`, `Certificates`) dan hapus link `Contact` duplikat.
- [x] Gabungkan `Download CV` dan `Portfolio PDF` ke dropdown `CV / PDF` di `navbar.tsx`.

### Phase 3: Home Split-Center Hero & Section Pruning
- [x] Bangun layout 3-kolom split-center di `hero-content.tsx` dengan `dimas-pointing.png` (`foto 1.png`) di tengah.
- [x] Lepas `BuildingCard`, `TestimonialSlider`, `DogBuddy`, `AiModal`, dan `TypewriterGreeting` dari Hero.
- [x] Hapus `ProjectGrid` dari `FeaturedProjects` Home (tetap dipertahankan di `/projects`).
- [x] Hapus `<CTA />` bottom banner dari Home (`src/app/(site)/[locale]/page.tsx`).
- [x] Terapkan surface contrast `#111622` pada `ExperiencePreview` dan `FeaturedCertificates`.

### Phase 4: Image Sequence & Smart Scroll-Snapping
- [x] Buat `src/components/motion/image-sequence-canvas.tsx` (HTML5 Canvas 2D, DPR scaling, `ImageBitmap`, `useScroll`).
- [x] Buat `src/hooks/use-smart-scroll-snap.ts` (`ResizeObserver`, threshold `1.08×vh`, `prefers-reduced-motion`).

### Phase 5: About Page Borderless Side-by-Side
- [x] Rombak `src/components/sections/about/about-hero.tsx` ke layout 2-kolom borderless dengan `dimas-about.png` (`foto 2.png`) + narasi `My Story`.
- [x] Tandai `TechStack` dengan `data-snap="free"`.

---

## Wave B: v2.1 Audit Fixes, Sanity Portrait CMS & Unslop Refinement (Next Execution)

### Phase 6: Sanity CMS Portrait & Sequence Asset Pipeline
- [x] Tambah field `heroPortrait`, `aboutPortrait`, dan `scrollSequenceFrames` pada `src/sanity/schemaTypes/siteSettings.schema.ts`.
- [x] Update GROQ query di `src/sanity/queries/siteSettings.queries.ts` untuk memproyeksikan `url` serta `metadata.dimensions.{width,height}`.
- [x] Update `src/types/siteSettings.ts` dan `src/services/settings.service.ts` dengan fallback lokal (`dimas-pointing.png` `666×375` dan `dimas-about.png` `375×666`).
- [x] Hubungkan `HeroContent` dan `AboutHero` agar membaca portrait dari `settings` Sanity (dengan dimensi intrinsik asli, bukan hardcode `920×1150`).
- [ ] Upload `docs/Foto Orang/foto 1.png` (cropped horizontal margin) & `foto 2.png` ke Sanity Studio, dan perbaiki typo kategori `"Leaguage Programming"` -> `"Programming Languages"` di Sanity Studio.

### Phase 7: Unslop & Impeccable Visual Pass
- [x] **Navbar (`navbar.tsx`)**: Hapus prefix `01 //`..`04 //` dan uppercase tracking; gunakan sentence case bersih dan control radius konsisten (`rounded-lg`).
- [x] **Home Hero (`hero-content.tsx`)**:
  - Hapus radial glow blob (`blur-3xl`) di belakang portrait.
  - Hapus animasi looping `animate-ping` pada status dot dan ganti label `[ONLINE // AVAILABLE]` menjadi sentence case tenang.
  - Hapus tombol CTA ke-3 (`Download CV` ghost button) agar Hero hanya punya 1 primary CTA (`View Projects`) + 1 secondary CTA (`Let's Connect`).
  - Hapus angka statistik hardcode tidak terverifikasi (`3+`, `15+`, `20+`) atau ganti dengan count real dari Sanity.
- [x] **About Hero (`about-hero.tsx`)**:
  - Hapus radial glow blob (`blur-3xl`) di belakang portrait.
  - Lokalisasi penuh sub-headline akademik dan narasi `My Story` agar `/id/about` tidak menampilkan teks Inggris hardcode.
- [x] **Surface Rhythm & Education (`globals.css`, `certificates/index.tsx`, `education-section.tsx`)**:
  - Tambah token `--bg-surface-subtle: #0e121b` pada `FeaturedCertificates` agar kontras halus terhadap `ExperiencePreview` (`#111622`).
  - Ganti `<section className="py-16">` di `EducationSection` menjadi `<Section>` agar konsisten dengan Compact Vertical Rhythm (`py-8 sm:py-10 lg:py-12`) dan terdeteksi smart scroll-snap.

### Phase 8: Scroll-Snapping & Image Sequence Hardening
- [x] Tambahkan `scroll-padding-top: 4rem;` pada `html.snap-proximity-y` di `src/app/globals.css` agar sticky navbar `64px` tidak memotong bagian atas section saat snap.
- [x] Tambahkan cleanup `bitmap.close()` saat unmount di `src/components/motion/image-sequence-canvas.tsx` dan nearest-loaded frame fallback saat fast scrubbing.
- [x] Turunkan tinggi fallback procedural canvas dari `h-[220vh]` ke `h-[160vh]` (sampai frame WebP produksi di-supply via `settings.scrollSequenceFrames` atau `public/sequence/`).

### Phase 9: Verified Dead Code Cleanup
- [x] Hapus 10 file komponen orphan (0 callers terverifikasi):
  - `src/components/sections/hero/{building-card,testimonial-slider,dog-buddy,ai-modal,typewriter-greeting,hero-console,hero-image,hero-stats}.tsx`
  - `src/components/sections/about/{about-story,about-section}.tsx`
- [x] Bersihkan keyframe CSS yang tidak terpakai di `src/app/globals.css` (`sayhiWave`, `waterSlosh`, `avatarBounce`) dan audit pemakaian `src/components/effects/svg-filters.tsx`.
- [x] **Pertahankan** `project-grid.tsx` (dipakai `/projects`), `cta/index.tsx` (dipakai `/experience`), dan `download-portfolio-button.tsx` (dipakai `mobile-nav.tsx`).

### Phase 10: Final QA & Playwright Verification
- [x] Jalankan `pnpm test`, `pnpm lint`, dan `pnpm build` (0 error).
- [ ] Verifikasi via **Playwright MCP** pada viewport `1440×900`, `1024×768`, dan `390×844` untuk `/en`, `/id`, `/en/about`, `/id/about`:
  - Zero horizontal overflow, zero console/hydration errors, zero navbar wrapping, verified `scroll-padding-top`, verified free-scroll on Tech Stack, and verified Sanity portrait rendering.
