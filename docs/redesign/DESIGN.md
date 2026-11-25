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
| `--bg-primary` | `#0d0d12` / `#090b0e` | `#f7fafc` | Kanvas latar belakang utama halaman |
| `--bg-secondary` | `#161a23` / `#11151c` | `#edf2f7` | Latar kartu (card surface), dialog, drawer |
| `--bg-tertiary` | `#222838` / `#1a202c` | `#e2e8f0` | Border hover, active states, chips latar |
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
| **Display / Headings** | `Space Grotesk` | 600, 700 | `system-ui, sans-serif` | H1-H3, nama profil, nama proyek, tag tech |
| **UI & Body Copy** | `Plus Jakarta Sans` / `Geist` | 400, 500, 600 | `sans-serif` | Deskripsi, navigasi, form input, paragraf |
| **Monospace / Terminal** | `Silkscreen` / `JetBrains Mono` | 400 | `monospace` | Terminal prompt (`> npm start`), status badge |
| **Handwritten Accent** | `Sacramento` / Script | 400 | `cursive` | Tanda tangan personal, quote signature |

### Skala Tipografi
- **Hero Title**: `clamp(2.5rem, 6vw, 4.25rem)` — Bold, tight tracking (`tracking-tight`), text-gradient atau solid white.
- **Section Heading**: `clamp(1.75rem, 4vw, 2.75rem)` — Space Grotesk 700 dengan aksen dekoratif badge.
- **Card Title**: `1.25rem - 1.5rem` — Space Grotesk 600.
- **Body Regular**: `0.9375rem - 1rem` (`15px - 16px`), line-height `1.65`.
- **Micro Metadata**: `0.75rem - 0.8125rem` (`12px - 13px`), uppercase, tracking `0.05em`.

---

## 4. Glassmorphism, Organic Shaders & SVG Filters

Situs referensi memanfaatkan filter SVG tersembunyi (`<svg width="0" height="0">`) untuk memberikan efek glass dan liquid yang sangat khas:
1. `#navGoo`: `feGaussianBlur` dan `feColorMatrix` untuk menciptakan efek peleburan cairan (gooey) saat hover/klik tombol.
2. `#glassDistortion` & `#glassDistortionPanel`: `feTurbulence` dan `feDisplacementMap` untuk memberikan efek pembiasan lensa kaca pada tombol dan kartu.
3. `#waterRipple`: Efek gelombang air organik saat interaksi mouse pada water droplet canvas.

---

## 5. Micro-Interactions & Playful Elements

1. **3D Coin-Flip Logo**:
   - Avatar dua sisi (sisi depan: logo inisial monogram, sisi belakang: foto asli).
   - Efek rotasi 3D sumbu-Y (`transform: rotateY(180deg)`) dengan CSS `transform-style: preserve-3d` saat kursor mendekat atau diklik.
2. **Interactive Dog Companion ("Pet the Dog")**:
   - GIF/Canvas interaktif di bar aksi hero.
   - Saat disentuh/hover menampilkan tooltip "PET THE DOG", saat diklik memicu animasi pantul dan reaksi ekspresif.
3. **AI Dialog Launcher ("Ask me anything")**:
   - Tombol pulsing dengan icon bot/sparkles yang membuka drawer modal interaktif untuk bertanya tentang skill, tech stack, atau proyek.
4. **Currently Vibing To (Spotify Widget)**:
   - Komponen pemutar musik di area contact/footer yang menampilkan track pilihan saat ini, tombol playlist mini, dan preview audio.
5. **Interactive Project & Experience Sliders**:
   - Transisi kartu horizontal yang mulus dengan tombol navigasi melingkar, pagination dots aktif, dan tombol detail `+` yang memicu modal popup lengkap.
