# Implementation Plan: Yash Ahire Inspired Redesign

## 1. Overview & Strategy
Rencana kerja dibagi menjadi beberapa fase bertahap dengan prinsip **zero regression**: setiap fase dapat diuji secara independen, mempertahankan fungsionalitas bilingual (`en` & `id`), serta mempertahankan integrasi Sanity CMS yang sudah ada.

---

## 2. Phase Breakdown

### Phase 1: Theme & Visual Tokens Foundation
✅ - [x] Buat file provider `AccentProvider` (`src/components/theme/accent-provider.tsx`) untuk mengelola 7 warna aksen dinamis (`localStorage` sync + CSS variable injection).
✅ - [x] Perbarui `src/app/globals.css` untuk mendaftarkan variabel warna aksen, token background dark/light, dan utility glassmorphism.
✅ - [x] Buat komponen filter SVG global (`src/components/effects/svg-filters.tsx`) yang memuat filter `#navGoo`, `#glassDistortion`, dan `#waterRipple`.
✅ - [x] Pasang `AccentProvider` dan filter SVG ke dalam root layout `src/app/(site)/[locale]/layout.tsx`.

### Phase 2: Navigation Bar Redesign (`#navbar`)
✅ - [x] Buat komponen **3D Coin-Flip Logo** (`src/components/layout/coin-logo.tsx`) dengan animasi flip 180 derajat (monogram di depan, avatar di belakang).
✅ - [x] Tambahkan tombol interaktif "👋 Say hi" dengan efek wave emoji.
✅ - [x] Buat **Accent Color Picker** dropdown di navbar (`theme-chevron` + 7 palet warna).
✅ - [x] Tambahkan tombol "Get in touch" dengan efek water-lens droplet dan tombol download resume.
✅ - [x] Rapikan menu navigasi desktop dan animasi slide-down hamburger menu untuk mobile (< 1024px).

### Phase 3: Hero Section Transformation (`#hero`)
✅ - [x] Buat struktur 2-kolom responsif untuk Hero.
✅ - [x] **Kolom Kiri**:
  - Implementasikan prompt terminal kursor mono `> npm start` dan localized typewriter text.
  - Implementasikan tombol interaktif **"Pet the Dog"** (`src/components/sections/hero/dog-buddy.tsx`) dengan sprite animasi.
  - Implementasikan tombol dan modal **"Ask me anything"** (`src/components/sections/hero/ai-modal.tsx`) dengan opsi pertanyaan cepat (quick actions).
- [ ] **Kolom Kanan**:
  - Implementasikan **"Currently Building"** showcase card (`src/components/sections/hero/building-card.tsx`) dengan mock browser window header dan tag live.
  - Implementasikan **Testimonials / Recommendations Carousel** (`src/components/sections/hero/testimonial-slider.tsx`) dengan navigasi slide dan link profil.

### Phase 4: About & Experience Interactive Polish
- [ ] **About Section**:
  - Integrasikan narasi profil dengan *clickable keyword pills* ("Full-stack + AI", "Production Systems", dll.).
  - Buat komponen modal popup detail ketika pill diklik (`about-pill-modal.tsx`).
- [ ] **Experience Section**:
  - Desain ulang timeline menjadi **Horizontal Carousel / Slider** dengan tombol navigasi `Prev`/`Next` bulat dan dot indikator.
  - Tambahkan tombol ekspansi mini `+` pada tiap kartu untuk membaca metrik pencapaian lengkap tanpa memenuhi tampilan layar awal.

### Phase 5: Projects, Skills & Education Modules
- [ ] **Projects Section**:
  - Buat horizontal slider proyek unggulan lengkap dengan status badge (`Featured · Live`, `Research Project`), screenshot preview, dan tech stack chips.
  - Sediakan tombol eksternal langsung ke live demo dan repositori GitHub.
- [ ] **Skills Section**:
  - Restrukturisasi ke dalam matrix kategori yang rapi (Languages, Frameworks, Cloud & DB, Tools, AI & ML).
  - Tambahkan visual chip status kemahiran (Expert, Advanced, Intermediate) pada tiap item.
- [ ] **Education Section**:
  - Implementasikan kartu institusi akademik dengan accordion detail mata kuliah/fokus riset.

### Phase 6: Contact & Footer Module Enhancement
✅ - [x] Implementasikan widget **"Currently Vibing To"** (`spotify-player.tsx`):
  - Embed Spotify iframe player dengan daftar 8 track switcher instan.
- [ ] Implementasikan blok kutipan filosofis personal (`quote-block.tsx`).
- [ ] Desain ulang form kontak langsung dengan layout bersih dan responsif.
✅ - [x] Tambahkan indikator live page view counter pada baris copyright footer.

### Phase 7: Verification & Visual Quality Assurance
- [ ] Jalankan unit test internal (`pnpm test`) untuk memastikan kamus i18n dan logika layout tetap berfungsi 100%.
- [ ] Jalankan linting dan TypeScript check (`pnpm lint`).
- [ ] Gunakan **Playwright MCP** untuk menangkap screenshot desktop (1440x900) dan mobile (390x844), serta memvalidasi console log bersih dari error.
