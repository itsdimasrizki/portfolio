# Multi-Agent Workflow: Yash Ahire Redesign Execution

Dokumen ini mendefinisikan pembagian peran sub-agen otomatis, dependensi antar-tugas, batasan cakupan, dan protokol komunikasi untuk mengeksekusi rencana perombakan redesign secara paralel dan terstruktur.

---

## 1. Agent Roster & Domain Responsibilities

```
                      +-----------------------------+
                      |   Orchestrator Agent (Lead) |
                      +--------------+--------------+
                                     |
       +---------------+-------------+-------------+---------------+
       |               |                           |               |
+------v-------+ +-----v-------+             +-----v-------+ +-----v-------+
| Agent 1      | | Agent 2     |             | Agent 3     | | Agent 4     |
| Theme/Tokens | | Navigation  |             | Hero/Inter- | | Sections    |
| & Foundation | | & Header UI |             | actions     | | & Sliders   |
+--------------+ +-------------+             +-------------+ +-------------+
                                                           |
                                                     +-----v-------+
                                                     | Agent 5     |
                                                     | QA & Visual |
                                                     | Playwright  |
                                                     +-------------+
```

### Agent 1: Foundation & Theme Specialist (`agent-theme`)
- **Fokus**: Variabel CSS, Provider Aksentuasi, dan Shader SVG.
- **Tugas**:
  - Membuat `AccentProvider` (state context untuk 7 warna aksen + sinkronisasi `localStorage`).
  - Menyiapkan file SVG filter (`#navGoo`, `#glassDistortion`, `#waterRipple`).
  - Memperbarui `globals.css` dengan token warna latar dan utility glassmorphism.
- **Input**: `docs/redesign/DESIGN.md`, `globals.css`.
- **Output**: Komponen theme context yang siap dipakai oleh seluruh UI.

### Agent 2: Navigation & Header Specialist (`agent-navbar`)
- **Fokus**: Komponen navigasi desktop & mobile.
- **Tugas**:
  - Membangun `coin-logo.tsx` (efek 3D flip coin avatar).
  - Mengintegrasikan swatch warna aksen dropdown di navbar.
  - Membangun menu navigasi desktop dan animasi slide-down hamburger menu mobile.
  - Memastikan integrasi Language Switcher bilingual (`en`/`id`) tetap berfungsi lancar.
- **Input**: Komponen `AccentProvider` dari Agent 1.

### Agent 3: Hero & Playful Micro-Interactions Specialist (`agent-hero`)
- **Fokus**: Area Hero 2-kolom dan elemen interaktif taktil.
- **Tugas**:
  - Mengimplementasikan prompt terminal mono (`> npm start`) dan dynamic typist greeting.
  - Membangun komponen interaktif **"Pet the Dog"** (`dog-buddy.tsx`).
  - Membangun launcher dialog **"Ask me anything"** (`ai-modal.tsx`) lengkap dengan pill opsi pertanyaan instan.
  - Membangun showcase card **"Currently Building"** dan **Testimonials Slider**.
- **Input**: Data Sanity hero/settings, komponen button dasar.

### Agent 4: Content Sections & Sliders Specialist (`agent-sections`)
- **Fokus**: Modul konten utama (About, Experience, Projects, Skills, Contact).
- **Tugas**:
  - Membangun modal kata kunci interaktif pada About section (`about-pill-modal.tsx`).
  - Mengubah tampilan Experience menjadi horizontal slider yang responsif dengan tombol expandable `+`.
  - Mengimplementasikan horizontal slider untuk Projects dengan badges live/research dan tech stack.
  - Mengelompokkan skill ke dalam matrix kategori terstruktur.
  - Membangun widget **"Currently Vibing To"** (Spotify player embed + playlist switcher) dan quote block pada Contact section.
- **Input**: Data query Sanity dari CMS, kamus i18n.

### Agent 5: QA, Playwright & Visual Verification Specialist (`agent-qa`)
- **Fokus**: Pengujian fungsionalitas, performa visual, dan kepatuhan desain.
- **Tugas**:
  - Menjalankan unit tests (`pnpm test`) untuk memastikan zero regression pada logika internal dan kamus i18n.
  - Melakukan cross-device testing menggunakan **Playwright MCP** pada resolusi desktop (1440x900) dan mobile (390x844).
  - Menguji interaktivitas (klik swatch aksen warna, toggle theme, pet dog, klik slider prev/next).
  - Memverifikasi tidak adanya console error atau warning hydration.

---

## 2. Guardrails & Quality Gates

1. **Safety First**: Tidak diperkenankan menghapus file kredensial atau merusak skema database yang sudah berjalan.
2. **Bilingual Completeness**: Setiap teks baru yang ditambahkan ke UI wajib memiliki entri terjemahan di `src/i18n/messages/en.json` dan `src/i18n/messages/id.json`.
3. **Responsive Consistency**: Semua komponen harus dites pada breakpoint mobile (390px) dan desktop (1440px) sebelum dianggap selesai.
4. **No Premature Execution**: Fase eksekusi kode baru dijalankan setelah dokumen perencanaan disetujui secara eksplisit oleh pengguna.
