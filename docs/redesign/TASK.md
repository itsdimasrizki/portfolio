# Implementation Plan: Redesign Task Breakdown & Checklist

## Phase Overview & Roadmap

| Fase | Fokus | Estimasi Cakupan | Dependensi |
| :--- | :--- | :--- | :--- |
| **Fase 1** | Foundation, Theming & Design System | CSS variables, 7-color palette, SVG filters, Typography | Tidak ada |
| **Fase 2** | Navigation Shell & Global Overlays | Sticky pill navbar, 3D Coin-flip, Theme toggle, Mobile drawer | Fase 1 |
| **Fase 3** | Hero Section & Interactive Teaser | Split layout, Typewriter, Dog buddy, AMA modal, Teaser card | Fase 1, 2 |
| **Fase 4** | Experience & Projects Carousels | Horizontal swipe carousels, expandable plus-modals, tags | Fase 1 |
| **Fase 5** | Skills, Tech Stack & Education | Categorized skill matrices, degree accordion cards | Fase 1 |
| **Fase 6** | Contact & Entertainment Experience | Spotify player tabs, quote block, contact form, visitor count | Fase 1, 2 |
| **Fase 7** | Sanity CMS Schemas & Bilingual Data | New schemas, GROQ queries, i18n dictionaries, fallback mocks | Fase 1 - 6 |
| **Fase 8** | Playwright Multi-Viewport QA & Polish | Desktop, Tablet, Mobile visual check, console audit, unit tests | Fase 1 - 7 |

---

## Detailed Task Breakdown

### Fase 1: Foundation, Theming & Design System
- [ ] **1.1. Konfigurasi CSS Tokens & Theme Variables (`src/app/globals.css`)**
  - Definisikan canvas background gelap (`#0d0d12`), card background (`#161a23`), dan batas kontras halus.
  - Definisikan 7 palet warna aksen dinamis (`#ffd460` Amber, `#8b5cf6` Violet, `#06b6d4` Cyan, `#10b981` Emerald, `#f97316` Orange, `#f43f5e` Rose, `#ef4444` Crimson).
  - Definisikan keyframe animasi: `sayhiWave`, `waterSlosh`, `pickerPop`, `modalLiquidExpand`, `avatarBounce`.
- [ ] **1.2. Pemasangan SVG Filters Fisik Cairan (`src/components/effects/svg-filters.tsx`)**
  - Implementasikan SVG filter `#navGoo` (`feGaussianBlur` + `feColorMatrix`).
  - Implementasikan filter `#glassDistortion` dan kanvas lensa pembiasan air.
  - Pasang komponen filter di `src/app/(site)/[locale]/layout.tsx`.
- [ ] **1.3. Accent Color State Management (`src/context/accent-color-context.tsx`)**
  - Buat `AccentColorProvider` untuk membaca/menulis aksen terpilih ke `localStorage`.
  - Pasang script pencegah flash styling di `<head>`.
  - Sediakan hook `useAccentColor()` untuk membaca warna aktif di komponen UI.
- [ ] **1.4. Typography & Font Setup (`src/app/(site)/[locale]/layout.tsx`)**
  - Pastikan `Space Grotesk` (headings/tech), `Plus Jakarta Sans` / `Geist` (body/UI), `Silkscreen` (terminal), dan `Sacramento` (handwritten cursive) dimuat optimal.

---

### Fase 2: Navigation Shell & Global Overlays
- [ ] **2.1. 3D Coin-Flip Logo (`src/components/layout/logo-coin.tsx`)**
  - Buat elemen logo berbentuk koin dengan front face (Logo monogram) dan back face (Foto profil avatar).
  - Tambahkan animasi CSS 3D transform flip 180° saat hover dan focus.
- [ ] **2.2. "Say Hi" Wave Badge (`src/components/layout/say-hi-badge.tsx`)**
  - Buat tombol badge pill dengan ikon melambai looping `sayhiWave`.
  - Tambahkan aksi smooth scroll ke section contact saat diklik.
- [ ] **2.3. Liquid Water Theme Toggle (`src/components/layout/liquid-theme-toggle.tsx`)**
  - Buat tombol toggle tema dengan efek bola air bergoyang (`waterSlosh`).
  - Integrasikan pergantian kelas `.dark` pada elemen root document.
- [ ] **2.4. 7-Accent Color Swatch Popover (`src/components/layout/accent-swatch-picker.tsx`)**
  - Buat tombol chevron pemilih aksen dengan popover horizontal 7 lingkaran warna.
  - Tambahkan active checkmark / border glow pada aksen yang sedang aktif.
- [ ] **2.5. Water-Lens "Get In Touch" Button (`src/components/layout/water-lens-button.tsx`)**
  - Implementasikan kanvas 2D mini pembiasan air di latar belakang tombol saat cursor mendekat.
- [ ] **2.6. Responsive Sticky Pill Navbar Assembly (`src/components/layout/navbar.tsx`)**
  - Rakit seluruh komponen navbar dalam wadah glassmorphic sticky pill.
  - Tambahkan toggle hamburger mobile (`checkbox4`) dan drawer layar penuh responsif.

---

### Fase 3: Hero Section & Interactive Showcase
- [ ] **3.1. Terminal Typewriter & Greeting Header (`src/components/sections/hero/hero-console.tsx`)**
  - Monospace prefix terminal: `> npm start` lalu baris berkedip `| , I am [Name]`.
  - Headline besar tebal: "I build things".
  - Subtitle role rotator dinamis.
  - Paragraf ringkas bio personal dan spesialisasi domain.
- [ ] **3.2. Action Buttons Trio (`src/components/sections/hero/hero-actions.tsx`)**
  - Tombol 1: `[Resume]` (Akses CV langsung).
  - Tombol 2: `[Pet the dog]` maskot anjing mini interaktif (`dog-buddy`) dengan animasi GIF dan ekspresi reaktif.
  - Tombol 3: `[Ask me anything]` launcher AI assistant.
- [ ] **3.3. Interactive AI Assistant Modal (`src/components/modals/ai-chat-modal.tsx`)**
  - Dialog pop-up interaktif bertema cybernetic.
  - Chip pertanyaan sampel: *"What projects have you worked on?"*, *"Why should I hire you?"*, *"Play a game"*.
  - Input obrolan interaktif dengan respon simulasi natural language seputar profil pemilik situs.
- [ ] **3.4. "Currently Building" Teaser Card (`src/components/sections/hero/currently-building-card.tsx`)**
  - Kartu showcase proyek aktif (seperti REEDL pada yashahire.info) dengan mockup viewport mini, live status pulse badge, dan direct links.
- [ ] **3.5. Recommendations / Social Proof Slider (`src/components/sections/hero/recommendations-slider.tsx`)**
  - Slider testimonial kolega dari LinkedIn dengan kontrol pagination panah prev/next dan tautan profil LinkedIn.
- [ ] **3.6. Hero Asymmetric Split Grid Layout (`src/components/sections/hero/index.tsx`)**
  - Gabungkan kolom kiri (Console + Bio + Action Trio) dan kolom kanan (Currently Building + Recommendations) dalam grid responsif 12-kolom.

---

### Fase 4: Interactive Experience & Projects Carousels
- [ ] **4.1. Experience Swipeable Carousel (`src/components/sections/experience/experience-carousel.tsx`)**
  - Container carousel swipeable dengan kontrol panah kiri/kanan dan indikator dots.
  - Latar kartu dihiasi SVG gradient khusus yang unik per perusahaan.
  - Header kartu: Logo/nama perusahaan, jabatan, status (Full Time/Contract), periode, dan lokasi.
  - Tombol `[+]` (*mini-plus-btn*) untuk membuka rincian capaian kerja (bullet points).
  - Tag teknologi terstruktur di bagian bawah kartu.
- [ ] **4.2. Featured Projects Showcase (`src/components/sections/projects/projects-showcase.tsx`)**
  - Kartu proyek dengan status badges: `FEATURED · LIVE`, `RESEARCH PROJECT`, `PRODUCTION`.
  - Preview mockup visual aplikasi.
  - Deskripsi arsitektur teknis dan tantangan rekayasa.
  - Tombol `[+]` yang membuka drawer modal studi kasus mendalam.
  - Tautan langsung `[Visit Site ↗]` dan `[GitHub ↗]`.

---

### Fase 5: Skills, Tech Stack & Education
- [ ] **5.1. Categorized Skills Matrix (`src/components/sections/about/tech-stack.tsx`)**
  - Pengelompokan: Languages, Frontend/Mobile, Backend/AI, Cloud/DevOps, Database, IoT/Hardware.
  - Kartu skill interaktif dengan level kemahiran dan detail kemampuan (*"Expert · strict typing..."*).
- [ ] **5.2. Education Accordion Cards (`src/components/sections/education/education-card.tsx`)**
  - Kartu institusi pendidikan (Gelar, Universitas, Tahun, Lokasi).
  - Akordeon expandable untuk menampilkan daftar mata kuliah relevan (*Distributed Systems, AI, Cloud Computing*).

---

### Fase 6: Contact & Entertainment Section
- [ ] **6.1. Spotify Curated Player Widget ("Currently Vibing To") (`src/components/sections/contact/spotify-widget.tsx`)**
  - Komponen pemutar Spotify dengan 8 tombol tab track pilihan.
  - Iframe embed Spotify yang otomatis berganti saat track dipilih.
- [ ] **6.2. Interactive Personal Quote Block (`src/components/sections/contact/quote-card.tsx`)**
  - Kartu kutipan filosofi rekayasa perangkat lunak dengan tanda tangan personal bergaya tulisan tangan (Sacramento font).
- [ ] **6.3. High-Converting Contact Form (`src/components/sections/contact/contact-form.tsx`)**
  - Form modern: Name, Email, Message dengan validasi klien dan visual loading state.
  - Pengiriman pesan aman terhubung ke endpoint `/api/contact`.
- [ ] **6.4. Footer Banner, Social Links & Copy Email Widget (`src/components/layout/footer.tsx`)**
  - Banner teks tebal: "LET'S DO THIS".
  - Tautan sosial (LinkedIn, GitHub, CodePen, Awwwards).
  - Tombol "Copy Email" dengan feedback visual instan (*"Copied!"* + icon check).
  - Widget Live Visitor Counter ("Site Views: 20,696").
  - Tombol melayang "Say Hi" dan "Scroll to Top".

---

### Fase 7: Sanity CMS Schemas & Bilingual Data Integration
- [ ] **7.1. Definisi Skema Sanity Baru (`src/sanity/schemaTypes/`)**
  - Buat `recommendation.schema.ts`.
  - Buat `spotifyTrack.schema.ts`.
  - Buat `heroTeaser.schema.ts`.
  - Buat `interactiveQA.schema.ts`.
  - Daftarkan skema baru di `src/sanity/schemaTypes/index.ts`.
- [ ] **7.2. GROQ Queries & Data Services (`src/services/`)**
  - Tambahkan query untuk data testimonial, spotify tracks, dan hero teaser.
  - Sediakan fallback data statis yang kaya agar antarmuka tetap berjalan sempurna bahkan tanpa koneksi Sanity aktif.
- [ ] **7.3. Pembaruan Kamus i18n (`src/i18n/messages/`)**
  - Perbarui `en.json` dan `id.json` dengan string antarmuka baru untuk semua tombol, label, placeholder, dan tooltip.

---

### Fase 8: Verification & Playwright Automated QA
- [ ] **8.1. TypeScript & Lint Validation**
  - Jalankan `pnpm tsc --noEmit` untuk memastikan 0 type error.
  - Jalankan `pnpm lint` untuk memvalidasi standar kode.
- [ ] **8.2. Multi-Viewport Playwright Visual Audit**
  - Uji tampilan Desktop (1440 x 900).
  - Uji tampilan Tablet (768 x 1024).
  - Uji tampilan Mobile (390 x 844).
  - Verifikasi bahwa tidak ada horizontal layout overflow (`overflow-x`).
- [ ] **8.3. Interactive Feature Flow Testing**
  - Uji klik 3D Coin-flip logo.
  - Uji klik maskot anjing ("Pet the dog").
  - Uji buka/tutup modal AI Assistant ("Ask me anything") dan coba kirim pesan sampel.
  - Uji ganti ke-7 warna aksen dan pastikan CSS variables teraplikasi ke elemen UI.
  - Uji interaksi tombol switch dark/light mode.
  - Uji ganti tab lagu di Spotify widget.
  - Uji salin email ke clipboard dan verifikasi teks "Copied!".
- [ ] **8.4. Unit Test Suite Regression Check**
  - Jalankan `pnpm test` untuk memastikan 43 unit tests yang ada tetap 100% lulus.
