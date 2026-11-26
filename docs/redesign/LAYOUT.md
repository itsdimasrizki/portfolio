# Layout Specification: Split-Center Home & Borderless About

## 1. Global Navigation Bar (`#navbar`) Decluttering

### 1.1 Problem & Diagnostic (Audit Live Site)
Navbar lama memuat 8 blok elemen horizontal yang saling bertabrakan:
1. Logo Coin Flip `DR`
2. Pill badge `👋 Say hi`
3. 5 Menu links: `01 // ABOUT`, `02 // PROJECTS`, `03 // EXPERIENCE`, `04 // CERTIFICATES`, `05 // CONTACT`
4. Swatch color picker dropdown
5. Tombol `CONTACT` duplikat (padahal sudah ada link `05 // CONTACT`)
6. Tombol `DOWNLOAD CV`
7. Tombol `PORTFOLIO` (PDF)
8. Language Switcher `ID | EN`

### 1.2 Proposed Clean Navbar Wireframe & Component Hierarchy

```
+-------------------------------------------------------------------------------------------------------+
|  [BRAND LOCKUP]                 [CENTER NAVIGATION]                     [UTILITY & CTA CLUSTER]       |
|  (DR Logo + Status Dot)   01/ABOUT  02/PROJECTS  03/EXP  04/CERTS   [CV/PDF ▼] [Accent] [ID|EN] [GET IN TOUCH]|
+-------------------------------------------------------------------------------------------------------+
```

#### Struktur & Dekomposisi Komponen:
1. **Left Zone (Brand)**:
   - Coin Logo `DR` dengan indikator status micro `🟢 Available` (menghilangkan pill "Say hi" yang redundant).
2. **Center Zone (Navigation Links)**:
   - 4 Link navigasi utama: `About`, `Projects`, `Experience`, `Certificates`.
   - Mengeliminasi link `05 // Contact` dari tengah karena aksi kontak dialihkan ke tombol CTA primer di sisi kanan.
3. **Right Zone (Consolidated Utility & CTA)**:
   - **Download Dossier Split / Dropdown (`CV/PDF`)**: Menggabungkan tombol Download CV dan Portfolio PDF ke dalam 1 dropdown ringkas atau segmented button.
   - **Accent Color Indicator**: Single circle trigger icon yang membuka popover warna aksen tanpa memakan ruang baris.
   - **Language Switcher**: Toggle button minimalis `EN | ID`.
   - **Primary Action CTA**: Tombol kontras tinggi `Get in Touch` / `Contact` mengarah ke `/contact`.

---

## 2. Main Dashboard (Home Page) Layout Breakdown

```
+-------------------------------------------------------------------------------------------------------+
| [NAVBAR] Sticky / Floating Capsule                                                                    |
+-------------------------------------------------------------------------------------------------------+
| [HERO: 3-COLUMN SPLIT-CENTER]                                                                         |
|  LEFT (Col 1-4)                CENTERPIECE (Col 5-8)               RIGHT (Col 9-12)                   |
|  - Status: [ONLINE // HIRE]    - Portrait Cutout (`foto 1.png`)    - Short Bio & Engineering Thesis   |
|  - "DIMAS RIZKI ARDIANSYAH"      (Green suit, black tie, pointing) - Specialization Tags              |
|  - Primary Action (Explore)                                        - Secondary CTA (Connect / Terminal)|
+-------------------------------------------------------------------------------------------------------+
| [IMAGE SEQUENCE SCROLL ANIMATION AREA]                                                                |
|  - Sticky Canvas Sequence scrubbing on scroll progress [0..1]                                        |
+-------------------------------------------------------------------------------------------------------+
| [FEATURED PROJECTS]                                                                                   |
|  - Section Header & Eyebrow                                                                           |
|  - Single Horizontal Carousel / Slider with Tech Specs & Live/Source Links                             |
|  * (PRUNED: 3-column project cards grid & filter tabs REMOVED)                                         |
+-------------------------------------------------------------------------------------------------------+
| [EXPERIENCE PREVIEW] - (Elevated Surface Background: `#111622`)                                       |
|  - Top subtle border highlight line                                                                   |
|  - Horizontal timeline / cards with expandable metrics                                                |
+-------------------------------------------------------------------------------------------------------+
| [FEATURED CERTIFICATES] - (Elevated Surface Background: `#111622`)                                    |
|  - Credential verification cards & PDF links                                                          |
+-------------------------------------------------------------------------------------------------------+
| * (PRUNED: "Let's build something together" Bottom CTA Banner REMOVED)                                |
+-------------------------------------------------------------------------------------------------------+
| [FOOTER] Minimalist Engineering Dossier / Copyright / Live View Counter / Social Links                 |
+-------------------------------------------------------------------------------------------------------+
```

### 2.1 Hero Home CSS Grid & Breakpoint Specifications

```css
/* Container Hero Home */
.hero-split-center-grid {
  display: grid;
  grid-template-columns: 1fr minmax(280px, 360px) 1fr;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-height: calc(100vh - 4.5rem);
  padding: 2.5rem 1rem;
}

/* Tablet (768px - 1023px) */
@media (max-width: 1023px) {
  .hero-split-center-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "left right"
      "center center";
    gap: 1.5rem;
  }
  .hero-centerpiece {
    grid-area: center;
    max-height: 420px;
  }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  .hero-split-center-grid {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding-top: 1.5rem;
  }
  .hero-centerpiece {
    order: -1; /* Foto ditaruh sebelum nama atau di tengah */
    max-height: 320px;
  }
}
```

### 2.2 Section Pruning (Eliminasi Kode & Elemen)
1. **Projects Grid Removal**:
   - Menghapus komponen `ProjectGrid` (`src/components/sections/projects/project-grid.tsx`) dan filter kategori tabs dari `FeaturedProjects`.
   - Hanya menyisakan `ProjectSlider` yang bersih dan terfokus pada proyek unggulan terbaik.
2. **Bottom CTA Banner Removal**:
   - Menghapus import dan pemanggilan `<CTA />` (`src/components/sections/cta/index.tsx`) dari `src/app/(site)/[locale]/page.tsx`.
3. **Hero Widget Cleanup**:
   - Menghapus total `BuildingCard` ("Currently Building") dan `TestimonialSlider` dari kolom kanan hero.

---

## 3. About Page (`/about`) Layout Breakdown

```
+-------------------------------------------------------------------------------------------------------+
| [NAVBAR]                                                                                              |
+-------------------------------------------------------------------------------------------------------+
| [ABOUT HERO & STORY: 2-COLUMN BORDERLESS SIDE-BY-SIDE]                                                |
|  COLUMN 1 (Left / Visual Anchor):           COLUMN 2 (Right / Narrative & Content):                   |
|  - Large Borderless Portrait Cutout         - Eyebrow: 01 // ABOUT ME                                 |
|    (`foto 2.png` - Black Shirt TI)          - Headline: Dimas Rizki Ardiansyah                        |
|  - Subtle bottom gradient blend             - Subtitle & Education Institution                        |
|  - No card frame / No rounded border box    - Action buttons (Download CV, Connect)                   |
|                                             - Integrated "My Story" block with clickable              |
|                                               keyword pills ("Full-stack + AI", "Production Systems") |
+-------------------------------------------------------------------------------------------------------+
| [THE TECHNOLOGIES I USE EVERY DAY] - (Long List: FREE-SCROLL / NO SNAP LOCK)                          |
|  - Frontend, Backend, Database, Cloud & DevOps, AI/ML tools                                           |
|  * Smart scroll snapping disabled here to prevent scroll trapping                                    |
+-------------------------------------------------------------------------------------------------------+
| [SKILLS MATRIX & CORE COMPETENCIES]                                                                   |
+-------------------------------------------------------------------------------------------------------+
| [ACADEMIC EDUCATION TIMELINE]                                                                         |
+-------------------------------------------------------------------------------------------------------+
| [FOOTER]                                                                                              |
+-------------------------------------------------------------------------------------------------------+
```

### 3.1 About Hero CSS Grid & Breakpoint Specifications

```css
/* 2-Column Side-by-side Borderless Hero */
.about-hero-grid {
  display: grid;
  grid-template-columns: minmax(320px, 420px) 1fr;
  align-items: center;
  gap: 3.5rem;
  padding: 3rem 0;
  min-height: calc(100vh - 4.5rem);
}

/* Image Cutout Styling */
.about-portrait-cutout {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border: none;
  background: transparent;
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

/* Tablet & Mobile Breakpoints */
@media (max-width: 1023px) {
  .about-hero-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  .about-portrait-cutout {
    max-width: 280px;
  }
}
```
