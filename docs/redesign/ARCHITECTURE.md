# Technical Architecture: Image Sequence & Hybrid Scroll-Snapping

## 1. System Overview

Arsitektur aplikasi dioptimalkan untuk performa rendering tinggi, alur scrolling bebas jank, serta pemisahan concern yang bersih:
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4 (dengan CSS custom properties untuk design tokens)
- **Interactive Canvas Engine**: HTML5 Canvas 2D + WebGL / `ImageBitmap` API
- **Motion & Scroll Tracking**: Framer Motion `useScroll`, `useTransform` + Native `IntersectionObserver` & `ResizeObserver`
- **CMS & Assets**: Sanity CMS v5 + local optimized fallback assets

---

## 2. Image Sequence Scroll Animation Architecture

Animasi sequence frame berbasis scroll pada Home page menggunakan rendering HTML5 Canvas offscreen pipeline untuk menjamin konsistensi 60+ FPS tanpa layout shift.

```
+-------------------------------------------------------------------------------+
| User Scroll Container (Height: 250vh - 300vh for comfortable scrubbing)       |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   | Sticky Viewport Window (Height: 100vh, position: sticky top: 0)       |   |
|   |                                                                       |   |
|   |   +---------------------------------------------------------------+   |   |
|   |   | <canvas id="sequence-canvas" /> (Hardware Accelerated 2D)     |   |   |
|   |   +---------------------------------------------------------------+   |   |
|   |                                                                       |   |
|   |   Scroll Progress [0.00 ------------------------------------> 1.00]   |   |
|   |                         │                                             |   |
|   |                         ▼                                             |   |
|   |   Frame Index: Math.floor(progress * (totalFrames - 1))               |   |
|   |                         │                                             |   |
|   |                         ▼                                             |   |
|   |   requestAnimationFrame -> ctx.drawImage(bitmapCache[frameIndex])     |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

### 2.1 Preloading & Memory Management Strategy
1. **Critical Path (LCP)**:
   - Frame pertama (`frame_000.webp`) dimuat dengan prioritas `fetchPriority="high"` sebagai static asset awal agar canvas tidak kosong saat halaman pertama kali terbuka.
2. **Batched Asynchronous Preloading**:
   - Setelah first paint / hydration selesai, frame sequence berikutnya (misal 60 hingga 90 frame) dimuat secara asinkron menggunakan Web Worker atau concurrency pool (maksimal 4 concurrent network requests).
3. **ImageBitmap Decoding**:
   - Setiap image yang berhasil di-fetch langsung di-decode di background thread menggunakan `createImageBitmap(blob)`.
   - Menghindari decoding overhead pada main thread saat scrolling aktif.
4. **Canvas Resizing & High-DPI Adaptation**:
   - Canvas disesuaikan dengan `window.devicePixelRatio` untuk ketajaman visual di layar Retina.
   - Fungsi draw menerapkan strategi *aspect ratio cover*:
     ```ts
     function drawImageCover(ctx: CanvasRenderingContext2D, img: ImageBitmap, canvasW: number, canvasH: number) {
       const hRatio = canvasW / img.width;
       const vRatio = canvasH / img.height;
       const ratio = Math.max(hRatio, vRatio);
       const centerShiftX = (canvasW - img.width * ratio) / 2;
       const centerShiftY = (canvasH - img.height * ratio) / 2;
       ctx.clearRect(0, 0, canvasW, canvasH);
       ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
     }
     ```

---

## 3. Hybrid CSS/JS Scroll-Snapping Behavior

### 3.1 Problem Statement
Penggunaan CSS `scroll-snap-type: y mandatory` secara naif menyebabkan kecacatan UX fatal (*scroll trapping*):
- Ketika sebuah section memiliki tinggi melebihi tinggi layar pengguna (`height > 100vh`), browser memaksakan snap ke batas awal atau akhir section.
- Akibatnya, konten bagian tengah (seperti daftar Tech Stack yang panjang) tidak dapat dibaca karena viewport dipaksa melompat (*snapping loop*).

### 3.2 Arsitektur Hybrid: `useSmartScrollSnap`

```
                          Section Rendered
                                 │
                                 ▼
                     ResizeObserver / Dimension Check
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       Height <= 100vh * 1.05          Height > 100vh * 1.05
                 │                               │
                 ▼                               ▼
        [SNAP-ENABLED]                    [FREE-SCROLL]
   scroll-snap-align: start           scroll-snap-align: none
   scroll-snap-stop: normal           scroll-snap-stop: normal
   (View docks smoothly)              (Natural momentum scroll)
```

### 3.3 Implementation Details
1. **Root Configuration**:
   - Menggunakan `scroll-snap-type: y proximity` pada container root. Mode `proximity` memungkinkan snap aktif saat scroll melambat secara alami tanpa mengunci agresif.
2. **Hook Kontroler Dinamis**:
   - Mengamati setiap elemen `<section>` yang memiliki atribut `data-section-snap`:
   ```ts
   // Pseudo-code implementation hook
   export function useSmartScrollSnap() {
     useEffect(() => {
       if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

       const sections = document.querySelectorAll<HTMLElement>("section[data-snap-target]");
       const observer = new ResizeObserver((entries) => {
         const vh = window.innerHeight;
         for (const entry of entries) {
           const target = entry.target as HTMLElement;
           const isOverflowing = target.offsetHeight > vh * 1.08;
           if (isOverflowing) {
             target.classList.remove("snap-start");
             target.classList.add("snap-none");
           } else {
             target.classList.add("snap-start");
             target.classList.remove("snap-none");
           }
         }
       });

       sections.forEach((s) => observer.observe(s));
       return () => observer.disconnect();
     }, []);
   }
   ```

---

## 4. Dead Code Cleanup & Dependency Graph

Berikut pemetaan komponen yang dinonaktifkan atau dihapus untuk menjaga bundle size tetap ramping:

| Komponen Asal | Status | Alasan |
| :--- | :--- | :--- |
| `src/components/sections/projects/project-grid.tsx` | **Removed from Home** | Menghilangkan duplikasi grid 3-kolom di bawah Featured Project carousel. |
| `src/components/sections/cta/index.tsx` | **Removed from Home** | Eliminasi banner ajakan bertindak "Let's build something" sebelum footer. |
| `src/components/sections/hero/building-card.tsx` | **Removed from Hero** | Membersihkan hero dari widget card kanan yang membingungkan fokus. |
| `src/components/sections/hero/testimonial-slider.tsx` | **Removed from Hero** | Dieliminasi dari Hero Home untuk memberi ruang bagi Split-Center hero. |
| Tombol `Contact` duplikat di `navbar.tsx` | **Removed** | Disederhanakan ke tombol CTA primer tunggal `Get in Touch`. |
