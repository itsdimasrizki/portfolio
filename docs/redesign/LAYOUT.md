# Layout Specification: Yash Ahire Inspired Structure

## 1. Global Page Layout & Responsive Architecture

Website dirancang sebagai **Single Page Application dengan Deep-Link Anchors** yang mulus (`smooth scrolling`), dilengkapi dukungan bilingual routing Next.js App Router (`/[locale]`).

```
+-------------------------------------------------------------------------+
| [NAVBAR] Floating Pill / Fixed Header (Logo Coin | Links | Theme/Colors)|
+-------------------------------------------------------------------------+
| [HERO SECTION]                                                          |
|   Left Column (60%):                               Right Column (40%):  |
|   - Terminal Prompt ("> npm start")                 - Currently Building|
|   - Typewriter / Rotator Greeting                   - Featured Live Card|
|   - Dynamic Bio & Action Buttons (Pet dog, AMA, CV) - Testimonial Slider|
+-------------------------------------------------------------------------+
| [ABOUT SECTION]                                                         |
|   - Profile Story & Interactive Highlight Pills                         |
|   - Modal popups for deep-dive technical achievements                   |
+-------------------------------------------------------------------------+
| [EXPERIENCE SECTION]                                                    |
|   - Swipeable Carousel / Timeline Cards                                 |
|   - Expandable details (+) for metrics & stack                          |
+-------------------------------------------------------------------------+
| [PROJECTS SECTION]                                                      |
|   - Horizontal Project Slider + Pagination Dots                         |
|   - Rich Tech Tags, Live Demo links, Source Code                        |
+-------------------------------------------------------------------------+
| [SKILLS & DATA SECTION]                                                 |
|   - Categorized Matrix: Languages, Frameworks, Cloud/DB, Tools, AI/ML   |
|   - Interactive Level Badges & Visualizations Links                     |
+-------------------------------------------------------------------------+
| [EDUCATION SECTION]                                                     |
|   - Academic Institutions with Accordion Detail Nodes                   |
+-------------------------------------------------------------------------+
| [CONTACT & FOOTER SECTION]                                              |
|   - Split Layout:                                                       |
|       Left: Spotify "Currently Vibing To" Player + Quote Block          |
|       Right: Interactive Direct Message Form                            |
|   - Social Links Bar & Live Visitor Hit Counter                         |
+-------------------------------------------------------------------------+
```

---

## 2. Component Layout Breakdown

### 2.1 Floating Navbar (`#navbar`)
- **Desktop (>= 1024px)**:
  - Tinggi: `80px`, sticky di bagian atas dengan efek glassmorphism (`backdrop-filter: blur(20px)`).
  - *Kiri*: Coin-flip avatar logo + tombol badge lambaian "👋 Say hi".
  - *Tengah*: Navigation links (`Home`, `About`, `Experience`, `Projects`, `Skills`).
  - *Kanan*:
    - Theme toggle button (Dark/Light).
    - Accent color switcher dropdown (`theme-chevron` + 7 swatch circles).
    - Water-lens primary CTA button ("Get in touch").
    - Resume download icon button.
    - Bilingual Language Switcher (`EN` / `ID`).
- **Mobile (< 1024px)**:
  - Tinggi: `58px`.
  - Hamburger menu icon yang membuka animated overlay slide-down (`mobileMenu show`).

### 2.2 Hero Section (`#navbars` / `#hero`)
- **Grid Layout**: 2-Column Responsive Bento Layout (12 kolom desktop, 1 kolom mobile).
- **Left Column**:
  - `Console Badge`: Teks mono dengan kursor blink `> npm start` atau localized greeting.
  - `Hero Heading`: Teks besar nama profil ("I am [Name]. I build things").
  - `Hero Bio`: Paragraf deskriptif ringkas tentang keahlian full-stack, AI engineering, dan arsitektur sistem.
  - `Action Row`: Tombol Resume/CV, tombol interaktif "Pet the Dog" (anjing virtual animasi), dan tombol AI search "Ask me anything".
- **Right Column**:
  - `Currently Building Card`: Showcase proyek unggulan aktif dengan mock browser header, tag status `Live`, deskripsi arsitektur, dan tech chips.
  - `Testimonials / Recommendations Slider`: Carousel rekomendasi sejawat/klien dengan kontrol panah dan tombol "View all recommendations".

### 2.3 About Section (`#about`)
- Latar kartu bento terisolasi dengan padding lega (`padding: 48px 40px`).
- Paragraf naratif dengan *interactive clickable keyword pills* (misal: "Full-stack + AI", "Mission Critical", "Cloud Architecture") yang saat diklik menampilkan detail popup modal.

### 2.4 Experience Section (`#expMain`)
- Slider horizontal interaktif (menggunakan Framer Motion drag/swipe atau control buttons `Prev` / `Next`).
- Tiap kartu pengalaman memuat:
  - Logo institusi/perusahaan dalam shape kontras.
  - Jabatan, nama institusi, tipe kontrak (`Full Time`, `Internship`, `Academic`).
  - Rentang tanggal & lokasi.
  - Ringkasan pencapaian terukur dengan tombol expandable `+` untuk deskripsi mendalam.

### 2.5 Projects Section (`#projectMain`)
- Layout featured slider dengan tombol panah melayang di kiri dan kanan (`proj-arrow-left`, `proj-arrow-right`) serta pagination dots.
- Setiap slide menyajikan:
  - Status badge (e.g., `Featured · Live`, `Research Project`).
  - Judul proyek besar.
  - Narasi tantangan teknis & solusi.
  - Galeri screenshot responsif.
  - Tech stack pill matrix.
  - Tombol aksi eksternal (`Visit Site`, `GitHub`, `Case Study`).

### 2.6 Skills & Tech Stack Section (`#skills`)
- Grid 5-kolom atau multi-kolom yang rapi:
  1. *Languages* (TypeScript, JavaScript, Python, Go, SQL).
  2. *Frameworks* (Next.js, React, Node.js, NestJS, Tailwind).
  3. *Cloud & Database* (AWS, PostgreSQL, Supabase, Docker).
  4. *Tools & DevOps* (Git, Linux, CI/CD, Figma).
  5. *AI & Machine Learning* (Claude, OpenAI, LangChain, RAG, pgvector, MCP).
- Setiap item skill menyertakan level kemahiran dan keterangan spesifik.

### 2.7 Education Section (`#education`)
- Timeline kartu edukasi akademik dengan expandable sub-kursus (mata kuliah inti, penelitian, dan penghargaan).

### 2.8 Contact & Footer Section (`#contact`)
- **Split Container (50/50)**:
  - *Sisi Kiri*:
    - **Currently Vibing To (Spotify Widget)**: Embed Spotify player interaktif dengan 8 pilihan track switcher dinamis.
    - **Philosophical Quote Block**: Blok kutipan berformat serif/script berkelas dengan tanda kutip raksasa.
  - *Sisi Kanan*:
    - **Direct Message Form**: Form kontak ringkas dengan validasi instan (Nama, Email, Pesan, Tombol Send).
- **Footer Bottom Bar**:
  - Copyright & credit pengembang.
  - Indikator Counter Kunjungan Halaman ("Site Views").
  - Tautan media sosial (LinkedIn, GitHub, Email, dll.).
