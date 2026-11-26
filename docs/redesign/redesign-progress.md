# Redesign Rekap Progress (Persistent Context)

## Checklist Progress: Compact Neo-Brutalist & Split-Center Overhaul

### Phase 1: Design Tokens & Spacing System
- [ ] Section.tsx padding reduction (`py-10 lg:py-14`)
- [ ] Surface contrast token `--bg-surface-elevated` (`#111622`) di `globals.css`
- [ ] Utility scroll-snap classes

### Phase 2: Navbar Decluttering
- [ ] Hapus badge "Say hi" dari samping logo
- [ ] 4 navigation links di tengah (`01 // About` s.d. `04 // Certificates`)
- [ ] Hapus tombol Contact duplikat
- [ ] Gabungkan tombol CV dan Portfolio PDF
- [ ] AccentPicker & LanguageSwitcher compact

### Phase 3: Hero Home 3-Column Split-Center
- [ ] Cutout portrait `foto 1.png` (green suit, pointing) sebagai centerpiece
- [ ] Flanking teks asimetris kiri (nama & title) dan kanan (bio & stats)
- [ ] Hapus `BuildingCard` dan `TestimonialSlider`

### Phase 4: Main Page Pruning & Surface Contrast
- [ ] Hapus `ProjectGrid` (3-column cards) dari Home
- [ ] Hapus bottom `<CTA />` banner
- [ ] Elevasi background Experience & Featured Certificates (`#111622`)

### Phase 5: Image Sequence Scroll Animation
- [ ] `image-sequence-canvas.tsx` dengan preloading dan scrubbing
- [ ] Integrasi ke layout Home

### Phase 6: Smart Scroll-Snapping Behavior
- [ ] Hook `useSmartScrollSnap`
- [ ] Dynamic disable snap pada section `> 100vh` (free-scroll)

### Phase 7: About Page Overhaul
- [ ] 2-column borderless side-by-side dengan `foto 2.png` (black shirt)
- [ ] Integrasi narasi *My Story* di samping foto
- [ ] Free-scroll pada daftar Tech Stack panjang

### Phase 8: Verification & QA
- [ ] Unit test (`pnpm test`)
- [ ] Lint & Typecheck (`pnpm lint`)
- [ ] Playwright visual snapshot desktop & mobile

---

🟢 Status: Fase Perencanaan & Dokumentasi Selesai. Menunggu persetujuan rencana teknis sebelum eksekusi kode.
