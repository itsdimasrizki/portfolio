# Portfolio Deck — Design Spec

**Tanggal:** 2026-09-05
**Status:** Disetujui untuk implementasi
**Ruang lingkup:** Mengganti total modul PDF (`src/pdf/`) dari dokumen A4 portrait menjadi deck presentasi 16:9.

---

## 1. Tujuan

PDF portofolio yang sekarang berbentuk dokumen A4 portrait 8 halaman bertema teal/slate dengan
header bar dan heading section yang seragam. Bentuk itu membaca sebagai laporan, bukan portofolio
seorang engineer yang juga peduli desain.

Deck baru harus:

1. Berbentuk slide 16:9 seperti presentasi, bukan dokumen.
2. Bertema **Swiss Brutalist + aksen pixel** — tipografi grotesk raksasa, palet bone/electric
   blue/orange, bentuk keluar bidang, dibubuhi detail pixel (nomor slide, progress bar kotak,
   dithering).
3. **Tidak kaku.** Tidak ada satu pun slide yang berupa grid rata dengan header seragam. Asimetri
   adalah properti sistemik, bukan hiasan per slide.
4. Tetap jujur pada data. Tidak ada angka atau klaim yang dikarang untuk mengisi layout.

### Non-tujuan

- Tidak mengubah skema Sanity.
- Tidak mengubah UI situs atau tombol download.
- Tidak menambah dependensi npm baru.
- Tidak membuat endpoint kedua. PDF A4 lama dihapus, bukan didampingi.

---

## 2. Keputusan yang sudah diambil

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Tema | Swiss Brutalist + aksen pixel | Wibawa mockup + karakter yang diingat, tanpa mengorbankan keterbacaan seperti full-pixel |
| Nasib PDF A4 | Ganti total | Satu identitas, satu yang dirawat; versi lama tetap ada di git history |
| Arsitektur | Slide primitives + composer dinamis | Kosakata visual kecil yang dipakai ulang; menambah slide = 1 file |
| Bahasa label | Inggris | Mengikuti konten Sanity yang berbahasa Inggris |
| Ukuran halaman | `[960, 540]` pt | Persis PowerPoint 16:9 widescreen (13,33in x 7,5in) |

---

## 3. Fondasi visual

### 3.1 Ukuran & grid

- Page: `size={[960, 540]}` pt, landscape.
- Margin: 48pt kiri/kanan, 40pt atas/bawah. Lebar konten 864pt.
- Grid 12 kolom: kolom 57,33pt, gutter 16pt. Dipakai sebagai panduan, bukan penjara — banyak
  slide sengaja melanggarnya (full-bleed, elemen keluar tepi).

### 3.2 Palet

```
bone    #EAE8E3   latar utama
paper   #F5F4F1   kartu terang
ink     #141414   hitam / kartu gelap
blue    #2B44FF   aksen utama (electric)
orange  #FF6B3D   aksen sekunder
peach   #F2D9CD   lingkaran bleed hangat
mauve   #9A5F97   lingkaran bleed di atas blue/orange
lilac   #CFCFE6   lingkaran bleed di slide penutup
white   #FFFFFF
muted   #8A8880   teks sekunder di atas bone
mutedOn #A9B4FF   teks sekunder di atas blue
```

Aturan kontras: teks di atas `blue` dan `ink` memakai `bone`/`white`; teks di atas `orange`
memakai `ink`. Tidak pernah `blue` di atas `ink` untuk teks.

### 3.3 Tipografi

Dua keluarga, empat file TTF statis di `public/fonts/`:

| Peran | Font | File |
|---|---|---|
| Display & body | Space Grotesk 400 / 500 / 700 | `SpaceGrotesk-{Regular,Medium,Bold}.ttf` |
| Aksen pixel | Silkscreen 400 | `Silkscreen-Regular.ttf` |

Diambil dari Google Fonts (OFL) sebagai instance statis — bukan variable font, karena
`@react-pdf/renderer` merender variable font hanya pada instance default sehingga bold tidak
akan berfungsi.

Skala (pt):

```
hero     108   lineHeight 0.92   Bold    divider & penutup
display   72   lineHeight 0.95   Bold    headline cover
h1        52   lineHeight 1.0    Bold    judul proyek detail
h1        44   lineHeight 1.02   Bold    judul slide
stat      96   lineHeight 0.9    Bold    angka besar (kartu hero)
stat2     64   lineHeight 0.9    Bold    angka besar (kartu sekunder)
h2        26   lineHeight 1.1    Bold
h3        17   lineHeight 1.2    Bold
body      12   lineHeight 1.45   Regular
small     10   lineHeight 1.4    Regular
micro      8   letterSpacing 0.6 Silkscreen  eyebrow, label, nomor slide
nano     6.5   letterSpacing 0.4 Silkscreen  caption
```

---

## 4. Mesin "tidak kaku"

Enam alat di `deck/layout.ts` dan `deck/primitives.tsx` yang dipakai berulang di seluruh deck.
Semuanya **deterministik** (diturunkan dari indeks, bukan random) supaya render dapat direproduksi.

| Alat | Perilaku |
|---|---|
| `stagger(i)` | Offset vertikal kartu ke-i dari pola siklik `[0, 28, -14, 34, 8]` |
| `heightFor(i, base)` | Tinggi kartu bervariasi dari pola `[1, 0.9, 0.95, 0.86, 1.04]` x base |
| `accentFor(i)` | Warna kartu hero berputar `blue -> orange -> ink` |
| `<BleedCircle>` | Lingkaran Ø 380–560pt terpotong tepi slide; posisi berputar per indeks divider (kiri-bawah, kanan-atas, kiri-atas, kanan-bawah) |
| `<Dither>` | Kisi kotak 4pt dengan opacity menurun bertahap — pengganti gradient (react-pdf tidak punya gradient CSS), sekaligus motif pixel |
| `<PixelBar>` | Progress bar dari 20 kotak diskrit berjarak 2pt, bukan bar mulus |

Aturan komposisi yang mengikat seluruh deck:

1. **Tidak ada slide konten dengan lebih dari satu kartu ber-warna penuh.** Satu hero, sisanya paper.
2. **Tidak ada dua slide berurutan dengan warna hero yang sama** (dijaga `accentFor`).
3. **Setiap grid kartu harus di-stagger.** Kartu sejajar rata hanya boleh di baris tabel
   (indeks proyek, riwayat kerja).
4. **Slide divider selalu full-bleed** dan tidak punya header/footer.

---

## 5. Struktur deck

Jumlah slide dinamis (±18–22) tergantung data. Slide dilewati bila datanya kosong.

| # | Slide | Komponen | Sumber data | Muncul bila |
|---|---|---|---|---|
| 01 | Cover | `cover.tsx` | `settings`, `technologies` | selalu |
| 02 | Contents | `contents.tsx` | jumlah tiap koleksi | selalu |
| 03 | Divider "01 — profile" (bone) | `divider.tsx` | statis | selalu |
| 04 | Bio | `bio.tsx` | `settings` | selalu |
| 05 | Numbers | `numbers.tsx` | derived (§6.1) | selalu |
| 06 | Stack | `stack.tsx` | `technologies` | `technologies.length > 0` |
| 07 | How I work | `process.tsx` | `skills` | `skills.length > 0` |
| 08 | Divider "02 — work" (blue) | `divider.tsx` | jumlah proyek | ada proyek |
| 09 | Project index | `project-index.tsx` | `featuredProjects` | ada proyek |
| 10–13 | Project detail (1 slide/proyek, maks 4) | `project-detail.tsx` | proyek + `images[0]` | per proyek |
| 14 | More work (grid 3) | `project-grid.tsx` | sisa proyek | sisa > 0 |
| 15 | Divider "03 — experience" (ink) | `divider.tsx` | jumlah | ada experience |
| 16 | Experience timeline | `experience.tsx` | `experiences` | ada experience |
| 17 | Divider "04 — credentials" (orange) | `divider.tsx` | jumlah | ada sertifikat |
| 18 | Certificates grid | `certificates.tsx` | `certificates` | ada sertifikat |
| 19 | Contact (blue full-bleed) | `contact.tsx` | `settings`, `qrCodeDataUrl` | selalu |
| 20 | Closing | `closing.tsx` | `settings` | selalu |

### 5.1 Spesifikasi per slide

**Cover** — latar bone. `BleedCircle` peach Ø520 di kiri-bawah (`left:-190, bottom:-210`).
Baris atas: nama (Bold 12pt) kiri; kanan `role · location · portfolio 2026` (blue). Garis ink 1pt.
Blok kiri (kol 1–7): headline 4 baris 72pt, baris terakhir blue. Di bawahnya deretan chip teknologi
(maks 6; chip ke-4 blue solid, ke-5 orange solid, sisanya outline). Blok kanan (kol 8–12): bingkai
foto 372x390 border dashed 1pt + tab caption ink `fig. 01 — the maker`. Garis bawah + 4 kata nav
(`experience  work  credentials  contact`) tersebar rata.

**Contents** — 5 kartu vertikal lebar 158pt, tinggi `[440, 400, 420, 380, 440]`, offset atas
`[0, 28, 8, 42, 0]`. Kartu ke-5 blue penuh. Tiap kartu: nomor 56pt (blue/orange bergantian),
label h3, footer `p. NN` micro. Label kelima kartu: `profile`, `work`, `experience`,
`credentials`, `contact` — sama persis dengan teks divider dan kata nav di cover.

**Divider** (dipakai 4x, prop `tone: bone | blue | ink | orange` — satu tone per divider, tidak
pernah berulang: profile=bone, work=blue, experience=ink, credentials=orange) — full-bleed.
Pada tone `bone`, tipografi memakai `ink` dan lingkaran memakai `peach`. `BleedCircle` mauve Ø460,
sudut berputar per indeks. Eyebrow micro di sudut atas. Hero 2 baris 108pt di kiri bawah.
Subline body 1–2 baris.

**Bio** — kiri (kol 1–5): bingkai foto 384x330 dari `public/images/profile/profile.jpeg`, di
bawahnya 4 fact card 2x2 berisi `LOCATION`, `ROLE`, `EMAIL`, `PORTFOLIO` — kartu PORTFOLIO blue.
Tidak ada kartu "status / open to work": skema Sanity tidak menyimpan ketersediaan kerja dan
deck tidak boleh mengklaimnya.
Kanan (kol 6–12): headline 44pt 3 baris (baris terakhir blue), `settings.bio` sebagai 2 paragraf
body, lalu pull-quote 17pt dengan garis orange 3pt di kiri.

**Numbers** — 4 kartu asimetris: kartu blue besar kiri 400x360 dengan `Dither` di sudut dan angka
96pt; dua kartu paper kecil kanan-atas (angka 64pt, satu ink satu orange); satu kartu ink lebar
kanan-bawah (angka 64pt + label body). Semua angka derived (§6.1).

**Stack** — kiri: judul h1 2 baris, deretan seluruh chip teknologi (bungkus otomatis; warna solid
untuk indeks `i % 5 === 0` blue dan `i % 7 === 0` orange, sisanya outline), legend nano di bawah.
Kanan: satu baris per grup teknologi — kartu paper dengan judul h3, label level micro di kanan,
dan `PixelBar`. Kartu di-offset horizontal `[0, 12, 0, 10, 0]` agar tidak rata.

**How I work** — kartu dari `skills` (maks 5), di-stagger vertikal; satu kartu memakai
`accentFor` (blue) sebagai hero. Nomor 56pt, judul h2, deskripsi small.

**Project index** — maks 6 baris. Pembagian proyek antar slide: index menampilkan 6 proyek
pertama, detail slide dibuat untuk 4 proyek pertama, `More work` menampilkan proyek ke-5 dan ke-6.
Proyek ke-7 dan seterusnya tidak masuk deck.
Baris: nomor 32pt (blue/orange bergantian), judul 30pt, daftar teknologi kanan
small muted, tahun body. Pemisah antar baris: garis pixel-dashed (kotak 3pt jarak 3pt).

**Project detail** — layout cermin: indeks genap = teks kiri / gambar kanan full-bleed setengah
slide; indeks ganjil = kebalikan. Eyebrow: nomor blue 32pt + `category · year · status`.
Judul 52pt. Deskripsi body maks 3 baris. Baris meta: `stack` dan `links`. Badge orange
melayang di atas gambar. Chip link: `github` (ink solid), `live` (outline).

**More work** — 3 kartu staggered: thumbnail 1:0.55, nomor, judul h2, deskripsi small,
footer `tech · year`.

**Experience timeline** — kartu selebar konten, entri pertama blue penuh. Kiri: rentang tahun 30pt
+ posisi micro. Kanan: perusahaan h2 + deskripsi small. Indent kiri berselang `[0, 26, 0, 26]`.

**Certificates** — grid 3x2, tinggi kartu di-stagger; satu kartu blue dan satu ink sebagai aksen.
Issuer small (blue/orange), judul h2, footer tahun + kode kredensial.

**Contact** — blue full-bleed, `BleedCircle` mauve kanan-atas. Hero 2 baris 96pt.
Garis + 4 kolom (`email`, `phone`, `github`, `linkedin`). QR 92x92 dalam kotak putih 8pt padding
di kanan bawah + caption nano.

**Closing** — bone, `BleedCircle` lilac kiri-bawah. `any questions?` 96pt 2 baris + satu baris
identitas body.

---

## 6. Data

### 6.1 Angka turunan (slide Numbers)

Tidak ada metrik impact di skema Sanity, dan tidak boleh dikarang. Empat angka dihitung dari data
yang ada:

| Angka | Perhitungan | Label |
|---|---|---|
| Tahun pengalaman | tahun sekarang − tahun dari `startDate` paling awal di `experiences`; minimal 1 | `years building for the web` |
| Jumlah proyek | `featuredProjects.length` | `projects shipped` |
| Jumlah sertifikat | `certificates.length` | `certifications earned` |
| Jumlah teknologi | total item di seluruh `technologies` group | `tools in daily rotation` |

Bila `experiences` kosong, kartu tahun diganti jumlah kategori proyek unik dengan label
`domains worked in`. Slide tetap tampil
selama minimal dua angka bernilai > 0.

### 6.2 Gambar

`<Image src={url}>` yang gagal fetch akan melempar dan mematikan seluruh render menjadi 500.
Karena itu gambar **tidak pernah** diberikan ke react-pdf sebagai URL mentah.

`pdf.service.ts` memperoleh gambar lebih dulu:

- Setiap `project.images[0]` di-fetch dengan `AbortSignal.timeout(6000)`, dikonversi jadi data URL.
- Kegagalan apa pun (network, 404, content-type bukan image, ukuran > 4MB) di-`catch` dan
  menghasilkan `undefined`, dicatat lewat `console.warn`, tidak melempar.
- Foto profil dibaca dari `public/images/profile/profile.jpeg` lewat `fs.readFile`; gagal =
  `undefined`.
- Slide yang menerima `undefined` merender `<Dither>` sebagai placeholder, bukan kotak kosong.

Tipe `PortfolioPdfData` bertambah dua field: `profileImage?: string` dan `projectImages:
Record<string, string | undefined>` (dikunci `project.id`).

### 6.3 Font

`deck/fonts.ts` mendaftarkan font sekali (idempoten, dijaga flag modul) dengan
`fs.readFileSync(path.join(process.cwd(), "public/fonts/..."))`.

Kegagalan baca file di-`catch`: dicatat `console.error` dan deck jatuh ke `Helvetica` supaya
endpoint tetap mengembalikan PDF (terdegradasi) alih-alih 500.

`next.config.ts` mendapat `outputFileTracingIncludes` untuk `/api/portfolio/pdf` agar
`public/fonts/**` ikut ter-bundle pada deploy serverless.

---

## 7. Struktur file

```
src/pdf/
  deck/
    theme.ts           token: colors, type, spacing, grid
    fonts.ts           Font.register + fallback
    layout.ts          stagger, heightFor, accentFor, chunk, formatYear
    primitives.tsx     Slide, SlideHeader, Eyebrow, SlideNumber, BigType,
                       Chip, PixelBar, PixelRule, Dither, BleedCircle,
                       PhotoFrame, StatCard, Card
    slides/
      cover.tsx  contents.tsx  divider.tsx  bio.tsx  numbers.tsx
      stack.tsx  process.tsx  project-index.tsx  project-detail.tsx
      project-grid.tsx  experience.tsx  certificates.tsx
      contact.tsx  closing.tsx
  portfolio-pdf.tsx    composer (ditulis ulang)

public/fonts/          4 TTF (±130KB)
```

**Dihapus:** `src/pdf/theme.ts`, `src/pdf/page-shell.tsx`, `src/pdf/pages/` (8 file).

**Diubah:** `src/pdf/portfolio-pdf.tsx`, `src/services/pdf.service.ts`, `src/types/pdf.ts`,
`next.config.ts`.

**Tidak berubah:** `src/app/api/portfolio/pdf/route.ts`, seluruh service Sanity, UI situs.

---

## 8. Batasan @react-pdf/renderer yang membentuk desain

Dicatat supaya implementasi tidak menabraknya:

1. Tidak ada gradient CSS → dipakai `<Dither>`.
2. Tidak ada `box-shadow` → kedalaman dibuat lewat kontras warna dan offset border.
3. `overflow: hidden` bekerja pada `<View>`; lingkaran bleed dipotong oleh `<Page>` yang memakainya.
4. Variable font hanya merender instance default → wajib TTF statis.
5. Teks tidak bisa dirotasi dengan andal → tidak ada tipografi miring dalam desain ini.
6. `borderRadius` besar (≥ 9999) untuk lingkaran bekerja; dipakai untuk `BleedCircle`.
7. Tidak ada `text-overflow: ellipsis` → pemotongan teks dilakukan di JS sebelum render.

---

## 9. Verifikasi

Bukan sekadar "build lolos". Urutan wajib sebelum menyatakan selesai:

1. `pnpm build` lolos tanpa error TypeScript.
2. Jalankan dev server, `curl localhost:3000/api/portfolio/pdf -o /tmp/deck.pdf`.
3. `pdfinfo /tmp/deck.pdf` — konfirmasi ukuran halaman 960x540pt dan jumlah slide masuk akal.
4. `pdftoppm -png -r 72 /tmp/deck.pdf out/slide` — konversi **setiap** slide jadi PNG.
5. Baca seluruh PNG secara visual. Yang dicari: teks meluber keluar kartu, kartu bertumpuk,
   kontras teks gagal, placeholder gambar yang tidak diinginkan, slide yang tanpa sengaja jadi
   grid rata.
6. Perbaiki, ulangi dari langkah 2 sampai bersih.

Bila Sanity tidak dapat dijangkau saat verifikasi, render memakai fixture dari `src/constants/`
lewat harness sementara di scratchpad — harness itu tidak di-commit.

---

## 10. Risiko

| Risiko | Mitigasi |
|---|---|
| Bio dari Sanity terlalu panjang / pendek untuk slot slide | Potong di JS dengan batas karakter per slot; slide bio memakai 2 paragraf dengan sisa dibuang |
| Judul proyek sangat panjang merusak headline 52pt | Ukuran font judul menurun bertahap bila panjang > 22 karakter |
| Teknologi > 24 item membuat chip meluber | Chip dibatasi 24 dengan sisa diringkas `+N more` |
| Font tidak ikut ter-bundle di serverless | `outputFileTracingIncludes` + fallback Helvetica |
| Fetch gambar lambat memperlambat endpoint | Timeout 6 detik per gambar, di-fetch paralel |
