# Architecture Specification: Full-Stack & System Design

## 1. System Overview & Technology Stack

Situs portofolio ini dibangun di atas arsitektur web modern dengan prinsip **Server-First**, **Zero unnecessary abstractions**, dan **Optimal Core Web Vitals**:

```text
+-----------------------------------------------------------------------------------------+
|                                 CLIENT VIEWPORT                                         |
|  [Pill Navbar] [Split Hero] [Interactive Carousels] [Spotify Widget] [AI Chat Drawer]   |
+-----------------------------------------------------------------------------------------+
                                           ▲
                                           │ Hydration & React 19 Islands
                                           ▼
+-----------------------------------------------------------------------------------------+
|                               NEXT.JS 16 APP ROUTER                                     |
|   /(site)/[locale]/page.tsx (React Server Component - Data Fetching & Initial HTML)     |
|   /api/contact (NodeMailer API)   ·   /api/views (Visitor Count)   ·   /api/revalidate  |
+-----------------------------------------------------------------------------------------+
                                           ▲
                                           │ GROQ Queries / CDN Cache
                                           ▼
+-----------------------------------------------------------------------------------------+
|                             SANITY CMS V5 (HEADLESS CMS)                                |
|   Projects · Experiences · Skills · Certificates · SiteSettings · PageContent · Tracks   |
+-----------------------------------------------------------------------------------------+
```

### 1.1 Core Technologies
- **Framework**: Next.js 16 (App Router, React Server Components).
- **Core Library**: React 19.x (Server Actions, `useOptimistic`, `useActionState`).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first configuration via `@theme inline`).
- **Animation & Micro-interactions**: Framer Motion 12 (`framer-motion`), Canvas 2D API untuk efek lensa air.
- **Content Management**: Sanity CMS v5 (`next-sanity`, `@sanity/client`, `@sanity/image-url`).
- **Language & Types**: TypeScript 5 (Strict Mode).
- **Icons**: Lucide React + React Icons (FontAwesome brands).
- **Internationalization (i18n)**: Static path generation `[locale]` (`en` & `id`) dengan type-safe dictionary lookup.

---

## 2. Directory Structure & Module Organization

Penataan modular kode di dalam `src/`:

```text
src/
├── app/
│   ├── (site)/
│   │   └── [locale]/
│   │       ├── layout.tsx                # Root site layout (fonts, providers, global SVG filters)
│   │       ├── page.tsx                  # Single-page bento layout (Hero, About, Exp, Projects, Skills, Contact)
│   │       ├── projects/page.tsx         # Dedicated full projects catalogue
│   │       ├── experience/page.tsx       # Dedicated full experience timeline
│   │       └── certificates/page.tsx     # Certificates & credentials
│   ├── (studio)/
│   │   └── studio/[[...tool]]/           # Sanity Studio embedded dashboard
│   ├── api/
│   │   ├── contact/route.ts              # Email delivery via Nodemailer
│   │   ├── views/route.ts                # ⏳ Planned, not yet built — visitor counter endpoint
│   │   └── revalidate/route.ts           # Sanity webhook on-demand cache revalidation
│   ├── favicon.ico
│   └── globals.css                       # Base Tailwind v4 styles, theme variables, custom keyframes
├── components/
│   ├── cards/                            # Reusable card primitives (ProjectCard, ExperienceCard, etc.)
│   ├── effects/                          # Fluid shaders, WaterLensCanvas, SVGGooFilters, ParticleCanvas
│   ├── layout/                           # Navbar (Pill), Footer, MobileNav, LanguageSwitcher, ThemeToggle
│   ├── modals/                           # AIChatModal ("Ask me anything"), ProjectDetailModal, ResumeViewer
│   ├── motion/                           # Framer motion wrappers (Reveal, BlurImage, MotionProvider)
│   ├── sections/                         # Feature section modules:
│   │   ├── hero/                         # HeroConsole, Typewriter, RoleRotator, DogBuddy, CurrentlyBuilding
│   │   ├── about/                        # AboutStory, TechPillMatrix, BentoStats
│   │   ├── experience/                   # ExperienceCarousel, MiniPlusDetail, TimelineIndicator
│   │   ├── projects/                     # FeaturedProjectsCarousel, ProjectTags, LiveMockupFrame
│   │   ├── skills/                       # SkillMatrixGrid, ProficiencyCategory
│   │   ├── education/                    # EducationAccordion, CourseworkChips
│   │   └── contact/                      # ContactForm, SpotifyPlayerWidget, QuoteBlock, LiveVisitorCounter
│   └── ui/                               # Atomic primitives (Button, Input, Badge, Sheet, Dialog)
├── constants/                            # Static fallbacks and navigation definitions
├── context/                              # React Context (AccentColorContext, ViewCounterContext)
├── i18n/                                 # Dictionary files (en.json, id.json) and helper functions
├── lib/                                  # Pure utility functions (utils.ts, motion.ts, lens.ts)
├── sanity/                               # Sanity schema definitions, queries, and client configurations
├── services/                             # Data service layers communicating with Sanity GROQ
└── types/                                # Domain TypeScript interfaces
```

---

## 3. Theming & Dynamic State Architecture

### 3.1 Accent Color & Dark Mode Engine
Untuk mereplikasi fitur switcher 7-aksen dan dark/light mode Yash Ahire tanpa layout shift (CLS):

```text
Browser Load
  │
  ├─ Inline Script in <head> reads 'portfolio_theme' & 'portfolio_accent' from localStorage
  ├─ Sets <html class="dark" data-accent="#ffd460"> immediately (0ms flash)
  │
React Hydration
  ├─ AccentColorProvider reads active accent
  ├─ Injects runtime CSS variables to document.documentElement:
  │    --accent-primary: #ffd460
  │    --accent-secondary: #f6ad55
  │    --accent-glow: rgba(255, 212, 96, 0.25)
  └─ UI components consume Tailwind classes using var(--accent-primary)
```

### 3.2 Dynamic Accent Colors Definition
```typescript
export interface AccentColor {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  glow: string;
}

export const ACCENT_PALETTES: AccentColor[] = [
  { id: "gold", name: "Gold / Amber", primary: "#ffd460", secondary: "#f6ad55", glow: "rgba(255, 212, 96, 0.25)" },
  { id: "violet", name: "Cyber Violet", primary: "#8b5cf6", secondary: "#a78bfa", glow: "rgba(139, 92, 246, 0.25)" },
  { id: "cyan", name: "Neon Cyan", primary: "#06b6d4", secondary: "#22d3ee", glow: "rgba(6, 182, 212, 0.25)" },
  { id: "emerald", name: "Emerald Matrix", primary: "#10b981", secondary: "#34d399", glow: "rgba(16, 185, 129, 0.25)" },
  { id: "orange", name: "Solar Orange", primary: "#f97316", secondary: "#fb923c", glow: "rgba(249, 115, 22, 0.25)" },
  { id: "rose", name: "Electric Rose", primary: "#f43f5e", secondary: "#fb7185", glow: "rgba(244, 63, 94, 0.25)" },
  { id: "red", name: "Crimson Red", primary: "#ef4444", secondary: "#f87171", glow: "rgba(239, 68, 68, 0.25)" }
];
```

---

## 4. Sanity Content Models & Schema Extensions

Untuk mendukung komponen baru yang terinspirasi dari Yash Ahire, skema Sanity ditingkatkan dengan entitas berikut:

### 4.1 Schema Penambahan Baru:
1. **`recommendation` (Testimonials & Social Proof)**:
   - `authorName`: string
   - `authorRole`: string
   - `authorCompany`: string
   - `avatar`: image
   - `quote`: localized string/text (en, id)
   - `linkedinUrl`: url
   - `order`: number
2. **`spotifyTrack` (Currently Vibing To Tracks)**:
   - `title`: string
   - `artist`: string
   - `spotifyTrackId`: string (untuk generate Spotify embed URL)
   - `order`: number
3. **`heroTeaser` (Currently Building Card)**:
   - `title`: string
   - `status`: string (e.g., "FEATURED · LIVE", "IN PROGRESS")
   - `tagline`: localized string
   - `description`: localized text
   - `technologies`: array of references to `technology`
   - `liveUrl`: url
   - `githubUrl`: url
   - `previewImage`: image
4. **`interactiveQA` (Ask Me Anything Knowledge Base)**:
   - `question`: localized string
   - `answer`: localized text
   - `category`: string (Projects, Stack, Hiring, Bio)
   - `order`: number

---

## 5. Rendering Pipeline & Performance Optimization

1. **Server-Side Data Fetching**:
   - `Home` (`src/app/(site)/[locale]/page.tsx`) mengambil semua konten di server via `Promise.all` paralel menggunakan GROQ CDN cache.
   - HTML awal ter-render lengkap untuk SEO tanpa menunggu JavaScript client.
2. **Islands of Interactivity (Client Components)**:
   - Elemen interaktif murni seperti `WaterLensCanvas`, `DogBuddy`, `AIChatModal`, `SpotifyPlayerWidget`, dan `AccentPicker` dideklarasikan sebagai `'use client'` dengan batasan scope sekecil mungkin.
3. **Dynamic Import untuk Shaders & Heavy Effects**:
   - Kanvas WebGL / filter air di-load menggunakan `next/dynamic` dengan opsi `ssr: false` agar tidak menghambat First Contentful Paint (FCP) dan Total Blocking Time (TBT).
4. **Image & Asset Optimization**:
   - Menggunakan `next/image` dengan loader bawaan Sanity, format otomatis WebP/AVIF, dan responsive `sizes` attribute.
   - Font lokal (`Geist`, `Space Grotesk`, `Silkscreen`) di-load dengan `font-display: swap` untuk mencegah flash of invisible text (FOIT).

---

## 6. Bilingual Architecture (i18n)

- Struktur rute Next.js tetap mempertahankan pola `[locale]` (`/en` dan `/id`).
- Setiap query Sanity menerima parameter `$locale` untuk mengekstrak field teks terlokalisasi (`en` atau `id`).
- Seluruh string statis UI (seperti teks tombol *"Get in touch"*, label *"Currently Vibing To"*, placeholder form) dipusatkan di `src/i18n/messages/en.json` dan `src/i18n/messages/id.json`.
