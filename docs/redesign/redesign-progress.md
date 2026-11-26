# Redesign Rekap Progress (Persistent Context)

## Checklist Progress: Compact Neo-Brutalist & Split-Center Overhaul

### Phase 1: Design Tokens & Spacing System
- [x] Section.tsx padding reduction (`py-10 lg:py-14`)
- [x] Surface contrast token `--bg-surface-elevated` (`#111622`) di `globals.css`
- [x] Utility scroll-snap classes

### Phase 2: Navbar Decluttering
- [x] Hapus badge "Say hi" dari samping logo
- [x] 4 navigation links di tengah (`01 // About` s.d. `04 // Certificates`)
- [x] Hapus tombol Contact duplikat
- [x] Gabungkan tombol CV dan Portfolio PDF
- [x] AccentPicker & LanguageSwitcher compact

### Phase 3: Hero Home 3-Column Split-Center
- [x] Cutout portrait `foto 1.png` (green suit, pointing) sebagai centerpiece
- [x] Flanking teks asimetris kiri (nama & title) dan kanan (bio & stats)
- [x] Hapus `BuildingCard` dan `TestimonialSlider`

### Phase 4: Main Page Pruning & Surface Contrast
- [x] Hapus `ProjectGrid` (3-column cards) dari Home
- [x] Hapus bottom `<CTA />` banner
- [x] Elevasi background Experience & Featured Certificates (`#111622`)

### Phase 5: Image Sequence Scroll Animation
- [x] `image-sequence-canvas.tsx` dengan preloading dan scrubbing
- [x] Integrasi ke layout Home

### Phase 6: Smart Scroll-Snapping Behavior
- [x] Hook `useSmartScrollSnap`
- [x] Dynamic disable snap pada section `> 100vh` (free-scroll)

### Phase 7: About Page Overhaul
- [x] 2-column borderless side-by-side dengan `foto 2.png` (black shirt)
- [x] Integrasi narasi *My Story* di samping foto
- [x] Free-scroll pada daftar Tech Stack panjang

### Phase 8: Verification & QA
- [x] Unit test (`pnpm test`)
- [x] Lint & Typecheck (`pnpm lint`)
- [x] Playwright visual snapshot desktop & mobile

---

✅ Status: Seluruh Phase 1–8 Selesai & Terverifikasi (`pnpm test`, `pnpm lint`, `tsc --noEmit`, dan Playwright desktop/mobile).
