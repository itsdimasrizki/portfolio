# Implementation Task Breakdown: Compact Neo-Brutalist Overhaul

Rencana kerja ini dibagi menjadi fase bertahap dengan prinsip zero-regression, menjaga fungsionalitas bilingual (`en` & `id`), dan kebersihan kode (*unslop*).

---

## Phase 1: Design Tokens & Spacing System
- [x] Perbarui `src/components/layout/section.tsx`: pangkas default vertical padding dari `py-20 lg:py-32` menjadi `py-10 lg:py-14` (mobile: `py-8`).
- [x] Daftarkan token warna permukaan baru di `src/app/globals.css`:
  - `--bg-surface-elevated`: `#111622` (surface kontras untuk kartu Experience & Certificates).
  - `--border-contrast`: `rgba(255, 255, 255, 0.16)`.
- [x] Tambahkan utility class scroll snap di `globals.css` (`snap-proximity-y`, `snap-start`, `snap-none`).

---

## Phase 2: Navigation Bar (`#navbar`) Decluttering
- [x] Refactor `src/components/layout/navbar.tsx`:
  - Hilangkan pill badge "👋 Say hi" yang membebani logo.
  - Sederhanakan daftar link tengah menjadi 4 item (`01 // About`, `02 // Projects`, `03 // Experience`, `04 // Certificates`).
  - Hapus tombol `Contact` duplikat di sisi kanan navigasi.
  - Gabungkan tombol `Download CV` dan `Portfolio PDF` ke dalam split pill atau dropdown ringkas.
  - Rapikan AccentPicker dan LanguageSwitcher agar kompak dan tidak wrapping pada viewport 1024px-1366px.
- [x] Pastikan drawer navigasi mobile (`mobile-nav.tsx`) tetap konsisten dan rapi.

---

## Phase 3: Hero Home 3-Column Split-Center (`#hero`)
- [x] Migrasikan asset `docs/Foto Orang/foto 1.png` (cutout berjas hijau, dasi hitam, menunjuk) ke `public/assets/dimas-pointing.png` atau integrasikan ke asset Sanity.
- [x] Hapus widget kolom kanan:
  - Lepas `BuildingCard` ("Currently Building / Live") dari Hero.
  - Lepas `TestimonialSlider` ("Recommendations / Social Proof") dari Hero.
- [x] Rancang ulang `src/components/sections/hero/index.tsx` & `hero-content.tsx`:
  - Buat layout CSS Grid 3 kolom:
    - **Kiri**: Status `[ONLINE // AVAILABLE]`, nama "Dimas Rizki Ardiansyah", peran/spesialisasi, dan tombol aksi primer ("Explore Work").
    - **Tengah**: Centerpiece cutout portrait (`foto 1.png`) beresolusi tajam tanpa card border, terposisi kokoh di dasar viewport.
    - **Kanan**: Deskripsi narasi teknis ringkas, micro stats, dan tombol kontak sekunder.
  - Tangani breakpoint tablet (2-kolom) dan mobile (stack 1-kolom dengan foto di atas/tengah).

---

## Phase 4: Main Page Pruning & Surface Contrast
- [x] **Projects Section**:
  - Hapus import dan komponen `ProjectGrid` dari `src/components/sections/projects/index.tsx`.
  - Hanya tampilkan `ProjectSlider` (carousel horizontal proyek unggulan).
- [x] **Bottom CTA Banner**:
  - Hapus komponen `<CTA />` dari `src/app/(site)/[locale]/page.tsx`.
- [x] **Surface Contrast Differentiation**:
  - Berikan styling background elevasi (`bg-[#111622]` / `border-t border-white/10`) pada container section `ExperiencePreview` dan `FeaturedCertificates` agar kontras secara visual dari kanvas utama.

---

## Phase 5: Image Sequence Scroll Animation
- [x] Buat komponen canvas sequence `src/components/motion/image-sequence-canvas.tsx`:
  - Canvas 2D dengan aspect-ratio cover dan `devicePixelRatio` scaling.
  - Preloader asinkron dengan prioritas pada frame awal.
  - Scrubbing frame dikendalikan oleh posisi progres scroll (`useScroll`).
- [x] Pasang komponen sequence canvas di antara Hero dan Featured Projects pada Home page.

---

## Phase 6: Smart Scroll-Snapping Behavior
- [x] Buat custom hook `src/hooks/use-smart-scroll-snap.ts`:
  - Pasang `scroll-snap-type: y proximity` pada root scroll container.
  - Gunakan `ResizeObserver` untuk mendeteksi tinggi section secara otomatis.
  - Jika section memiliki tinggi `> 100vh * 1.08` (seperti daftar Tech Stack atau Certificates panjang), nonaktifkan snap (`scroll-snap-align: none`) agar scrolling berjalan bebas tanpa trapping.
  - Matikan snapping secara otomatis saat `prefers-reduced-motion` aktif.
- [x] Pasangkan hook pada layout root atau wrapper section utama.

---

## Phase 7: About Page (`/about`) Overhaul
- [x] Migrasikan asset `docs/Foto Orang/foto 2.png` (cutout kemeja hitam Teknik Informatika) ke `public/assets/dimas-about.png` atau pipeline Sanity.
- [x] Rancang ulang `src/components/sections/about/about-hero.tsx`:
  - Hapus avatar kecil berbingkai lingkaran/kartu di bagian tengah.
  - Buat layout 2-kolom borderless side-by-side:
    - **Kolom Kiri**: Foto portrait cutout besar (`foto 2.png`) borderless dengan subtle bottom mask gradient.
    - **Kolom Kanan**: Eyebrow `01 // About Me`, headline nama, sub-headline akademik, action buttons (CV & Connect), dan blok narasi *"My Story"* lengkap dengan *clickable keyword pills* interaktif.
- [x] Pastikan section Tech Stack ("The technologies I use every day") panjang memiliki tag `data-snap="free"` agar dapat di-scroll natural secara bebas.

---

## Phase 8: Verification & QA
- [x] Jalankan unit test (`pnpm test`) untuk memastikan kamus i18n dan logika tidak terganggu.
- [x] Jalankan lint & typecheck (`pnpm lint`).
- [x] Gunakan **Playwright MCP** untuk verifikasi tampilan visual di desktop (1440x900) dan mobile (390x844) pada rute `/en` dan `/en/about`.
