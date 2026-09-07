# Perkenalan Cover & Peran Multidisiplin — Design Spec

> Pekerjaan "C" dari pembagian 2026-09-05, dikerjakan setelah situs dwibahasa
> (`2026-09-05-bilingual-site-design.md`) selesai. Branch: `portofolio-v2`.

## 1. Tujuan

Dua perubahan yang saling terkait, keduanya dalam versi Indonesia dan Inggris:

1. **Cover deck memperkenalkan orangnya, bukan sifat produknya.** Tagline
   `modern, scalable, maintainable web apps.` diganti kalimat sapaan.
2. **Peran tidak lagi tunggal.** `Full Stack Web Developer` jadi salah satu dari
   empat peran; tiganya lagi Data Scientist, Data Analyst, dan ML Engineer.

### Non-tujuan

- Tidak mengubah tata letak cover, warna, atau ukuran halaman deck.
- Tidak menyentuh angka statistik beranda (masih keputusan tertunda, §9 spec
  dwibahasa).
- Tidak menambah dependensi npm. Rotasi peran memakai `framer-motion` yang
  sudah dipakai hero.
- Tidak menerjemahkan ulang isi Sanity yang lain. Yang ditulis dua bahasa di
  sini hanya `roles` dan `deckIntro`.

## 2. Keputusan yang sudah diambil

| Pertanyaan | Keputusan |
|---|---|
| Bentuk peran | `siteSettings.role` (localizedString) jadi `roles`, array `localizedString`. Urutan bermakna: yang pertama adalah peran utama |
| Isi cover | Sapaan + apa yang dikerjakan (`hi, i'm dimas — …`) |
| Sapaan kembar di slide bio | Slide bio kehilangan sapaannya; sapaan hanya sekali, di cover |
| Tempat teks perkenalan | Field baru `pageContent.deckIntro` (`localizedText`), bukan kamus di kode |
| Siapa menulis | Draft EN dan ID ditulis di sini lalu disemai lewat migrasi; Dimas menyuntingnya di Studio |
| Cakupan | Deck **dan** beranda. Beranda menampilkan peran berputar |

## 3. Realitas data (diverifikasi 2026-09-07)

Dibaca langsung dari dataset `production`:

```
siteSettings.role  = { _type: "localizedString", en: "Full Stack Web Developer" }
pageContent.heroHighlight = { _type: "localizedString", en: "Fullstack Web Developer." }
```

Seluruh kotak Indonesia masih kosong — perilaku yang dirancang di pekerjaan B,
situs jatuh ke Inggris sampai diisi.

`role` disebut di **delapan** tempat — lima yang menampilkannya, tiga yang
hanya melewatkannya. Yang terakhir ini gampang terlewat, dan `siteSettings.queries.ts`
yang paling berbahaya: kalau proyeksi GROQ-nya tidak ikut diganti, `roles` pulang
sebagai `undefined` tanpa satu pun kesalahan tipe.

| Berkas | Pemakaian | Ruang |
|---|---|---|
| `src/sanity/queries/siteSettings.queries.ts:7` | proyeksi GROQ `role,` | — |
| `src/services/settings.service.ts:90` | `pickLocalized(settings.role, locale)` | — |
| `src/types/siteSettings.ts:6,23,24` | `SanitySettings.role`, `Omit`, `ResolvedSettings.role` | — |
| `src/pdf/deck/slides/cover.tsx:13` | baris header `role · location · portfolio 2026` | sempit, satu baris |
| `src/pdf/deck/slides/bio.tsx:24` | kartu fakta `role` | kartu 180×62pt |
| `src/pdf/deck/slides/closing.tsx:8` | baris penutup bersama nama, email, URL | sempit, satu baris |
| `src/pdf/portfolio-pdf.tsx:136` | metadata `subject` PDF | satu baris |
| `src/components/sections/hero/{index,hero-content}.tsx:10,19,33` | tipe prop `settings` dan cadangan `heroHighlight` | judul `<h1>` |

Deck **belum pernah** menyentuh `pageContent`: `pdf.service.ts` hanya memanggil
`getResolvedSettings`. Sambungan itu ditambahkan di pekerjaan ini.

## 4. Skema dan tipe

### 4.1 Sanity

`siteSettings`:

```ts
defineField({
  name: "roles",
  title: "Roles / Titles",
  description:
    "Peran profesional, urutannya bermakna. Yang pertama dipakai di tempat sempit " +
    "(penutup deck, metadata PDF) dan jadi peran yang tampil lebih dulu di beranda.",
  type: "array",
  of: [defineArrayMember({ type: "localizedString" })],
})
```

Field `role` yang lama **dihapus dari skema** dan di-unset dari dokumen oleh
migrasi. Membiarkan keduanya hidup berarti dua sumber kebenaran yang pasti
berbeda suatu hari.

`pageContent`:

```ts
defineField({
  name: "deckIntro",
  title: "Deck — Perkenalan Cover",
  description:
    "Kalimat pembuka di cover deck. Satu baris per Enter, maksimal 4 baris. " +
    "Baris pendek lebih bagus: sekitar 13 karakter muat pada ukuran terbesar, " +
    "lebih dari itu hurufnya otomatis mengecil.",
  type: "localizedText",
})
```

### 4.2 TypeScript

```ts
// src/types/siteSettings.ts
export interface SanitySettings {
  roles?: (Localized | string)[];   // sebelumnya: role?: Localized | string
  …
}

export type ResolvedSettings = Omit<SanitySettings, "roles" | "bio"> & {
  roles: string[];   // selalu array, boleh kosong
  bio?: string;
};
```

`roles` sengaja **tidak** opsional pada `ResolvedSettings`: kelima pemanggil
tinggal membaca `roles[0]` atau `roles.join(…)` tanpa menjaga-jaga `undefined`
di masing-masing tempat. `getResolvedSettings` memetakan tiap entri lewat
`pickLocalized`, membuang yang kosong atau hanya spasi, dan mengembalikan `[]`
kalau tak ada satu pun.

`PortfolioPdfData` bertambah `intro?: string` — teks mentah `deckIntro`,
dipecah jadi baris oleh cover, bukan oleh service.

## 5. Helper murni

Keduanya masuk `src/pdf/deck/layout.ts`, yang **tidak boleh mengimpor apa pun**
karena dijalankan langsung oleh `node --test`.

### 5.1 `joinRoles(roles, maxChars)`

Menggabung peran dengan ` · ` selama masih muat anggaran karakter, lalu
berhenti. Selalu mengembalikan minimal peran pertama — kalau peran itu sendiri
lebih panjang dari anggaran, dipotong `truncate` yang sudah ada. Tanpa elipsis
di ujung daftar: baris header cover adalah orientasi, bukan daftar lengkap.
Cover memanggilnya dengan anggaran 46 karakter, sisa ruang setelah `location`
dan `portfolio 2026` pada `type.small`.

### 5.2 `introLines(text, max = 4)`

Memecah di `\n`, membuang spasi di ujung tiap baris, membuang baris kosong, dan
memotong di baris ke-`max`. Mengembalikan `{ lines, size }`:

- `lines` kosong bila teksnya kosong — cover memakai konstanta tagline lama
  sebagai cadangan, jadi cover tidak pernah kosong melompong.
- `size` adalah `"display"` (72pt) bila baris terpanjang ≤ 13 karakter,
  selain itu `"h1Big"` (52pt), yang muat ±18 karakter. Lebih panjang dari itu
  tetap terlipat sendiri — deskripsi field di Studio meminta baris pendek, dan
  dua ukuran sudah cukup untuk selisih panjang ID/EN yang wajar.

Ambang 13 itu terukur, bukan tebakan: kolom tipografi cover selebar 472pt
setelah padding, dan pada 72pt huruf display bold rata-rata ±36pt per karakter.
Baris terpanjang tagline yang ada sekarang, `maintainable`, panjangnya 12.
Aturan ini ada karena kalimat Indonesia hampir selalu lebih panjang dari
padanan Inggrisnya; tanpa penurunan ukuran, versi ID akan terlipat sendiri oleh
`@react-pdf/renderer` dan merusak susunan baris yang disengaja.

## 6. Deck

**`pdf.service.ts`** ikut memanggil `getPageContent(locale)` bersama
`getResolvedSettings` di `Promise.all` yang sudah ada, lalu meneruskan
`deckIntro` sebagai `data.intro`.

**`cover.tsx`**
- Header: `joinRoles(settings.roles, 46)` menggantikan `settings.role`.
- Tipografi besar: `introLines(intro)`; `lines` kosong → konstanta
  `FALLBACK_INTRO` berisi empat baris tagline lama. `accentLast` tetap menyala,
  jadi baris terakhir tetap biru.

**`bio.tsx`**
- Pembuka jadi `["i turn ideas", "into reliable", "software."]` — tanpa sapaan,
  karena cover sudah menyapa.
- Kartu fakta `role` jadi `settings.roles.join(", ")` lalu `truncate` agar muat
  kartu 180pt. Kartunya disembunyikan kalau `roles` kosong, sama seperti
  perilaku `drafts.filter` yang ada sekarang.

**`closing.tsx` dan metadata `subject`** memakai `roles[0]`. Keduanya satu baris
dan bukan tempat memamerkan daftar; `subject` mempertahankan cadangan
`"Software Engineer"` yang sudah ada.

Label kerangka deck tetap Inggris, sesuai batasan pekerjaan B.

## 7. Beranda

Komponen klien baru `src/components/sections/hero/role-rotator.tsx`, menerima
`roles: string[]`, menggantikan `<span>` highlight di dalam `<h1>`.

| Aspek | Keputusan |
|---|---|
| Render awal | Selalu `roles[0]`, jadi HTML server dan klien identik — tidak ada ketidakcocokan hidrasi |
| Rotasi | Tiap 3 detik, `AnimatePresence` dengan fade + geser kecil, berulang tanpa henti |
| Gerak dikurangi | `useReducedMotion` → teks diam di `roles[0]`, interval tidak dipasang sama sekali |
| Pembaca layar | Pembungkus `aria-label={roles.join(", ")}`, teks berputar `aria-hidden` — daftar terdengar sekali, bukan berubah tiap 3 detik |
| Titik akhir | Ditambahkan komponen (`{role}.`), tidak disimpan di data |
| Tinggi | `inline-block` dengan tinggi minimum satu baris agar `<h1>` tidak melompat saat panjang peran berganti |
| `roles` kosong | Jatuh ke `content.heroHighlight`, persis perilaku sekarang |

`heroHighlight` dengan demikian turun jadi cadangan. Field-nya tetap ada dan
tetap dwibahasa; hanya tidak lagi jadi jalur utama.

## 8. Migrasi

`scripts/migrate-roles.mjs`, mengikuti pola `migrate-i18n.mjs` yang sudah
terbukti: **dry-run default, `--commit` eksplisit, idempoten, dan wajib
`npx sanity dataset export` lebih dulu.**

Cadangan yang ada di disk, `sanity-backup-2026-09-07.tar.gz`, diambil **sebelum**
migrasi dwibahasa dijalankan — isinya keadaan lama, bukan keadaan sekarang. Jadi
export baru bukan formalitas: tanpa itu, memulihkan keadaan berarti kehilangan
seluruh hasil pekerjaan B.

Tiga tindakan:

1. `siteSettings.roles` diisi daftar di §8.1 — hanya bila `roles` belum ada.
2. `siteSettings.role` di-unset — hanya bila masih ada.
3. `pageContent.deckIntro` diisi teks §8.2 — hanya bila belum ada.

Dijalankan ulang tanpa flag harus melaporkan tidak ada yang perlu dikerjakan.

Nilai `role` lama (`Full Stack Web Developer`) masuk sebagai entri pertama
`roles`, bukan dibuang: itu satu-satunya isi yang benar-benar ditulis pemilik.

### 8.1 Draft peran

| # | EN | ID |
|---|---|---|
| 1 | Full Stack Web Developer | Pengembang Web Full Stack |
| 2 | Data Scientist | Data Scientist |
| 3 | Data Analyst | Analis Data |
| 4 | ML Engineer | ML Engineer |

Yang disebut Dimas adalah "Data Science"; sebagai sebutan peran ditulis "Data
Scientist". Kalau itu salah baca, tinggal disunting di Studio — tidak ada kode
yang bergantung pada teksnya.

### 8.2 Draft perkenalan cover

Baris dipisah `\n`. Keduanya di bawah 4 baris.

**EN** (baris terpanjang 13 karakter → ukuran display 72pt)

```
hi, i'm dimas
i build apps
and turn data
into answers.
```

**ID** (baris terpanjang 17 karakter → otomatis turun ke 52pt)

```
halo, saya dimas,
saya bangun web
dan mengolah data
jadi jawaban.
```

Keduanya draft. Suaranya suara penulis spec ini sampai Dimas menyuntingnya di
Studio, dan itu memang alur yang dipilih.

## 9. Pengujian dan verifikasi

**Unit test** (`tests/deck/layout.test.ts`, `node --test`, tanpa runner baru):

- `joinRoles`: daftar kosong → string kosong; satu peran → peran itu; empat
  peran dengan anggaran sempit → berhenti sebelum lewat; satu peran yang lebih
  panjang dari anggaran → terpotong dengan elipsis, bukan hilang.
- `introLines`: teks kosong → `lines` kosong; baris kosong di tengah dibuang;
  lebih dari 4 baris dipotong; baris ≤13 karakter → `display`; >13 → `h1Big`.

**Verifikasi manual:**

1. `pnpm build` — termasuk type-check; `roles` menyentuh lima berkas, jadi
   kesalahan tipe di salah satunya harus muncul di sini.
2. Render dua bahasa, bandingkan jumlah halaman dengan sebelum perubahan:
   `curl -sS -m 240 -o /tmp/deck-id.pdf "http://localhost:3001/api/portfolio/pdf?lang=id"`
   dan `?lang=en`, lalu `pdfinfo`.
3. Buka kedua PDF: cover menyapa, header memuat peran tanpa terpotong di
   tengah kata, slide bio tidak lagi menyapa, kartu `role` memuat daftar.
4. Beranda: peran berputar, dan dengan "reduce motion" menyala teksnya diam.
5. Studio: dokumen `siteSettings` tidak menunjukkan peringatan field tak
   dikenal setelah `role` di-unset.

## 10. Risiko

| Risiko | Mitigasi |
|---|---|
| Migrasi menyentuh data produksi | Dry-run default, `--commit` eksplisit, wajib export cadangan dulu, idempoten |
| `role` di-unset padahal masih ada kode yang membacanya | Field dihapus dari skema dan tipe di commit yang sama; `pnpm build` menangkap pemanggil yang tertinggal sebelum migrasi dijalankan |
| Kalimat ID lebih panjang dan merusak susunan baris cover | `introLines` menurunkan ukuran huruf otomatis; ambangnya diuji |
| Peran berputar mengganggu pembaca layar atau pengguna sensitif gerak | `aria-hidden` + `aria-label` daftar penuh, dan `useReducedMotion` mematikan rotasi |
| Teks draft terasa bukan suara Dimas | Memang draft; seluruhnya bisa disunting di Studio tanpa deploy |
