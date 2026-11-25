# Multi-Agent Orchestration Framework: Roles & Execution Protocols

## 1. Overview & Principles of Collaboration
Dokumen ini mengatur pembagian tugas, spesialisasi peran, batasan kewenangan (*rules of engagement*), dan protokol komunikasi bagi para AI agent / subagents saat mengeksekusi rencana redesign portofolio yang terinspirasi dari Yash Ahire.

Setiap agent harus mematuhi prinsip inti:
1. **Evidence-Driven Implementation**: Selalu periksa kode yang ada, error log, dan verifikasi runtime sebelum dan sesudah perubahan.
2. **YAGNI & KISS**: Tulis kode paling ringkas dan modular yang menyelesaikan masalah. Jangan menambah dependency npm baru kecuali jika benar-benar esensial dan diizinkan.
3. **Strict Code & Regression Safety**: Dilarang menghapus fitur yang sudah berjalan stabil (seperti i18n dwibahasa EN/ID, integrasi Sanity CMS, test suite node test, dan PDF exporter).
4. **Mandatory UI Verification with Playwright**: Setiap perubahan UI wajib divalidasi visualnya pada 3 ukuran layar (Desktop 1440px, Tablet 768px, Mobile 390px) menggunakan Playwright MCP.

---

## 2. Specialized Agent Roles & Responsibilities

```text
+-----------------------------------------------------------------------------------------+
|                                  ORCHESTRATOR AGENT                                     |
|           Mengatur urutan eksekusi, dependensi antar-tugas, dan review integrasi         |
+-----------------------------------------------------------------------------------------+
       │                      │                      │                     │
       ▼                      ▼                      ▼                     ▼
+--------------+      +---------------+      +---------------+     +---------------+
| DESIGN       |      | SANITY & I18N |      | UI COMPONENT  |     | QA PLAYWRIGHT |
| SYSTEM AGENT |      | CONTENT AGENT |      | BUILDER AGENT |     | VERIFIER      |
+--------------+      +---------------+      +---------------+     +---------------+
       │                      │                      │                     │
       ├─ Tokens & CSS        ├─ Sanity Schemas      ├─ Navbar & Coin      └─ Viewport test
       ├─ 7-Accent Engine     ├─ GROQ Queries        ├─ Split Hero & Dog   └─ Console audit
       ├─ SVG Water Filters   ├─ en/id Dictionaries  ├─ Carousels          └─ Regressions
       └─ Font Setup          └─ Mock Data Fallback  └─ Spotify & Contact
```

### 2.1 Agent 1: `design-system-agent`
- **Tanggung Jawab**:
  - Konfigurasi token warna, dark/light theme, dan 7-color dynamic accent palette di `src/app/globals.css`.
  - Pemasangan filter SVG fisik cairan (`#navGoo`, `#waterLens`, `#glassDistortion`) di root layout.
  - Pembuatan context provider `AccentColorContext` untuk menyimpan state aksen terpilih di `localStorage` dan menginjeksi variabel CSS `--accent-*`.
  - Konfigurasi tipografi (`Space Grotesk`, `Plus Jakarta Sans`, `Silkscreen`, `Sacramento`).
- **Batasan**: Hanya memodifikasi file style, SVG filter, dan context provider tema. Tidak mengedit logika konten halaman.

### 2.2 Agent 2: `sanity-content-agent`
- **Tanggung Jawab**:
  - Menambahkan skema baru Sanity: `recommendation.schema.ts`, `spotifyTrack.schema.ts`, `heroTeaser.schema.ts`, dan `interactiveQA.schema.ts`.
  - Menyiapkan GROQ query dan data service di `src/services/` dengan dukungan fallback data statis jika koneksi Sanity offline.
  - Memperbarui dictionary i18n (`src/i18n/messages/en.json` dan `src/i18n/messages/id.json`) untuk seluruh string antarmuka baru.
- **Batasan**: Menjamin backward-compatibility skema lama (`project`, `experience`, `skill`, `certificate`, `siteSettings`, `pageContent`).

### 2.3 Agent 3: `ui-navbar-agent`
- **Tanggung Jawab**:
  - Membangun komponen sticky pill navbar (`src/components/layout/navbar.tsx`).
  - Mengimplementasikan 3D Coin-flip logo (`LogoCoin.tsx`) dengan rotasi 180° front/back.
  - Mengimplementasikan tombol "Say hi" dengan animasi melambai `sayhiWave`.
  - Mengimplementasikan toggle tema air (`theme-bubble__water`) dan popover swatch 7-aksen warna.
  - Mengimplementasikan efek kanvas distorsi air (`WaterLensCanvas.tsx`) pada tombol "Get in touch".
  - Membangun drawer navigasi mobile responsif.
- **Batasan**: Memastikan layout navbar tidak bergeser (*zero layout shift*) saat berganti tema atau resolusi.

### 2.4 Agent 4: `ui-hero-agent`
- **Tanggung Jawab**:
  - Membangun layout asimetris 2-kolom pada Hero (`src/components/sections/hero/`).
  - Kolom Kiri: Terminal typing prompt monospace, headline Space Grotesk, role rotator, bio naratif, dan tombol aksi (Resume, Pet the dog buddy, Ask me anything).
  - Kolom Kanan: Kartu showcase "Currently Building" (mockup mini, tag stack, pulsing live badge) dan slider testimonial rekomendasi LinkedIn.
  - Membangun interaksi maskot anjing (`DogBuddy.tsx`) dengan tooltip ekspresi.
  - Membangun modal drawer AI Assistant (`AIChatModal.tsx`) dengan preset pertanyaan cepat.
- **Batasan**: Semua animasi entrance menggunakan Framer Motion yang ringan tanpa membebani thread rendering awal.

### 2.5 Agent 5: `ui-carousels-agent` (Experience & Projects)
- **Tanggung Jawab**:
  - Merekayasa ulang tampilan Experience menjadi **Interactive Horizontal Carousel** dengan background pattern gradien khusus per kartu dan tombol ekspansi `[+]` (*mini-plus-btn*).
  - Merekayasa ulang tampilan Projects menjadi kartu interaktif dengan badge status rilis, tag teknologi mendalam, direct links, dan modal studi kasus.
  - Menjamin kelancaran interaksi drag/swipe pada perangkat layar sentuh dan mouse wheel.
- **Batasan**: Wajib menyediakan fallback tampilan vertikal yang nyaman diakses pada browser lama atau saat JavaScript dimatikan.

### 2.6 Agent 6: `ui-footer-contact-agent`
- **Tanggung Jawab**:
  - Membangun widget pemutar musik Spotify interaktif ("Currently Vibing To") dengan 8 tab lagu pilihan.
  - Membangun kartu kutipan personal (*Personal Quote Block*) dengan aksen tulisan tangan.
  - Menyempurnakan form kontak dengan validasi klien, state pengiriman, dan integrasi API `/api/contact`.
  - Mengimplementasikan banner aksen "LET'S DO THIS", social links, tombol "Copy email" dengan visual feedback checkmark, dan widget live visitor counter.
  - Mengimplementasikan tombol melayang "Say Hi" dan "Scroll to Top".
- **Batasan**: Form kontak harus bebas dari celah spam dan error handling email harus jelas.

### 2.7 Agent 7: `qa-playwright-agent`
- **Tanggung Jawab**:
  - Menguji setiap fitur yang telah dibangun menggunakan Playwright MCP.
  - Menjalankan pengujian multi-viewport:
    - Desktop: 1440 x 900
    - Tablet: 768 x 1024
    - Mobile: 390 x 844
  - Memeriksa console browser (`browser_console_messages`) untuk memastikan 0 runtime error, warning React hydration, atau layout overflow.
  - Menguji fungsionalitas interaktif: klik coin-flip, klik dog buddy, buka modal AMA, ganti 7 warna aksen, ganti track Spotify, kirim form kontak.
  - Menjalankan unit test suite (`pnpm test`) untuk memastikan semua regression test lolos.
- **Batasan**: Tidak boleh menganggap pekerjaan selesai sebelum seluruh skenario verifikasi Playwright berhasil dijalankan tanpa error.

---

## 3. Communication & Handoff Protocols

1. **Urutan Dependensi Antar Agent**:
   `design-system-agent` -> `sanity-content-agent` -> `ui-navbar-agent` -> `ui-hero-agent` -> `ui-carousels-agent` -> `ui-footer-contact-agent` -> `qa-playwright-agent`.
2. **Kriteria Handoff**:
   Setiap agent hanya boleh menyerahkan hasil kerjanya jika:
   - Kode lulus validasi TypeScript (`tsc --noEmit`).
   - Tidak ada syntax error atau import yang hilang.
   - Komponen memiliki fallback data aman (*no undefined property crash*).
