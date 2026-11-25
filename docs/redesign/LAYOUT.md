# Layout Specification: Component Hierarchy & Viewport Structure

## 1. Global Viewport Architecture & Breakpoints

Situs portofolio dirancang dengan pendekatan responsif berbasis container fluid dan grid modern:

| Breakpoint | Lebar Layar | Karakteristik Layout |
| :--- | :--- | :--- |
| **Desktop Ultra** | `>= 1440px` | Max container width `1280px` / `1400px`, padding `0 48px`, split-screen hero multi-kolom |
| **Desktop / Laptop**| `1024px - 1439px` | Max container `1080px`, padding `0 32px`, balanced grid |
| **Tablet** | `768px - 1023px` | Padding `0 24px`, stacked multi-column ke 2 kolom |
| **Mobile** | `< 768px` (misal `390px` iPhone / `412px` Android) | Padding `0 16px`, single-column stacked, floating bottom controls, collapsible sheet drawer |

---

## 2. Global Sticky Pill Navbar

Navbar melayang (*floating sticky pill*) dengan efek glassmorphism tinggi, blur backdrop `24px`, dan border tipis `rgba(255, 255, 255, 0.08)`.

```text
+------------------------------------------------------------------------------------------------------------------+
| [🪙 3D Coin Logo] [👋 Say hi] | [Home] [About] [Experience] [Projects] [Skills] | [💧 Theme] [🎨 Swatches] [Touch] [CV] |
+------------------------------------------------------------------------------------------------------------------+
```

### 2.1 Elemen Komponen Navbar:
1. **Left Zone: Brand & Quick Greeting**
   - **3D Coin Logo**: Diameter 44px, efek 3D flip depan/belakang (`front: logo mark`, `back: user avatar portrait`).
   - **Say Hi Wave Badge**: Badge pil dengan animasi tangan melambai (`sayhiWave`).
2. **Center Zone: Desktop Navigation Links**
   - Pill container dengan active-indicator highlight yang meluncur halus (`framer-motion layoutId="nav-pill"`).
   - Menu items: `Home`, `About`, `Experience`, `Projects`, `Skills`.
   - Menggunakan smooth-scroll anchor link dengan offset kompensasi tinggi navbar (80px).
3. **Right Zone: System Controls & Primary CTAs**
   - **Liquid Theme Toggle**: Tombol berbentuk lingkaran dengan efek gelembung air (`waterSlosh`).
   - **Accent Swatch Picker**: Tombol chevron dropdown yang membuka popover horizontal berisi 7 lingkaran warna aksen.
   - **"Get in touch" Primary CTA**: Tombol kontras tinggi dengan efek kanvas pembiasan air (`water-lens-canvas`).
   - **"View resume" Button**: Tombol ringkas dengan ikon download dokumen.
   - **Language Switcher (Bilingual ID/EN)**: Toggle ringkas `EN | ID`.
4. **Mobile Navigation Variant (`< 768px`)**
   - Tampilan navbar menyusut ke tinggi 58px.
   - Tombol hamburger animatif di kanan (`checkbox4` toggle dengan 3 baris transform ke tanda silang).
   - Membuka drawer menu layar penuh dengan stagger animation ke tautan navigasi, toggle tema, dan tombol aksi utama.

---

## 3. Section 1: Hero & Real-Time Teaser (Above The Fold)

Layout asimetris 2-kolom pada desktop (`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`):

```text
+------------------------------------------------------+----------------------------------------------------+
| LEFT COLUMN (Col 1-7): Display & Bio                 | RIGHT COLUMN (Col 8-12): Live Teaser & Proof       |
|                                                      |                                                    |
| > npm start                                          | +------------------------------------------------+ |
| | , I am [Nama Pengguna]                             | | [FEATURED · LIVE]                     REEDL_   | |
| [Display Headline: "I build things"]                 | | +--------------------------------------------+ | |
|                                                      | | | [Live Mini Web Viewport / App Mockup]      | | |
| [Paragraph: Narrative Bio & Domain Focus]            | | +--------------------------------------------+ | |
| Banking, Healthcare, AI Agent platforms              | | Tag: Next.js · Supabase · Claude · PostgreSQL  | |
|                                                      | | Link: [Visit Live ↗] [GitHub ↗]               | |
| +--------------------------------------------------+ | +------------------------------------------------+ |
| | [📄 Resume] [🐕 Pet the Dog] [🤖 Ask Me Anything] | |                                                    |
| +--------------------------------------------------+ | +------------------------------------------------+ |
|                                                      | | [Recommendations Slider]                       | |
|                                                      | | "Great engineer, thoughtful problem-solver..." | |
|                                                      | | — Steve Gil, Product Leader    [<] [>] [All ↗] | |
|                                                      | +------------------------------------------------+ |
+------------------------------------------------------+----------------------------------------------------+
```

### Detail Elemen Hero:
1. **Left Terminal Typing**: Baris monospace bergaya konsol dengan kursor berkedip (`|`) yang menuliskan salam personal dan role rotator dinamis.
2. **Action Trio**:
   - `[Resume]`: Direct trigger untuk melihat CV atau unduh PDF.
   - `[Pet the Dog]`: Maskot anjing mini interaktif dengan animasi GIF dan ekspresi reaktif.
   - `[Ask me anything]`: Membuka modal AI chat prompt untuk pengunjung berinteraksi langsung.
3. **Right "Currently Building" Card**: Kartu bento beraksen neon dengan mockup visual interaktif, status pulsing badge, dan penjelasan arsitektur mini.
4. **Social Proof / Recommendation Slider**: Testimonial ringkas dengan kutipan nyata dari LinkedIn dan kontrol pagination panah.

---

## 4. Section 2: About & Architectural Philosophy

Fokus pada pengenalan mendalam keahlian teknis dan pendekatan rekayasa perangkat lunak:
- **Header Section**: Judul "About Me" dengan aksen garis tipis dekoratif.
- **Story Bento Grid**:
  - Kolom Utama: Narasi perjalanan karir, filosofi kode ("simplicity & reliability"), dan spesialisasi sistem produksi.
  - Kartu Metrik Ringkas: Jam terbang, jumlah proyek produksi, kontribusi open source, dan domain industri (FinTech, IoT, AI).

---

## 5. Section 3: Interactive Experience Journey

Mengadopsi format **Swipeable Timeline Carousel** yang sangat interaktif seperti pada situs Yash Ahire:

```text
+------------------------------------------------------------------------------------------------------------------+
| Section Heading: "Experience" · "Swipe through my professional journey"                        [< Prev] [Next >] |
|                                                                                                                  |
| +------------------------------------+ +------------------------------------+ +--------------------------------+ |
| | [Handtevy]             Full Time   | | [REB / WhiteCap]       Contract    | | [Tata Consultancy]   Engineer  | |
| | Software Engineer · Jan 2025 - Now | | Full-Stack Dev · 2023 - 2024       | | System Analyst · 2021 - 2023   | |
| | Miami, FL · Hybrid                 | | Charlotte, NC                      | | Pune, India                    | |
| |                                    | |                                    | |                                | |
| | Healthcare EMS mission-critical    | | Enterprise construction materials  | | Banking & financial services   | |
| | applications for pediatric care... | | supply chain real-time tracking... | | microservices architecture...  | |
| |                                    | |                                    | |                                | |
| | [+] Expand Impact Details          | | [+] Expand Impact Details          | | [+] Expand Impact Details      | |
| | Tags: React · NestJS · AWS         | | Tags: Next.js · Python · Docker    | | Tags: Java · Spring · Kafka    | |
| +------------------------------------+ +------------------------------------+ +--------------------------------+ |
|                                                                                                                  |
|                                         (●) Indikator Dot 1   (○) Dot 2   (○) Dot 3                              |
+------------------------------------------------------------------------------------------------------------------+
```

### Fitur Kunci Experience:
- Setiap kartu memiliki background SVG gradient khusus yang lembut (`exp-pat-*`).
- Tombol `[+]` (*mini-plus-btn*) yang membuka rincian pencapaian utama dan metrik kuantitatif tanpa merusak kerapian tampilan utama.
- Dukungan touch-swipe pada perangkat mobile dan mouse-drag pada desktop.

---

## 6. Section 4: Things I've Built (Featured Projects Showcase)

Penyajian proyek pilihan dengan fokus visual mendalam dan status rilis nyata:
- **Card Bento Grid**:
  - Badge Status: `FEATURED · LIVE`, `RESEARCH PROJECT`, `PRODUCTION SYSTEM`.
  - Judul Proyek dengan tipografi Space Grotesk tebal.
  - Deskripsi arsitektural singkat: tantangan rekayasa, solusi teknis, dan hasil.
  - Tag Teknologi terstruktur (Next.js, TypeScript, PostgreSQL, Claude AI, dll).
  - Aksi: Tombol `[Visit Site ↗]` dan `[GitHub ↗]`.
  - Tombol Ekspansi `[+]`: Membuka modal detail studi kasus (arsitektur sistem, skema database, diagram alur data).

---

## 7. Section 5: Skills & Tech Stack Matrix

Tampilan stack teknologi yang dikelompokkan secara terstruktur berdasarkan spesialisasi:
1. **Languages**: TypeScript, JavaScript, Python, Go, SQL, HTML/CSS.
2. **Frontend & Mobile**: React, Next.js, React Native, Tailwind CSS, Framer Motion.
3. **Backend & AI**: Node.js, NestJS, FastAPI, LangGraph, Anthropic Claude SDK, Supabase.
4. **Cloud, DevOps & Hardware/IoT**: AWS, Docker, CI/CD Actions, MQTT, ESP32, PostgreSQL, Redis.
- Setiap item skill dilengkapi dengan keterangan level/konteks (misal: *"Expert · strict typing, generics, advanced type inference"*).

---

## 8. Section 6: Education & Academic Credentials

- Format kartu akordeon bersih:
  - Gelar, Jurusan, Institusi Pendidikan, Lokasi, dan Rentang Tahun.
  - Tombol `[+]` untuk menampilkan daftar mata kuliah relevan (*Distributed Systems, Machine Learning, Data Structures*).

---

## 9. Section 7: Entertainment, Contact & Footer Experience

Bagian penutup situs yang kaya akan interaksi personal dan high-converting call-to-action:

```text
+------------------------------------------------------------------------------------------------------------------+
| Section Heading: "Get In Touch" · "Open to roles, collabs, or just a good conversation."                         |
|                                                                                                                  |
| +----------------------------------------------------+ +-------------------------------------------------------+ |
| | CURRENTLY VIBING TO (Spotify Curated Player)       | | LEAVE A NOTE (Direct Contact Form)                    | |
| | [Track 1] [Track 2] [Track 3] [Track 4] ... [Tr 8] | |                                                       | |
| | +------------------------------------------------+ | | [ Your Name              ]                            | |
| | | [🎵 Embedded Spotify Player Widget]            | | | [ your@email.com           ]                            | |
| | +------------------------------------------------+ | | [ What's on your mind?     ]                            | |
| |                                                    | |                                                       | |
| | Personal Quote Card:                               | | [ Send Message → ]                                    | |
| | "Building software that understands people is far  | |                                                       | |
| | more interesting than software that only           | |                                                       | |
| | understands code." — [Nama Pengguna]               | |                                                       | |
| +----------------------------------------------------+ +-------------------------------------------------------+ |
|                                                                                                                  |
| [ LET'S DO THIS ] Big Accent Banner                                                                              |
| Social: [LinkedIn ↗] [GitHub ↗] [CodePen ↗] [Awwwards ↗] | Email: [Send Email ↗] [📋 Copy Email]                 |
|                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------- |
| Designed & Developed with Next.js 16 & Tailwind  ·  Site Views: [ ⏳ planned ]  ·  © 2026                            |
+------------------------------------------------------------------------------------------------------------------+
```

### Floating Quick Actions:
- **Floating "Say Hi" Button**: Berada di pojok kanan bawah saat pengguna menggulir ke bawah, memicu scroll instan ke form kontak.
- **Scroll To Top Button**: Muncul halus saat scroll melewati hero section untuk kembali ke atas.
