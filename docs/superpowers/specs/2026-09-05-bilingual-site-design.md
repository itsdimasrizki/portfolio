# Situs Dwibahasa ID/EN — Design Spec

**Tanggal:** 2026-09-05
**Status:** Menunggu review
**Ruang lingkup:** Menjadikan situs portofolio dwibahasa (Indonesia primary, Inggris kedua), termasuk deck PDF yang mengikuti bahasa terpilih.

---

## 1. Tujuan

Situs ini sekarang hanya berbahasa Inggris. Pembaca utamanya orang Indonesia,
tapi seluruh isinya — bio, cerita, deskripsi proyek — berbahasa Inggris, dan
deck PDF yang diunduh juga begitu.

Setelah pekerjaan ini:

1. `/id/...` dan `/en/...` menyajikan situs yang sama dalam dua bahasa.
2. Bahasa Indonesia adalah primary.
3. Deck PDF yang digenerate mengikuti bahasa yang sedang dipilih.
4. Prosa panjang yang sekarang terkunci di dalam komponen bisa disunting dari
   Sanity Studio tanpa deploy.

### Non-tujuan

- Bukan menerjemahkan otomatis. Isi bahasa Indonesia ditulis manual oleh
  pemilik portofolio di Sanity Studio.
- Bukan menambah bahasa ketiga. Kalau kelak perlu, arsitekturnya tidak
  menghalangi, tapi tidak ada pekerjaan yang dilakukan sekarang untuk itu.
- Bukan mengubah desain visual situs maupun deck.
- Label kerangka deck **tidak** diterjemahkan (lihat §7).

---

## 2. Keputusan yang sudah diambil

| # | Keputusan | Pilihan | Alasan |
|---|---|---|---|
| 1 | URL | Prefix `/id` dan `/en` | Link per bahasa bisa dibagikan; Google mengindeks keduanya; halaman tetap ter-prerender |
| 2 | Rumah teks | Prosa ke Sanity, label ke kamus kode | Label pendek tak butuh CMS; prosa panjang butuh, dan sekarang tak bisa disunting tanpa deploy |
| 3 | Cakupan terjemahan | Lihat §5.1 | Nama diri tidak diterjemahkan; menerjemahkannya justru keliru |
| 4 | Bentuk skema | Satu dokumen, field jadi objek `{id, en}` | Jumlah dokumen tidak berlipat; tanpa plugin; GROQ bisa memilih bahasa saat query |
| 5 | Fallback | Jatuh ke teks Inggris | Situs `/id` utuh sejak hari pertama, terisi bertahap |
| 6 | Label deck | Tetap Inggris, isi ikut bahasa | Tata letak yang sudah diverifikasi tidak goyah; istilah seperti `credentials` lazim di portofolio Indonesia |
| 7 | URL polos | Cookie → `Accept-Language` → `/id` | Perekrut Indonesia dan asing sama-sama mendarat di bahasa yang benar |
| 8 | Mekanisme | Bikin sendiri, tanpa library i18n | Diukur: hanya 8 link internal dan 0 `useRouter`; nilai jual utama library tidak terpakai |

---

## 3. Realitas data & konten (diverifikasi 2026-09-05)

Jumlah dokumen di Sanity, dihitung langsung lewat API:

| Koleksi | Jumlah |
|---|---|
| `project` | 9 (3 di antaranya featured) |
| `certificate` | 14 |
| `experience` | 8 |
| `skill` | 10 |
| `technology` | 37 |

### 3.1 Teks portofolio tinggal di tiga tempat

Ini temuan yang membentuk keputusan #2, dan tidak terlihat dari luar:

1. **Sanity** — `bio`, `role`, deskripsi proyek/experience/skill, judul sertifikat.
2. **Hardcoded di komponen** — dan justru di sinilah prosa terpanjang berada:
   - `src/components/sections/about/about-story.tsx` — judul + empat paragraf
   - `src/components/sections/hero/hero-content.tsx` — badge `Available for work`,
     headline, dan paragraf deskripsi
   - `src/components/sections/hero/hero-stats.tsx` — tiga label statistik
3. **Label UI** — nav, tombol, label form, judul seksi.

Kelompok 2 tidak bisa disunting tanpa deploy. Pekerjaan ini memindahkannya ke
Sanity, sekaligus membuatnya dwibahasa.

---

## 4. Arsitektur

### 4.1 Struktur route

Semua halaman pindah ke segmen `[locale]`:

```
src/app/
  [locale]/
    layout.tsx          <html lang={locale}>, generateStaticParams
    page.tsx
    about/page.tsx
    projects/page.tsx
    experience/page.tsx
    certificates/page.tsx
    contact/page.tsx
  studio/[[...tool]]/page.tsx    ← TIDAK ikut ter-prefix
  api/...                        ← TIDAK ikut ter-prefix
```

`generateStaticParams` mengembalikan `[{ locale: "id" }, { locale: "en" }]`,
sehingga kedua bahasa tetap ter-prerender seperti sekarang.

**Metadata ikut bahasa.** `export const metadata` yang sekarang statis di
`src/app/layout.tsx` ("Dimas Rizki | Fullstack Software Engineer") berganti
menjadi `generateMetadata({ params })` di `[locale]/layout.tsx`, membaca judul
dan deskripsi dari kamus. Tanpa ini, tab browser dan hasil pencarian tetap
berbahasa Inggris di halaman Indonesia.

**`/studio` dan `/api` wajib dikecualikan.** Sanity Studio adalah aplikasi
tersendiri yang tidak mengerti prefix bahasa, dan endpoint PDF bukan halaman.
Ini kesalahan yang paling mudah terjadi saat memindahkan folder.

### 4.2 Middleware

`src/middleware.ts` menangani permintaan tanpa prefix bahasa:

```
1. path diawali /studio, /api, /_next, atau berisi titik (file statis) → lewat
2. path sudah diawali /id atau /en                                    → lewat
3. cookie NEXT_LOCALE berisi locale yang sah                          → redirect ke /<cookie><path>
4. Accept-Language: ambil tag berbobot-q tertinggi; subtag utamanya "en" → /en<path>
5. selain itu                                                          → redirect ke /id<path>
```

Aturan 4 sengaja ditulis sebagai "subtag utama dari tag berbobot-q tertinggi",
bukan "mengandung en". `id-ID,id;q=0.9,en;q=0.8` mengandung `en` tapi pembacanya
jelas memilih Indonesia.

Konsekuensi yang diterima: halaman root tidak lagi murni statis.

### 4.3 Aliran data & fallback

Tiap halaman menerima `params.locale` dan meneruskannya ke service. **Query GROQ
tidak berubah sama sekali** — field yang kini objek tetap terpilih apa adanya.
Yang memilih bahasa adalah pemeta (`toProject`, `toExperience`, dan seterusnya)
yang sudah ada di tiap service, lewat satu fungsi murni:

```ts
description: pickLocalized(raw.description, locale)
categories: (raw.category ?? []).map((item) => pickLocalized(item, locale))
```

Fallback ke Inggris hidup di dalam `pickLocalized`, satu tempat saja.

**Kenapa di JavaScript, bukan di GROQ.** Rancangan awal menaruh fallback di
query sebagai `coalesce(description[$locale], description.en)`. Dua hal
membatalkannya:

1. `coalesce` mengembalikan nilai pertama yang bukan `null`, dan string kosong
   **bukan** `null`. Field Indonesia yang sudah dibuat lalu dikosongkan akan
   mengembalikan `""`, bukan jatuh ke Inggris — persis kasus yang paling sering
   terjadi selama pengisian bertahap.
2. Logika di dalam string GROQ tidak bisa diuji tanpa menghubungi Sanity.
   Sebagai fungsi murni, `pickLocalized` masuk ke `node --test` bersama helper
   lain, dan proyek ini memang hanya punya jaring pengaman di sana.

`pickLocalized` juga menerima string mentah, bukan hanya objek. Itu yang membuat
situs tidak pernah rusak di tengah migrasi: sebelum data dipindah ia
mengembalikan string apa adanya, sesudahnya ia memilih bahasa.

Tipe yang diterima komponen tetap `string` seperti sekarang, jadi tidak ada satu
pun komponen tampilan yang berubah bentuknya.

Tanda tangan service berubah dari `getProjects()` menjadi
`getProjects(locale: Locale)`. Semua service ikut: `project`, `experience`,
`certificate`, `skill`, `technology`, `settings`, `pdf`.

---

## 5. Skema Sanity

### 5.1 Field yang jadi dwibahasa

Dua tipe objek baru dipakai ulang di mana-mana:

```ts
// src/sanity/schemaTypes/localized.schema.ts
localizedString  { id: string, en: string }   // satu baris
localizedText    { id: text,   en: text   }   // paragraf
```

| Dokumen | Field | Tipe baru |
|---|---|---|
| `siteSettings` | `role` | `localizedString` |
| `siteSettings` | `bio` | `localizedText` |
| `project` | `description` | `localizedText` |
| `project` | `category` | array of `localizedString` |
| `experience` | `position` | `localizedString` |
| `experience` | `description` | `localizedText` |
| `skill` | `title` | `localizedString` |
| `skill` | `description` | `localizedText` |
| `certificate` | `title` | `localizedString` |

**Tetap satu versi** karena nama diri — menerjemahkannya justru keliru:
`fullName`, `project.title`, `experience.company`, `experience.location`,
`certificate.issuer`, `technology.name`, `siteSettings.location`, seluruh URL,
email, telepon, tanggal, dan tahun.

`experience.location` memang tampil di situs (`timeline-item.tsx` dan
`experience-card.tsx`) — berbeda dengan deck yang sengaja tidak
menampilkannya — tapi isinya nama institusi seperti
`Universitas Pembangunan Nasional "Veteran" Yogyakarta`, jadi tetap satu versi.

Catatan untuk `certificate.title`: versi ID bersifat opsional. Kalau kosong,
`pickLocalized` mengembalikan judul asli dari penerbit — jadi tidak pernah
tampil kosong sementara 14 sertifikat diisi bertahap.

### 5.2 Dokumen baru `pageContent`

Singleton berisi prosa yang sekarang hardcoded:

| Field | Tipe | Asal sekarang |
|---|---|---|
| `heroBadge` | `localizedString` | `hero-content.tsx` — "Available for work" |
| `heroHeadline` | `localizedString` | `hero-content.tsx` — nama + peran |
| `heroDescription` | `localizedText` | `hero-content.tsx` — paragraf deskripsi |
| `storyEyebrow` | `localizedString` | `about-story.tsx` — "My Story" |
| `storyTitle` | `localizedString` | `about-story.tsx` — judul h2 |
| `storyParagraphs` | array of `localizedText` | `about-story.tsx` — empat paragraf |
| `statLabels` | array of `localizedString` | `hero-stats.tsx` — tiga label |

### 5.3 Migrasi

Mengubah `description` dari `text` menjadi objek adalah perubahan **breaking**:
dokumen yang sudah terisi tidak lagi cocok dengan skema baru.

Skrip sekali jalan `scripts/migrate-i18n.mjs`:

1. Untuk tiap field di tabel §5.1, ambil nilai lama (string) dan tulis ulang
   sebagai `{ en: <nilai lama> }`. Field `id` sengaja dibiarkan kosong.
2. Untuk `pageContent`, buat dokumen baru berisi teks yang sekarang hardcoded
   sebagai versi `en`.

Wajib:

- **Mode kering (`--dry-run`) sebagai default.** Menjalankan tanpa flag hanya
  mencetak rencana perubahan, tidak menulis apa pun. Menulis butuh `--commit`
  eksplisit.
- **Cadangan sebelum menulis:** `npx sanity dataset export <dataset> backup.tar.gz`.
  Ini menyentuh data produksi dan tidak bisa dibatalkan.
- **Idempoten.** Field yang sudah berbentuk objek dilewati, sehingga skrip aman
  dijalankan dua kali.

---

## 6. Kamus UI

```
src/i18n/
  config.ts        LOCALES = ["id", "en"], DEFAULT_LOCALE = "id", type Locale
  messages/id.json
  messages/en.json
  dictionary.ts    getMessages(locale), t(messages, key)
  href.ts          localeHref(locale, href)
```

Kunci datar, tanpa plural dan tanpa format tanggal — kebutuhannya tidak sampai
ke sana. Perkiraan 40 kunci: 6 label nav, tombol (`Download CV`, `Portfolio`,
`View Projects`, `View all`, `Let's Connect`), label form kontak, dan judul
seksi.

Server component membaca pesan langsung. Client component menerimanya lewat
props — tidak ada context provider, karena hanya beberapa komponen yang butuh.

### 6.1 Link sadar-bahasa

Delapan link internal (diukur, bukan diperkirakan) memakai
`localeHref(locale, "/projects")` → `/id/projects`. Daftar `navLinks` di
`src/constants/navigation.ts` menyimpan href tanpa prefix; prefix ditambahkan
saat render.

### 6.2 Switcher

Dua tombol `ID` / `EN` di navbar sebelah tombol unduhan pada desktop, dan di
dalam panel `MobileNav` pada layar kecil. Menekan salah satunya menulis cookie
`NEXT_LOCALE` lalu pindah ke path kembarannya (`/id/projects` ↔ `/en/projects`),
bukan kembali ke beranda.

---

## 7. Deck PDF

- Endpoint menerima locale: `/api/portfolio/pdf?lang=id`. Nilai yang tidak
  dikenal jatuh ke `id`.
- `getPortfolioPdfData(locale)` meneruskan `$locale` ke seluruh query.
- `DownloadPortfolioButton` meneruskan bahasa yang sedang aktif.
- Nama file diberi akhiran bahasa: `Dimas-Rizki-Portfolio-Deck-ID.pdf` dan
  `-EN.pdf`, supaya kedua versi tidak saling menimpa di folder unduhan.
- **Label kerangka deck tetap Inggris** — `selected work`, `how i work`,
  `credentials`, `let's build something.`, dan seterusnya. Yang berubah hanya
  isi dari Sanity.

Alasan label tidak ikut: kalimat besar deck (`hero` 108pt, `h1` 44pt) dirancang
pas pada lebar kolomnya, dan padanan Indonesianya jauh lebih panjang —
`hi, i'm dimas — i turn ideas into reliable software.` menjadi
`halo, saya dimas — saya ubah gagasan jadi perangkat lunak yang andal.`
Menerjemahkan label berarti memeriksa ulang tata letak 21 slide.

---

## 8. Pengujian & verifikasi

### 8.1 Unit test (pola `node --test` yang sudah ada)

Tiga fungsi murni, ditulis test-first di `tests/i18n/`:

| Fungsi | Yang diuji |
|---|---|
| `resolveLocale(cookie, acceptLanguage)` | cookie menang; `en-US,en;q=0.9` → `en`; `id-ID` → `id`; kosong → `id`; cookie tak sah diabaikan |
| `localeHref(locale, href)` | `/projects` → `/id/projects`; `/` → `/id`; URL absolut dan `mailto:` dibiarkan utuh; href yang sudah ber-prefix tidak diberi prefix dua kali |
| `pickLocalized(value, locale)` | memilih `.id`; jatuh ke `.en` saat `.id` kosong atau berisi spasi saja; `undefined` saat keduanya kosong |

Seperti `src/pdf/deck/layout.ts`, ketiganya harus **tanpa import** agar bisa
dijalankan langsung oleh `node --test`.

### 8.2 Verifikasi manual

- `pnpm build` bersih, `pnpm test` lolos.
- Buka `/`, `/id`, `/en` dan pastikan pengalihan sesuai §4.2.
- Buka `/studio` dan pastikan **tidak** teralihkan.
- Render deck dalam kedua bahasa dan **lihat keduanya**: `?lang=id` dan
  `?lang=en`. Jumlah halaman dan tata letak harus tetap sama; hanya isinya yang
  berbeda.
- Uji fallback: kosongkan satu field `.id` di Studio, pastikan `/id` menampilkan
  teks Inggrisnya, bukan kosong.

---

## 9. Keputusan tertunda

**Angka statistik di halaman depan.** `hero-stats.tsx` menuliskan `5+` Years
Experience, `12+` Projects, dan `30+` Certificates sebagai teks mati. Data
sebenarnya: **4** tahun (dari `startDate` paling awal, Jan 2022), **9** proyek,
dan **14** sertifikat. Ketiganya lebih besar dari kenyataan.

Deck sudah menurunkan angkanya dari data (`yearsSince`, jumlah dokumen). Jadi
satu pembaca yang membuka situs lalu mengunduh deck akan melihat dua angka
berbeda untuk hal yang sama.

Pekerjaan ini **hanya** memindahkan label statistik ke `pageContent` agar
dwibahasa; angkanya dibiarkan apa adanya. Menurunkannya dari data adalah
perubahan kecil (fungsinya sudah ada di `src/pdf/deck/layout.ts`), tapi itu
keputusan pemilik portofolio, bukan keputusan teknis — karena mengubah angka
yang ditampilkan ke perekrut.

---

## 10. Risiko

| Risiko | Mitigasi |
|---|---|
| Migrasi menyentuh data produksi dan tak bisa dibatalkan | Dry-run sebagai default, `--commit` eksplisit, wajib export cadangan lebih dulu, skrip idempoten |
| `/studio` ikut ter-prefix dan Studio rusak | Dikecualikan di middleware; ada langkah verifikasi khusus di §8.2 |
| Semua halaman pindah folder sekaligus | Dikerjakan sebagai satu langkah tersendiri sebelum ada perubahan lain, agar diff-nya murni perpindahan |
| Situs `/id` tampak "belum diterjemahkan" setelah migrasi | Memang begitu sampai diisi; fallback menjaga situs tetap utuh, dan pengisian bisa bertahap |
| Isi Indonesia tidak pernah selesai diisi | Fallback membuat situs tetap benar tanpa batas waktu; tidak ada bagian yang rusak |
