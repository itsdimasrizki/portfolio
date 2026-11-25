# Design Specification: Yash Ahire Inspired Overhaul

## 1. Executive Summary & Design Philosophy
Dokumen ini mendefinisikan pedoman desain visual, identitas antarmuka, dan sistem micro-interaction untuk mendesain ulang portfolio website. Referensi utama mengacu pada analisis langsung situs **[Yash Ahire](https://yashahire.info/)** menggunakan Playwright MCP serta rekaman layar `yashahire.webm`.

Filosofi desain ini menggabungkan dua karakteristik utama:
1. **Industrial High-Tech / Cybernetic Minimalist**: Latar belakang obsidian void gelap yang bersih, tipografi monospace/grotesk yang tajam, dan struktur bento grid yang teratur.
2. **Tactile & Playful Micro-Interactions**: Pengalaman web modern yang interaktif, organik, dan menyenangkan melalui sentuhan liquid/water droplet, 3D coin-flip avatar, interactive dog companion ("Pet the Dog"), personal AI conversational launcher ("Ask me anything"), audio player Spotify ("Currently Vibing To"), serta switcher 7-aksen warna dinamis.

---

## 2. Color System & Theming Tokens

Sistem warna menerapkan pendekatan **Dark-Mode First** dengan dukungan Light-Mode, diperkaya dengan **7-Accent Color Switcher** yang dapat dipilih pengguna secara instan dan disimpan di `localStorage`.

### 2.1 Base Canvas & Surface Tokens

| Token | Dark Mode (Default) | Light Mode | Penggunaan |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#090b0e` | `#f7fafc` | Kanvas latar belakang utama halaman |
| `--bg-secondary` | `#11151c` | `#edf2f7` | Latar kartu (card surface), dialog, drawer |
| `--bg-tertiary` | `#1e2634` | `#e2e8f0` | Border hover, active states, chips latar |
| `--text-primary` | `#ffffff` / `#f8fafc` | `#0f172a` | Judul utama, heading, active text |
| `--text-secondary` | `#94a3b8` / `#cbd5e1` | `#475569` | Body text, deskripsi, subheadings |
| `--text-muted` | `#64748b` / `#9e9c9c66`| `#94a3b8` | Metadata, tanggal, copyright, disabled |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` | Garis batas kartu, separator, badge border |
| `--border-hover` | `var(--accent-primary)` | `var(--accent-primary)` | Glow border saat elemen di-hover |

### 2.2 The 7-Accent Dynamic Palette System
Pengguna dapat memilih aksen aktif melalui color picker di navbar (`theme-chevron`). Aksen ini mengontrol warna primer tombol, border glow, highlight text, typing caret, dan dot indikator slider.

1. **Gold / Amber (Default Dark)**: `#ffd460` (Secondary: `#f6ad55`, Glow: `rgba(255, 212, 96, 0.25)`)
2. **Cyber Violet**: `#8b5cf6` (Secondary: `#a78bfa`, Glow: `rgba(139, 92, 246, 0.25)`)
3. **Neon Cyan**: `#06b6d4` (Secondary: `#22d3ee`, Glow: `rgba(6, 182, 212, 0.25)`)
4. **Emerald Matrix**: `#10b981` (Secondary: `#34d399`, Glow: `rgba(16, 185, 129, 0.25)`)
5. **Solar Orange**: `#f97316` (Secondary: `#fb923c`, Glow: `rgba(249, 115, 22, 0.25)`)
6. **Electric Rose**: `#f43f5e` (Secondary: `#fb7185`, Glow: `rgba(244, 63, 94, 0.25)`)
7. **Crimson Red**: `#ef4444` (Secondary: `#f87171`, Glow: `rgba(239, 68, 68, 0.25)`)

---

## 3. Typography Hierarchy

Kombinasi 3 font untuk menciptakan harmoni antara presisi teknis, keterbacaan modern, dan sentuhan personal:

| Role | Font Family | Weight | Fallback | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Headings** | `Space Grotesk` | 400, 500, 700 | `system-ui, sans-serif` | H1-H3, nama profil, nama proyek, tag tech |
| **UI & Body Copy** | `Geist` | 400, 500, 600 | `ui-sans-serif, system-ui, sans-serif` | Deskripsi, navigasi, form input, paragraf |
| **Pixel / Terminal** | `Silkscreen` | 400 | `monospace` | Terminal prompt, status badge, pixel accents |
| **Handwritten Accent** | *(planned — belum dimuat)* | — | `cursive` | Tanda tangan personal, quote signature |

### Skala Tipografi
- **Hero Title**: `clamp(2.5rem, 6vw, 4.25rem)` — Bold, tight tracking (`tracking-tight`), text-gradient atau solid white.
- **Section Heading**: `clamp(1.75rem, 4vw, 2.75rem)` — Space Grotesk 700 dengan aksen dekoratif badge.
- **Card Title**: `1.25rem - 1.5rem` — Space Grotesk 600.
- **Body Regular**: `0.9375rem - 1rem` (`15px - 16px`), line-height `1.65`.
- **Micro Metadata**: `0.75rem - 0.8125rem` (`12px - 13px`), uppercase, tracking `0.05em`.

---

## 4. Glassmorphism, Organic Shaders & SVG Filters

Situs referensi Yash Ahire menggunakan SVG filter internal yang disematkan langsung di root HTML untuk menciptakan efek fisik cairan (water/gooey):

### 4.1 Filter Definitions (Embedded SVG)
1. **`#navGoo` (Gooey Fluid Effect)**:
   - `feGaussianBlur` (`stdDeviation="6"`) + `feColorMatrix` (`mode="matrix"` dengan kontras alfa tinggi `values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"`) + `feComposite`.
   - Menghasilkan transisi fusi saat tombol meluncur atau elemen bergabung.
2. **`#waterLens` & `#waterRipple` (Glass Refraction)**:
   - Digunakan pada tombol "Get in touch" dan switch mode: Kanvas 2D mini (`water-lens-canvas`) yang menghitung distorsi indeks bias lensa cembung air secara real-time saat kursor mendekat.
3. **Pill Blur & Backdrop**:
   - `backdrop-filter: blur(24px) saturate(180%)` dengan background semi-transparan `rgba(13, 13, 18, 0.75)`.

---

## 5. Signature Micro-Interactions & Delight Features

1. **3D Coin-Flip Avatar Logo**:
   - Logo berbentuk koin sirkular di kiri navbar.
   - Sisi Depan: Monogram / Logo grafis.
   - Sisi Belakang: Foto profil portrait.
   - Interaksi: Rotasi 3D 180 derajat (`transform: rotateY(180deg)`) dengan efek easing mulus saat di-hover atau di-klik.
2. **"Say Hi" Wave Badge**:
   - Tombol badge di sebelah logo dengan ikon tangan melambai (`👋`) yang memiliki animasi keyframe looping `sayhiWave`. Mengklik tombol ini otomatis memicu scroll mulus ke form kontak atau membuka email client.
3. **Liquid Theme Toggle**:
   - Toggle tema dengan animasi bola air (`theme-bubble__ball` & `theme-bubble__water`) yang bergelombang saat status dark/light berganti (`waterSlosh`).
4. **Interactive Companion ("Pet the Dog")**:
   - Widget karakter anjing interaktif (`dog-buddy`) di area Hero.
   - Dilengkapi animasi GIF menggemaskan, efek bounce saat disentuh kursor, dan tooltip dinamis `"PET THE DOG"` yang berganti ekspresi saat diklik.
5. **AI Assistant Launcher ("Ask Me Anything")**:
   - Pill interaktif dengan ikon robot AI di hero section.
   - Membuka modal drawer full-featured berisi:
     - Preset chip pertanyaan cepat (misal: *"What projects have you worked on?"*, *"Why should I hire you?"*, *"Play a game"*).
     - Input chat interaktif dengan simulated natural language response mengenai latar belakang teknis pemilik portofolio.
6. **Featured Teaser Card ("Currently Building")**:
   - Kartu preview aplikasi yang sedang dikembangkan secara aktif (mirip card REEDL pada yashahire.info) dengan mockup viewport mini, status LIVE pulsing dot, tag teknologi, dan direct link.
7. **Recommendations / Social Proof Carousel**:
   - Slider testimonial profesional dari kolega/atasan dengan kontrol navigasi prev/next dan link langsung ke rekomendasi LinkedIn.
8. **Spotify Live Player Widget ("Currently Vibing To")**:
   - Terletak di atas form kontak di section footer.
   - Berisi daftar 8 preset trek musik kurasi favorit, tab selektor track, dan iframe player embed interaktif.
9. **Copy Email with Visual Feedback**:
   - Tombol "Copy email" di samping tombol kirim email.
   - Memberikan transisi state instan: icon berubah ke checkmark (`✓`) dan teks berubah menjadi `"Copied!"` selama 2 detik.
10. **Live Visitor Counter Widget**:
    - Terintegrasi di footer samping copyright. ⏳ *Planned — endpoint `/api/views` belum dibangun; tampilkan placeholder atau hilangkan sampai diimplementasikan.*

---

## 6. Accessibility & Motion Guidelines

- **Prefers Reduced Motion**: Setiap animasi Framer Motion dan CSS keyframes wajib menghormati `prefers-reduced-motion: reduce`.
- **Keyboard Navigation**: Semua elemen interaktif (coin flip, swatch buttons, dog buddy, carousel controls) memiliki state `:focus-visible` dengan outline aksen 2px.
- **Color Contrast**: Rasio kontras teks primer terhadap latar belakang selalu memenuhi standar WCAG AA (minimal 4.5:1 untuk teks normal, 3:1 untuk teks besar).

---

## 7. External Assets & Sourcing Policy (Internet / 3D / Media)

Untuk menjaga hasil visual tetap luwes, organik, dan tidak terkesan kaku akibat pemaksaan komputasi kode (*over-engineered generative code*), diberlakukan kebijakan eksplisit:
1. **Asset Sourcing Authorization**:
   - Diizinkan penuh untuk mencari, menautkan (link CDN), atau mengunduh langsung asset visual berkualitas dari internet jika upaya generate via code CSS/SVG/Canvas dinilai kaku atau rumit.
   - Berlaku untuk: file model/mesh 3D (GLTF/GLB/Spline), animasi GIF (seperti maskot `dog.gif`), asset PNG/SVG terisolasi (ikon khusus, watermark, tekstur grain, coin badge), atau elemen visual audio/mockup.
2. **Quality & Performance Standards**:
   - Asset eksternal yang diunduh disimpan di `public/assets/` dengan kompresi optimal (WebP, optimized GIF, atau GLB terkompresi Draco).
   - Penggunaan model 3D (jika ada) wajib di-load secara dinamis (*lazy loaded / client-only*) agar tidak membebani First Contentful Paint.
