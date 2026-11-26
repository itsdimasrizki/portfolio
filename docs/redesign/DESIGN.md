# Design Specification: Compact Neo-Brutalist & Split-Center Overhaul

## 1. Executive Summary & Design Vision
Dokumen ini mendefinisikan pedoman desain visual, hierarki antarmuka, dan sistem interaksi baru untuk perombakan portfolio Dimas Rizki Ardiansyah (`dimasrizkiportofolio.vercel.app`). 

Arah desain baru ini berfokus pada **Unslop & High-Craft Restraint** (mengikuti prinsip `/skill:unslop` dan `/skill:impeccable`):
1. **Unslop Chrome & Quiet Elegance**: Mengeliminasi widget yang membuat antarmuka terasa ramai/berantakan (*cluttered*), seperti kartu widget hero duplikat, tombol aksi bertumpuk di navbar, dan dekorasi berlebih. Navigasi dibuat tenang dan terarah (*quiet chrome*).
2. **Split-Center Composition (Hero Home)**: Subjek foto portrait berjas hijau cutout menunjuk (`foto 1.png`) menjadi jangkar visual utama di tengah layar, diapit tipografi nama dan ringkasan kemampuan secara asimetris.
3. **Borderless Side-by-Side (Hero About)**: Menghilangkan avatar berbingkai kecil, digantikan oleh portrait cutout besar kemeja hitam (`foto 2.png`) yang menyatu dengan kanvas tanpa border, berdampingan langsung dengan narasi *My Story*.
4. **Surface Contrast & Depth Hierarchy**: Membedakan kontras latar permukaan antara area animasi canvas utama dan kartu section konten (*Experience* & *Featured Certificates*).
5. **Compact Vertical Rhythm**: Memangkas padding/margin vertikal antar-section secara drastis untuk alur bacaan yang padat, berbobot, dan menyatu.

---

## 2. Color System & Surface Contrast Tokens

Sistem warna menerapkan **Dark-Mode Obsidian Canvas** dengan diferensiasi kontras surface yang tegas untuk membedakan section interaktif dari latar canvas sequence.

### 2.1 Base Canvas & Surface Elevation Tokens

| Token | Nilai Hex / HSL | Peran & Penggunaan |
| :--- | :--- | :--- |
| `--bg-canvas` (`--background`) | `#090b0e` | Obsidian void kanvas utama, latar belakang sequence scroll |
| `--bg-surface-elevated` | `#111622` | Kontras latar belakang khusus kartu *Experience* & *Certificates* |
| `--bg-card` (`--card`) | `#151b26` | Permukaan kartu, popover, dialog, floating pill navbar |
| `--bg-card-hover` | `#1c2433` | Status hover pada elemen interaktif kartu |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Garis pemisah tipis 1px, pembatas kartu |
| `--border-contrast` | `rgba(255, 255, 255, 0.16)` | Border atas (*top highlight line*) pada section elevated |
| `--text-primary` | `#f8fafc` | Heading utama, nama hero, teks kontras tinggi (98% lightness) |
| `--text-secondary` | `#94a3b8` | Subtitle, body text narasi, deskripsi proyek |
| `--text-muted` | `#64748b` | Monospace tags, status metadata, angka urutan section |

### 2.2 Accent System (Dynamic 7-Palette)
Aksen aktif tetap terhubung ke sistem dinamis (`AccentProvider`) dengan satu warna aksen terkalibrasi tinggi kontrasnya terhadap background obsidian:
- **Default Accent (Amber/Gold)**: Primary `#ffd460`, Glow `rgba(255, 212, 96, 0.20)`
- Aturan Penggunaan: Aksen hanya dipakai pada status aktif, link hover halus, indikator bullet slider aktif, dan tombol CTA primer. Dilarang menggunakan gradient teks berlebih atau glow menyebar liar di seluruh layar.

---

## 3. Typography & Micro-Hierarchy

Kombinasi tipografi dirancang presisi mengikuti standar editorial modern:
- **Display / Heading**: `Space Grotesk` (Weight 600, 700), tracking tight (`-0.03em`).
- **Body & UI**: `Plus Jakarta Sans` / `Geist Sans` (Weight 400, 500, 600), line-height `1.5` - `1.6`.
- **Technical & Microcopy**: `JetBrains Mono` / `Silkscreen` (Weight 400), tracking `0.05em`, uppercase untuk label teknis.

### Skala Tipografi Terkalibrasi
- **Hero Main Title**: `clamp(2.5rem, 5.5vw, 4.5rem)`
- **Section Heading**: `clamp(1.5rem, 3.2vw, 2.25rem)`
- **Card Title**: `1.125rem - 1.25rem`
- **Body Copy**: `0.9375rem - 1rem`
- **Micro Badge / Metadata**: `0.75rem` (12px)

---

## 4. Spacing System (Compact Vertical Rhythm)

Whitespace antar-section yang sebelumnya mencapai `py-20 lg:py-32` dipangkas untuk menciptakan ritme bacaan yang rapat:
- **Section Vertical Padding**:
  - Standar Desktop: `py-10 lg:py-14` (pengurangan ~55% dari sebelumnya).
  - Mobile: `py-8`.
- **Gap Antar Elemen Grid**:
  - Kolom Hero: `gap-6 lg:gap-8` (sebelumnya `gap-12`).
  - Container Max-Width: `max-w-6xl` dengan padding horizontal `px-4 sm:px-6 lg:px-8`.

---

## 5. Interaction Mechanics & Motion Language

### 5.1 Image Sequence Scroll Animation
- Menggantikan animasi scroll pasif dengan **Image Sequence Canvas Scrubbing**.
- Sumbu vertikal scroll mengendalikan frame scrubbing secara deterministik dari `0` sampai `N-1`.
- Canvas dirender dengan GPU hardware acceleration via `<canvas>` 2D context / `ImageBitmap`.

### 5.2 Smart Scroll-Snapping Behavior
- Viewport secara cerdas mengunci (*docking*) ke batas awal section saat kecepatan scroll melambat (`scroll-snap-type: y proximity`).
- **Pengecualian Panjang Konten**: Section dengan tinggi konten `> 100vh` (misalnya daftar teknologi / skill di `/about`) secara dinamis menonaktifkan snapping (`scroll-snap-align: none`) agar pengguna bebas scrolling tanpa tersentak atau terperangkap.

### 5.3 Micro-Interactions
- Smooth spring transitions pada navigation link highlight.
- Expandable drawer / modal untuk detail mendalam tanpa mengorbankan kepadatan layout utama.
