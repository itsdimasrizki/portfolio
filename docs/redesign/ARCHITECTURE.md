# Technical Architecture: Yash Ahire Inspired Modern Stack

## 1. Core Technology Stack

Arsitektur aplikasi dibangun di atas ekosistem modern yang sudah ada di repository, dioptimalkan untuk performa tinggi, modularitas, dan aksesibilitas:

- **Framework**: **Next.js 16 (App Router)** dengan React 19.
- **Styling**: **Tailwind CSS v4** + `@tailwindcss/postcss` + CSS Variables untuk theming dinamis.
- **Motion & Interactions**: **Framer Motion v12** (animasi transisi slider, modal popups, coin flip, dan spring physics).
- **Headless CMS & Content Engine**: **Sanity CMS v5** (`@sanity/client`, `next-sanity`, live drafts & GROQ queries).
- **Internationalization (i18n)**: Bilingual routing (`/[locale]`) untuk bahasa Inggris (`en`) dan Indonesia (`id`) menggunakan struktur kamus tipe aman (`messages/*.json`).
- **Icons**: `lucide-react` & `react-icons` (FontAwesome, SimpleIcons).
- **Audio & Media**: Spotify IFrame Embed API & HTML5 Audio untuk interactive music widget.
- **E2E & Visual Testing**: **Playwright MCP** untuk verifikasi render di desktop dan mobile.

---

## 2. Dynamic Theming & Accent Provider Architecture

Untuk mendukung switcher 7 warna aksen dinamis seperti pada situs referensi, dibuat React Context provider ringan tanpa re-render yang membebani seluruh halaman:

```
+-------------------------------------------------------------+
| ThemeProvider (Dark / Light + AccentColor State)             |
|   - Sync with localStorage ("portfolio-accent", "theme")    |
|   - Injects CSS Variables to <html> element:                |
|       --accent-primary: <selected_hex>                      |
|       --accent-secondary: <selected_hex_light>              |
|       --accent-glow: <selected_rgba>                        |
+-------------------------------------------------------------+
```

### Palet CSS Variable Dinamis
```css
:root {
  --accent-primary: #ffd460;
  --accent-secondary: #f6ad55;
  --accent-glow: rgba(255, 212, 96, 0.25);
}
```
Ketika pengguna mengklik salah satu swatch warna, provider mengupdate atribut `style` pada `document.documentElement` secara instan, sehingga seluruh komponen kartu, tombol, border glow, dan badge langsung menyesuaikan warna tanpa perlu reload halaman.

---

## 3. Data Schema Enhancements (Sanity CMS)

Untuk menyuplai data ke layout baru yang kaya fitur, skema Sanity ditingkatkan dengan entitas berikut:

### 3.1 Testimonial / Recommendation Schema (`recommendation.schema.ts`)
- `name`: string
- `role`: string
- `company`: string
- `avatar`: image
- `content`: localizedText (en, id)
- `linkedInUrl`: url
- `order`: number

### 3.2 Spotify Track List Schema (`spotifyTrack.schema.ts` atau dalam `siteSettings`)
- `title`: string
- `artist`: string
- `spotifyUri`: string (track ID)
- `coverUrl`: string
- `order`: number

### 3.3 Interactive Keywords / About Pills (`aboutPill.schema.ts`)
- `label`: localizedString
- `heading`: localizedString
- `description`: localizedText
- `icon`: string

### 3.4 Experience & Education Enriched Schema
- Dukungan untuk metrik terukur (misal: "75% reduction in errors").
- Detail accordion untuk kursus dan tanggung jawab tambahan.

---

## 4. Component Hierarchy & State Isolation

```
src/
├── app/
│   ├── (site)/[locale]/
│   │   ├── layout.tsx         -> Menginjeksi ThemeProvider & AccentProvider
│   │   └── page.tsx           -> Server Component utama merender seluruh section
│   └── api/
│       ├── contact/route.ts   -> API handler form kontak
│       └── views/route.ts     -> API handler visitor view counter
├── components/
│   ├── layout/
│   │   ├── navbar.tsx         -> Glassmorphism, 3D Coin-flip, Accent Switcher
│   │   └── footer.tsx         -> Visitor counter, social links
│   ├── sections/
│   │   ├── hero/
│   │   │   ├── hero-main.tsx  -> Terminal intro + Typist
│   │   │   ├── dog-buddy.tsx  -> "Pet the dog" micro-interaction
│   │   │   ├── ai-modal.tsx   -> "Ask me anything" conversational modal
│   │   │   ├── building-card.tsx -> "Currently building" showcase
│   │   │   └── testimonial-slider.tsx -> Social proof carousel
│   │   ├── about/
│   │   │   ├── about-story.tsx
│   │   │   └── pill-modal.tsx -> Keyword detail popup
│   │   ├── experience/
│   │   │   └── experience-slider.tsx -> Swipeable timeline cards
│   │   ├── projects/
│   │   │   └── project-slider.tsx    -> Horizontal slide with deep tech specs
│   │   ├── skills/
│   │   │   └── skill-matrix.tsx      -> Categorized grid with level chips
│   │   ├── education/
│   │   │   └── education-accordion.tsx
│   │   └── contact/
│   │       ├── spotify-player.tsx    -> Interactive music widget
│   │       ├── quote-block.tsx       -> Stylized quote
│   │       └── contact-form.tsx      -> Direct message form
│   └── ui/
│       └── svg-filters.tsx    -> Filter goo, glassDistortion, waterRipple
```

---

## 5. Performance, Assets & Accessibility Strategy

1. **Selective Client Components**: Hanya komponen yang memiliki interaktivitas tinggi (slider, modal, audio switcher, coin-flip) yang menggunakan `'use client'`. Data fetching tetap dilakukan di Server Component (`page.tsx`) untuk zero layout shift dan SEO optimal.
2. **Reduced Motion**: Mendukung media query `@media (prefers-reduced-motion: reduce)` agar animasi 3D coin-flip dan particle shader beralih ke transisi statis yang halus.
3. **Optimized SVG Shaders**: Filter SVG distorsi diisolasi pada elemen interaktif spesifik untuk mencegah penurunan frame-rate (60 FPS rendering).
