# Multi-Agent Workflow: Compact Neo-Brutalist Redesign Execution

Dokumen ini mendefinisikan pembagian peran sub-agen otomatis, dependensi antar-tugas, batasan cakupan, dan protokol komunikasi untuk mengeksekusi rencana perombakan redesign baru.

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
| Tokens &     | | Navbar      |             | Hero Home & | | Sequence &  |
| Spacing      | | Declutter   |             | Pruning     | | Smart Snap  |
+--------------+ +-------------+             +-------------+ +-------------+
                                                           |
                                             +-------------+---------------+
                                             |                             |
                                       +-----v-------+               +-----v-------+
                                       | Agent 5     |               | Agent 6     |
                                       | About Page  |               | Playwright  |
                                       | Overhaul    |               | QA & Visual |
                                       +-------------+               +-------------+
```

### Agent 1: Tokens & Spacing Specialist (`agent-tokens`)
- **Tugas**:
  - Memperbarui `section.tsx` dengan vertical spacing compact (`py-10 lg:py-14`).
  - Menambahkan token `--bg-surface-elevated` (`#111622`) dan `--border-contrast` di `globals.css`.
  - Menyiapkan styling utilitas scroll snapping.
- **Output**: Token dan container layout siap pakai untuk section lainnya.

### Agent 2: Navbar Decluttering Specialist (`agent-navbar`)
- **Tugas**:
  - Merapikan `src/components/layout/navbar.tsx`: eliminasi "Say hi" badge, satukan CV & PDF download, hapus tombol Contact duplikat, dan atur link tengah ke 4 rute utama.
  - Memastikan tampilan responsif pada viewport 1024px-1366px tidak mengalami wrapping.
- **Output**: Navbar yang bersih, lapang, dan berhierarki tegas.

### Agent 3: Hero Home & Section Pruning Specialist (`agent-hero-prune`)
- **Tugas**:
  - Mengimplementasikan layout 3-kolom split-center pada Hero Home dengan `foto 1.png` sebagai centerpiece.
  - Menghapus komponen `BuildingCard` dan `TestimonialSlider` dari Hero.
  - Menghapus `ProjectGrid` (grid 3-kolom) dari `FeaturedProjects`.
  - Menghapus `<CTA />` ("Let's build something") di atas footer.
  - Menerapkan background surface elevated pada `ExperiencePreview` dan `FeaturedCertificates`.
- **Output**: Halaman Home yang terfokus, padat, dan kontras visualnya jelas.

### Agent 4: Canvas Sequence & Smart Scroll-Snapping Specialist (`agent-motion`)
- **Tugas**:
  - Membangun `image-sequence-canvas.tsx` untuk frame scrubbing berbasis scroll progress dengan preloading efisien.
  - Membangun hook `useSmartScrollSnap` dengan `ResizeObserver` untuk menonaktifkan snap pada section dengan tinggi `> 100vh`.
- **Output**: Animasi sequence 60 FPS dan scroll snapping yang natural tanpa trap.

### Agent 5: About Page Overhaul Specialist (`agent-about`)
- **Tugas**:
  - Mendesain ulang `src/components/sections/about/about-hero.tsx` menjadi 2-kolom borderless side-by-side dengan `foto 2.png`.
  - Mengintegrasikan blok narasi *"My Story"* langsung di samping foto tanpa kartu avatar terpisah.
  - Memastikan section Tech Stack panjang berjalan dengan mode free-scroll.
- **Output**: Halaman `/about` berstandar editorial tinggi.

### Agent 6: Playwright QA & Visual Verification Specialist (`agent-qa`)
- **Tugas**:
  - Menjalankan unit tests (`pnpm test`) dan linter (`pnpm lint`).
  - Melakukan inspeksi visual menggunakan **Playwright MCP** pada resolusi desktop (1440x900) dan mobile (390x844).
  - Memastikan tidak ada console error atau layout shift.
- **Output**: Laporan verifikasi visual dan conformance test.
