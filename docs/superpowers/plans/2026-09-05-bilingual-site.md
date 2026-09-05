# Situs Dwibahasa ID/EN — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menjadikan situs portofolio dwibahasa Indonesia/Inggris dengan route ber-prefix, konten Sanity yang bisa diisi dua bahasa, dan deck PDF yang mengikuti bahasa terpilih.

**Architecture:** Route pindah ke `app/(site)/[locale]/` dengan route group kedua `(studio)` agar Sanity Studio punya root layout sendiri. Seluruh logika yang bisa salah diam-diam — pemilihan bahasa dari header, penambahan prefix pada href, dan fallback ke Inggris — hidup di satu file murni tanpa import sehingga bisa diuji `node --test`. Label UI berasal dari kamus JSON di kode; prosa panjang pindah ke Sanity.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Sanity, `@react-pdf/renderer` 4.5, `node --test` bawaan Node 24.

**Spec:** `docs/superpowers/specs/2026-09-05-bilingual-site-design.md`

## Global Constraints

- **Tanpa dependensi npm baru.** Tidak ada `next-intl` atau library i18n lain. Diukur sebelum diputuskan: hanya 8 link internal dan 0 `useRouter` di seluruh situs.
- **`LOCALES = ["id", "en"]`, `DEFAULT_LOCALE = "id"`.** Indonesia adalah primary.
- **`src/i18n/locale.ts` wajib tanpa import apa pun** — file itu dijalankan langsung oleh `node --test`, yang tidak mengerti alias `@/`. Pola yang sama dengan `src/pdf/deck/layout.ts` yang sudah ada.
- **`/studio` dan `/api` tidak pernah ter-prefix bahasa.** Studio adalah aplikasi tersendiri; endpoint PDF bukan halaman.
- **Label kerangka deck tetap Inggris** (`selected work`, `how i work`, `credentials`, `let's build something.`). Yang berubah hanya isi dari Sanity.
- **Fallback selalu ke Inggris**, tidak pernah menyembunyikan bagian. String kosong atau berisi spasi saja dihitung belum terisi.
- **Tidak boleh mengarang data.** Angka statistik halaman depan tidak disentuh di rencana ini (lihat §9 spec).
- **Migrasi Sanity: dry-run default, `--commit` eksplisit, wajib export cadangan lebih dulu, dan idempoten.**
- **Branch:** lanjutkan di `portofolio-v2` dengan commit per task.

### Perintah yang dipakai berulang

```bash
pnpm test           # unit test murni
pnpm build          # termasuk type-check
pnpm dev            # catat portnya; 3000 sering dipakai layanan lain, Next pindah ke 3001

# Render deck kedua bahasa
curl -sS -m 240 -o /tmp/deck-id.pdf "http://localhost:3001/api/portfolio/pdf?lang=id"
curl -sS -m 240 -o /tmp/deck-en.pdf "http://localhost:3001/api/portfolio/pdf?lang=en"
pdfinfo /tmp/deck-id.pdf | grep -E "Pages|Page size"
```

---

## File Structure

| File | Tanggung jawab |
|---|---|
| `src/i18n/locale.ts` | Locale, konstanta, dan seluruh logika murni: `resolveLocale`, `localeHref`, `pickLocalized`. **Tanpa import.** |
| `src/i18n/messages/{id,en}.json` | Kamus label UI, kunci datar bertitik |
| `src/i18n/dictionary.ts` | `getMessages(locale)` + tipe `Messages` |
| `src/middleware.ts` | Pengalihan URL polos ke bahasa yang tepat |
| `src/app/(site)/[locale]/layout.tsx` | Root layout situs: `<html lang>`, Navbar, Footer, `generateStaticParams`, `generateMetadata` |
| `src/app/(studio)/studio/[[...tool]]/layout.tsx` | Root layout kedua, khusus Sanity Studio |
| `src/components/layout/language-switcher.tsx` | Tombol ID/EN, menulis cookie dan pindah path |
| `src/sanity/schemaTypes/localized.schema.ts` | Tipe objek `localizedString` dan `localizedText` |
| `src/sanity/schemaTypes/pageContent.schema.ts` | Singleton berisi prosa yang tadinya hardcoded |
| `scripts/migrate-i18n.mjs` | Migrasi data sekali jalan, dry-run default |
| `tests/i18n/locale.test.ts` | Unit test helper murni |
| `tests/i18n/messages.test.ts` | Uji kesamaan kunci antar kamus |

**Dipindah:** seluruh `src/app/*/page.tsx` ke `src/app/(site)/[locale]/`, dan `src/app/studio/` ke `src/app/(studio)/studio/`.
**Dihapus:** `src/app/layout.tsx` (digantikan dua root layout di dalam route group).

---

### Task 1: Helper bahasa murni + unit test

Seluruh logika yang bisa salah diam-diam ada di sini, dan hanya di sini yang bisa diuji tanpa merender apa pun.

**Files:**
- Create: `src/i18n/locale.ts`
- Create: `tests/i18n/locale.test.ts`

**Interfaces:**
- Consumes: tidak ada. **File ini tidak boleh mengimpor apa pun.**
- Produces:
  - `LOCALES: readonly ["id", "en"]`, `DEFAULT_LOCALE: Locale`, `type Locale = "id" | "en"`
  - `type Localized = { id?: string; en?: string }`
  - `isLocale(value: string | undefined): value is Locale`
  - `resolveLocale(cookie: string | undefined, acceptLanguage: string | undefined): Locale`
  - `localeHref(locale: Locale, href: string): string`
  - `pickLocalized(value: Localized | string | undefined, locale: Locale): string`

- [ ] **Step 1: Tulis test yang gagal**

`tests/i18n/locale.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isLocale, resolveLocale, localeHref, pickLocalized, DEFAULT_LOCALE,
} from "../../src/i18n/locale.ts";

test("isLocale hanya menerima locale yang dikenal", () => {
  assert.equal(isLocale("id"), true);
  assert.equal(isLocale("en"), true);
  assert.equal(isLocale("jv"), false);
  assert.equal(isLocale(undefined), false);
});

test("cookie yang sah selalu menang atas header", () => {
  assert.equal(resolveLocale("en", "id-ID,id;q=0.9"), "en");
  assert.equal(resolveLocale("id", "en-US,en;q=0.9"), "id");
});

test("cookie tak sah diabaikan, bukan dipakai", () => {
  assert.equal(resolveLocale("jv", "en-US,en;q=0.9"), "en");
});

test("header dibaca dari tag berbobot-q tertinggi, bukan sekadar mengandung en", () => {
  assert.equal(resolveLocale(undefined, "en-US,en;q=0.9"), "en");
  // Mengandung "en" tapi pembacanya jelas memilih Indonesia.
  assert.equal(resolveLocale(undefined, "id-ID,id;q=0.9,en;q=0.8"), "id");
  assert.equal(resolveLocale(undefined, "en;q=0.6,id;q=0.9"), "id");
});

test("tanpa cookie dan tanpa header jatuh ke Indonesia", () => {
  assert.equal(resolveLocale(undefined, undefined), "id");
  assert.equal(resolveLocale(undefined, ""), "id");
  assert.equal(DEFAULT_LOCALE, "id");
});

test("localeHref memberi prefix pada path internal", () => {
  assert.equal(localeHref("id", "/projects"), "/id/projects");
  assert.equal(localeHref("en", "/projects"), "/en/projects");
  assert.equal(localeHref("id", "/"), "/id");
});

test("localeHref tidak memberi prefix dua kali", () => {
  assert.equal(localeHref("id", "/id/projects"), "/id/projects");
  assert.equal(localeHref("id", "/en/projects"), "/en/projects");
});

test("localeHref membiarkan yang bukan path internal", () => {
  assert.equal(localeHref("id", "https://github.com/x"), "https://github.com/x");
  assert.equal(localeHref("id", "mailto:a@b.com"), "mailto:a@b.com");
  assert.equal(localeHref("id", "#kontak"), "#kontak");
});

test("localeHref membiarkan berkas statis", () => {
  // /id/resume.pdf akan 404 — berkas ini tidak punya versi bahasa.
  assert.equal(localeHref("id", "/resume.pdf"), "/resume.pdf");
});

test("pickLocalized memilih bahasa yang diminta", () => {
  assert.equal(pickLocalized({ id: "Halo", en: "Hello" }, "id"), "Halo");
  assert.equal(pickLocalized({ id: "Halo", en: "Hello" }, "en"), "Hello");
});

test("pickLocalized jatuh ke Inggris saat versi Indonesia belum diisi", () => {
  assert.equal(pickLocalized({ en: "Hello" }, "id"), "Hello");
  assert.equal(pickLocalized({ id: "", en: "Hello" }, "id"), "Hello");
  // Spasi saja tetap dihitung belum diisi.
  assert.equal(pickLocalized({ id: "   ", en: "Hello" }, "id"), "Hello");
});

test("pickLocalized mengembalikan string kosong bila keduanya kosong", () => {
  assert.equal(pickLocalized(undefined, "id"), "");
  assert.equal(pickLocalized({}, "id"), "");
});

test("pickLocalized menerima string mentah dari data yang belum dimigrasi", () => {
  assert.equal(pickLocalized("teks lama", "id"), "teks lama");
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `pnpm test`
Expected: FAIL dengan `Cannot find module .../src/i18n/locale.ts`.

- [ ] **Step 3: Tulis implementasinya**

`src/i18n/locale.ts`:

```ts
/**
 * Seluruh logika bahasa yang murni.
 * TIDAK BOLEH mengimpor apa pun: file ini dijalankan langsung oleh
 * `node --test`, yang tidak mengerti alias path `@/`.
 */

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "id";

export type Localized = { id?: string; en?: string };

export function isLocale(value: string | undefined): value is Locale {
  return value === "id" || value === "en";
}

/** Tag bahasa dengan bobot-q tertinggi; urutan header jadi penentu saat seri. */
function bestLanguageTag(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const tags = header
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: rawTag.trim(), weight: Number.isNaN(weight) ? 0 : weight };
    })
    .filter((entry) => entry.tag !== "" && entry.tag !== "*");
  if (tags.length === 0) return undefined;
  return tags.reduce((best, entry) => (entry.weight > best.weight ? entry : best)).tag;
}

export function resolveLocale(
  cookie: string | undefined,
  acceptLanguage: string | undefined,
): Locale {
  if (isLocale(cookie)) return cookie;
  const best = bestLanguageTag(acceptLanguage);
  const primary = best?.toLowerCase().split("-")[0];
  return primary === "en" ? "en" : DEFAULT_LOCALE;
}

export function localeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/")) return href;      // mailto:, https://, #anchor
  if (href.includes(".")) return href;         // berkas statis seperti /resume.pdf
  if (href === "/") return `/${locale}`;
  const first = href.slice(1).split("/")[0];
  if (isLocale(first)) return href;            // sudah ber-prefix
  return `/${locale}${href}`;
}

export function pickLocalized(
  value: Localized | string | undefined,
  locale: Locale,
): string {
  if (typeof value === "string") return value; // data yang belum dimigrasi
  if (!value) return "";
  const chosen = value[locale]?.trim();
  if (chosen) return chosen;
  return value.en?.trim() ?? "";
}
```

- [ ] **Step 4: Jalankan test, pastikan lolos**

Run: `pnpm test`
Expected: PASS. Jumlah test naik dari 18 menjadi 31, `fail 0`, tanpa baris warning.

- [ ] **Step 5: Pastikan build tetap bersih**

Run: `pnpm build`
Expected: selesai tanpa error TypeScript.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/locale.ts tests/i18n/locale.test.ts
git commit -m "feat(i18n): add pure locale helpers with unit tests"
```

---

### Task 2: Kamus label UI

**Files:**
- Create: `src/i18n/messages/id.json`, `src/i18n/messages/en.json`
- Create: `src/i18n/dictionary.ts`
- Create: `tests/i18n/messages.test.ts`

**Interfaces:**
- Consumes: `Locale`, `DEFAULT_LOCALE` (Task 1).
- Produces: `getMessages(locale: Locale): Messages`, `type Messages` (kunci datar bertitik).

- [ ] **Step 1: Tulis test yang gagal**

Uji yang benar-benar berharga di sini adalah kesamaan kunci — itu yang menangkap terjemahan yang lupa ditambahkan.

`tests/i18n/messages.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path: string): Record<string, string> {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

const id = read("../../src/i18n/messages/id.json");
const en = read("../../src/i18n/messages/en.json");

test("kedua kamus punya kunci yang sama persis", () => {
  assert.deepEqual(Object.keys(id).sort(), Object.keys(en).sort());
});

test("tidak ada nilai kosong di kamus mana pun", () => {
  for (const [key, value] of Object.entries(id)) {
    assert.ok(value.trim().length > 0, `id.json: "${key}" kosong`);
  }
  for (const [key, value] of Object.entries(en)) {
    assert.ok(value.trim().length > 0, `en.json: "${key}" kosong`);
  }
});

test("kamus Indonesia tidak sekadar menyalin bahasa Inggris", () => {
  // Beberapa kunci memang identik (mis. nama produk), tapi kalau SEMUA sama
  // berarti file Indonesia belum benar-benar diterjemahkan.
  const identical = Object.keys(id).filter((key) => id[key] === en[key]);
  assert.ok(
    identical.length < Object.keys(id).length / 2,
    `terlalu banyak kunci identik: ${identical.length}`,
  );
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `pnpm test`
Expected: FAIL — berkas `id.json` dan `en.json` belum ada (`ENOENT`).

- [ ] **Step 3: Tulis `src/i18n/messages/en.json`**

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.projects": "Projects",
  "nav.experience": "Experience",
  "nav.certificates": "Certificates",
  "nav.contact": "Contact",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "cta.downloadCv": "Download CV",
  "cta.portfolio": "Portfolio",
  "cta.generating": "Generating...",
  "cta.retry": "Retry",
  "cta.viewProjects": "View Projects",
  "cta.viewAll": "View all",
  "cta.letsConnect": "Let's Connect",
  "section.featuredProjects.eyebrow": "Projects",
  "section.featuredProjects.title": "Featured Projects",
  "section.featuredProjects.description": "A selection of things I've designed and built recently.",
  "section.allProjects.eyebrow": "Projects",
  "section.allProjects.title": "Things I've designed and built.",
  "section.allProjects.description": "A selection of projects spanning web apps, dashboards, APIs, and interfaces, built with a focus on performance and clean design.",
  "section.experiencePreview.eyebrow": "Experience",
  "section.experiencePreview.title": "Experience",
  "section.experiencePreview.description": "Companies and teams I've worked with.",
  "section.experienceTimeline.eyebrow": "Experience",
  "section.experienceTimeline.title": "A timeline of my professional journey.",
  "section.experienceTimeline.description": "The companies and teams I've worked with, and the impact I made along the way.",
  "section.featuredCertificates.eyebrow": "Certificates",
  "section.featuredCertificates.title": "Featured Certificates",
  "section.featuredCertificates.description": "Professional certifications and continuous learning.",
  "section.allCertificates.eyebrow": "Certificates",
  "section.allCertificates.title": "Certifications and continuous learning.",
  "section.allCertificates.description": "Professional certifications I've earned while growing as a Fullstack Software Engineer.",
  "section.skills.eyebrow": "Skills",
  "section.skills.title": "What I bring to every project.",
  "section.skills.description": "Beyond the technologies I use, these are the core skills I apply to design, develop, and deliver high-quality software solutions.",
  "section.techStack.eyebrow": "Tech Stack",
  "section.techStack.title": "The technologies I use every day.",
  "section.techStack.description": "A curated set of tools and technologies I use to build modern, scalable, and maintainable applications.",
  "section.contact.eyebrow": "Contact",
  "section.contact.title": "Let's build something together.",
  "section.contact.description": "Have a project in mind or just want to say hello? Send me a message and I'll get back to you as soon as I can.",
  "form.name.label": "Name",
  "form.name.placeholder": "Your name",
  "form.email.label": "Email",
  "form.email.placeholder": "you@example.com",
  "form.subject.label": "Subject",
  "form.subject.placeholder": "What's this about?",
  "form.message.label": "Message",
  "form.message.placeholder": "Tell me about your project or idea...",
  "footer.navigation": "Navigation",
  "footer.social": "Social",
  "footer.tagline": "Fullstack Software Engineer.",
  "meta.home.title": "Dimas Rizki | Fullstack Software Engineer",
  "meta.home.description": "Portfolio website of Dimas Rizki showcasing projects, experience, and certifications.",
  "meta.about.title": "About | Dimas Rizki",
  "meta.about.description": "How Dimas Rizki approaches building software, and the tools and skills behind it.",
  "meta.projects.title": "Projects | Dimas Rizki",
  "meta.projects.description": "A selection of web apps, dashboards, APIs, and interfaces built by Dimas Rizki.",
  "meta.experience.title": "Experience | Dimas Rizki",
  "meta.experience.description": "The teams, labs, and programmes Dimas Rizki has worked with.",
  "meta.certificates.title": "Certificates | Dimas Rizki",
  "meta.certificates.description": "Professional certifications Dimas Rizki has earned.",
  "meta.contact.title": "Contact | Dimas Rizki",
  "meta.contact.description": "Get in touch with Dimas Rizki for freelance projects, collaborations, or full-time opportunities.",
  "language.label": "Language",
  "language.id": "ID",
  "language.en": "EN"
}
```

- [ ] **Step 4: Tulis `src/i18n/messages/id.json`**

```json
{
  "nav.home": "Beranda",
  "nav.about": "Tentang",
  "nav.projects": "Proyek",
  "nav.experience": "Pengalaman",
  "nav.certificates": "Sertifikat",
  "nav.contact": "Kontak",
  "nav.openMenu": "Buka menu",
  "nav.closeMenu": "Tutup menu",
  "cta.downloadCv": "Unduh CV",
  "cta.portfolio": "Portofolio",
  "cta.generating": "Menyiapkan...",
  "cta.retry": "Coba lagi",
  "cta.viewProjects": "Lihat Proyek",
  "cta.viewAll": "Lihat semua",
  "cta.letsConnect": "Mari Terhubung",
  "section.featuredProjects.eyebrow": "Proyek",
  "section.featuredProjects.title": "Proyek Pilihan",
  "section.featuredProjects.description": "Sebagian hal yang saya rancang dan bangun belakangan ini.",
  "section.allProjects.eyebrow": "Proyek",
  "section.allProjects.title": "Yang saya rancang dan bangun.",
  "section.allProjects.description": "Kumpulan proyek mulai dari aplikasi web, dasbor, API, sampai antarmuka — dibangun dengan perhatian pada performa dan desain yang bersih.",
  "section.experiencePreview.eyebrow": "Pengalaman",
  "section.experiencePreview.title": "Pengalaman",
  "section.experiencePreview.description": "Institusi dan tim tempat saya pernah bekerja.",
  "section.experienceTimeline.eyebrow": "Pengalaman",
  "section.experienceTimeline.title": "Lini masa perjalanan profesional saya.",
  "section.experienceTimeline.description": "Institusi dan tim tempat saya bekerja, dan apa yang saya kerjakan di sana.",
  "section.featuredCertificates.eyebrow": "Sertifikat",
  "section.featuredCertificates.title": "Sertifikat Pilihan",
  "section.featuredCertificates.description": "Sertifikasi profesional dan proses belajar yang terus berjalan.",
  "section.allCertificates.eyebrow": "Sertifikat",
  "section.allCertificates.title": "Sertifikasi dan proses belajar yang terus berjalan.",
  "section.allCertificates.description": "Sertifikasi profesional yang saya kumpulkan sambil bertumbuh sebagai Fullstack Software Engineer.",
  "section.skills.eyebrow": "Keahlian",
  "section.skills.title": "Yang saya bawa ke setiap proyek.",
  "section.skills.description": "Di luar teknologi yang saya pakai, inilah keahlian inti yang saya terapkan untuk merancang, membangun, dan mengantarkan perangkat lunak yang berkualitas.",
  "section.techStack.eyebrow": "Perkakas",
  "section.techStack.title": "Teknologi yang saya pakai sehari-hari.",
  "section.techStack.description": "Sekumpulan perkakas dan teknologi yang saya pakai untuk membangun aplikasi yang modern, skalabel, dan mudah dirawat.",
  "section.contact.eyebrow": "Kontak",
  "section.contact.title": "Mari bangun sesuatu bersama.",
  "section.contact.description": "Punya proyek dalam pikiran, atau sekadar ingin menyapa? Kirim pesan dan saya akan membalas secepat yang saya bisa.",
  "form.name.label": "Nama",
  "form.name.placeholder": "Nama kamu",
  "form.email.label": "Email",
  "form.email.placeholder": "kamu@contoh.com",
  "form.subject.label": "Subjek",
  "form.subject.placeholder": "Ini tentang apa?",
  "form.message.label": "Pesan",
  "form.message.placeholder": "Ceritakan proyek atau idemu...",
  "footer.navigation": "Navigasi",
  "footer.social": "Media Sosial",
  "footer.tagline": "Fullstack Software Engineer.",
  "meta.home.title": "Dimas Rizki | Fullstack Software Engineer",
  "meta.home.description": "Situs portofolio Dimas Rizki berisi proyek, pengalaman, dan sertifikasi.",
  "meta.about.title": "Tentang | Dimas Rizki",
  "meta.about.description": "Cara Dimas Rizki membangun perangkat lunak, beserta perkakas dan keahlian di baliknya.",
  "meta.projects.title": "Proyek | Dimas Rizki",
  "meta.projects.description": "Kumpulan aplikasi web, dasbor, API, dan antarmuka yang dibangun Dimas Rizki.",
  "meta.experience.title": "Pengalaman | Dimas Rizki",
  "meta.experience.description": "Tim, laboratorium, dan program yang pernah diikuti Dimas Rizki.",
  "meta.certificates.title": "Sertifikat | Dimas Rizki",
  "meta.certificates.description": "Sertifikasi profesional yang dikumpulkan Dimas Rizki.",
  "meta.contact.title": "Kontak | Dimas Rizki",
  "meta.contact.description": "Hubungi Dimas Rizki untuk proyek lepas, kolaborasi, atau peluang kerja penuh waktu.",
  "language.label": "Bahasa",
  "language.id": "ID",
  "language.en": "EN"
}
```

- [ ] **Step 5: Tulis `src/i18n/dictionary.ts`**

```ts
import en from "./messages/en.json";
import id from "./messages/id.json";
import { DEFAULT_LOCALE, type Locale } from "./locale";

export type Messages = typeof en;
export type MessageKey = keyof Messages;

const MESSAGES: Record<Locale, Messages> = { id, en };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}
```

`Messages` sengaja diturunkan dari `en.json` supaya nama kunci ikut ter-autocomplete dan salah ketik tertangkap type-check.

- [ ] **Step 6: Jalankan test dan build**

Run: `pnpm test`
Expected: PASS, jumlah test naik menjadi 34.

Run: `pnpm build`
Expected: bersih. Bila TypeScript mengeluh soal impor JSON, pastikan `resolveJsonModule` aktif di `tsconfig.json` — di proyek ini sudah.

- [ ] **Step 7: Commit**

```bash
git add src/i18n tests/i18n/messages.test.ts
git commit -m "feat(i18n): add ID/EN UI dictionary with key parity test"
```

---

### Task 3: Restrukturisasi route + middleware

Task paling struktural. Setelah ini `/id/...` dan `/en/...` sudah melayani situs (isinya masih Inggris semua — itu benar dan diharapkan), dan URL polos dialihkan.

**Files:**
- Create: `src/app/(site)/[locale]/layout.tsx`
- Create: `src/app/(studio)/studio/[[...tool]]/layout.tsx`
- Create: `src/middleware.ts`
- Move: `src/app/{page,about,projects,experience,certificates,contact}` → `src/app/(site)/[locale]/`
- Move: `src/app/studio` → `src/app/(studio)/studio`
- Modify: `src/app/(studio)/studio/[[...tool]]/page.tsx` (kedalaman import berubah)
- Delete: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `LOCALES`, `isLocale`, `resolveLocale`, `DEFAULT_LOCALE`, `type Locale` (Task 1); `getMessages` (Task 2).
- Produces: setiap halaman menerima `params: Promise<{ locale: string }>`.

**Kenapa route group.** Kalau semua halaman masuk `[locale]`, `src/app/layout.tsx` tidak bisa lagi jadi root layout — `/studio` akan ikut tertelan segmen bahasa dan Studio rusak. Next.js menyediakan root layout ganda lewat route group: hapus `app/layout.tsx`, lalu beri tiap group root layout-nya sendiri. `(site)` dan `(studio)` tidak muncul di URL.

- [ ] **Step 1: Pindahkan berkas dengan `git mv`**

Pakai `git mv` supaya riwayatnya terjaga dan diff terbaca sebagai perpindahan, bukan hapus-tulis.

```bash
mkdir -p "src/app/(site)/[locale]" "src/app/(studio)"
git mv src/app/page.tsx "src/app/(site)/[locale]/page.tsx"
for dir in about projects experience certificates contact; do
  git mv "src/app/$dir" "src/app/(site)/[locale]/$dir"
done
git mv src/app/studio "src/app/(studio)/studio"
git rm src/app/layout.tsx
ls -R src/app | head -40
```

`src/app/globals.css`, `src/app/favicon.ico`, `src/app/template.tsx`, dan `src/app/api/` **tetap di tempatnya**.

- [ ] **Step 2: Perbaiki kedalaman import di halaman Studio**

`src/app/(studio)/studio/[[...tool]]/page.tsx` mengimpor `sanity.config` dengan path relatif. Folder bertambah satu tingkat, jadi jumlah `../` ikut bertambah:

```tsx
import config from "../../../../../sanity.config";
```

Sebelumnya empat tingkat, sekarang lima. Kalau ini terlewat, Studio gagal di-build dan pesannya tidak menyebut soal pemindahan folder.

- [ ] **Step 3: Tulis root layout situs**

`src/app/(site)/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";

import "../../globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getSiteSettings } from "@/services/settings.service";
import { getMessages } from "@/i18n/dictionary";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/i18n/locale";

const geistSans = Geist({ subsets: ["latin"] });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    title: messages["meta.home.title"],
    description: messages["meta.home.description"],
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Segmen bahasa yang tidak dikenal (mis. /jv/about) harus 404, bukan
  // diam-diam menampilkan bahasa default.
  if (!isLocale(locale)) notFound();

  const { cvUrl } = await getSiteSettings();

  return (
    <html lang={locale}>
      <body className={`${geistSans.className} antialiased`}>
        <MotionProvider>
          <Navbar cvUrl={cvUrl} />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Tulis root layout Studio**

`src/app/(studio)/studio/[[...tool]]/layout.tsx`:

```tsx
export const metadata = {
  title: "Portfolio CMS",
};

/**
 * Root layout kedua. Sengaja TIDAK mengimpor globals.css: Sanity Studio
 * membawa gayanya sendiri, dan preflight Tailwind mengganggu tampilannya.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Tulis middleware**

`src/middleware.ts`:

```ts
import { NextResponse, type NextRequest } from "next/server";

import { isLocale, resolveLocale } from "@/i18n/locale";

const HAS_EXTENSION = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Studio adalah aplikasi tersendiri, /api bukan halaman, dan berkas statis
  // tidak punya versi bahasa. Penjagaan ini digandakan di `matcher` di bawah;
  // keduanya sengaja ada supaya salah satu saja sudah cukup menahan.
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    HAS_EXTENSION.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isLocale(pathname.split("/")[1])) {
    return NextResponse.next();
  }

  const locale = resolveLocale(
    request.cookies.get("NEXT_LOCALE")?.value,
    request.headers.get("accept-language") ?? undefined,
  );

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|studio|.*\\..*).*)"],
};
```

- [ ] **Step 6: Build**

Run: `pnpm build`
Expected: bersih. Daftar route menampilkan `/[locale]`, `/[locale]/about`, dan seterusnya, plus `/studio/[[...tool]]`.

Bila Next mengeluh soal root layout yang hilang, berarti `src/app/layout.tsx` belum terhapus atau salah satu route group belum punya `layout.tsx`.

- [ ] **Step 7: Buktikan pengalihannya, satu per satu**

```bash
pnpm dev   # catat portnya
P=3001
curl -s -o /dev/null -w "/          -> %{http_code} %{redirect_url}\n" "http://localhost:$P/"
curl -s -o /dev/null -w "/projects  -> %{http_code} %{redirect_url}\n" "http://localhost:$P/projects"
curl -s -o /dev/null -w "cookie=en  -> %{http_code} %{redirect_url}\n" --cookie "NEXT_LOCALE=en" "http://localhost:$P/"
curl -s -o /dev/null -w "AL=en-US   -> %{http_code} %{redirect_url}\n" -H "Accept-Language: en-US,en;q=0.9" "http://localhost:$P/"
curl -s -o /dev/null -w "AL=id-ID   -> %{http_code} %{redirect_url}\n" -H "Accept-Language: id-ID,id;q=0.9,en;q=0.8" "http://localhost:$P/"
curl -s -o /dev/null -w "/studio    -> %{http_code} %{redirect_url}\n" "http://localhost:$P/studio"
curl -s -o /dev/null -w "/id        -> %{http_code}\n" "http://localhost:$P/id"
curl -s -o /dev/null -w "/en/about  -> %{http_code}\n" "http://localhost:$P/en/about"
curl -s -o /dev/null -w "/jv        -> %{http_code}\n" "http://localhost:$P/jv"
```

Expected:
- `/` → 307 ke `/id`
- `/projects` → 307 ke `/id/projects`
- cookie `en` → 307 ke `/en`
- `Accept-Language: en-US` → 307 ke `/en`
- `Accept-Language: id-ID,...,en;q=0.8` → 307 ke `/id` (mengandung `en` tapi bobotnya lebih rendah)
- `/studio` → **200, tanpa pengalihan**
- `/id` dan `/en/about` → 200
- `/jv` → 404

- [ ] **Step 8: Lihat halamannya**

Buka `http://localhost:$P/id` di browser dan pastikan situs tampil utuh seperti sebelumnya — navbar, hero, seluruh seksi, footer. Isinya masih berbahasa Inggris; itu benar, terjemahan datang di task berikutnya.

Buka juga `http://localhost:$P/studio` dan pastikan Sanity Studio memuat penuh, bukan halaman putih atau error.

- [ ] **Step 9: Commit**

```bash
git add -A src/app src/middleware.ts
git commit -m "feat(i18n): move pages under [locale] with a separate studio root layout"
```

---

### Task 4: Kerangka layout ikut bahasa

Navbar, menu mobile, footer, dan tombol pengganti bahasa.

**Files:**
- Create: `src/components/layout/language-switcher.tsx`
- Modify: `src/components/layout/navbar.tsx`, `src/components/layout/mobile-nav.tsx`, `src/components/layout/footer.tsx`
- Modify: `src/app/(site)/[locale]/layout.tsx` (meneruskan `locale` ke Navbar dan Footer)
- Modify: `src/constants/navigation.ts`

**Interfaces:**
- Consumes: `localeHref`, `type Locale`, `LOCALES` (Task 1); `getMessages`, `type Messages` (Task 2).
- Produces: `<LanguageSwitcher locale className? />`; `Navbar` dan `Footer` menerima prop `locale: Locale`.

- [ ] **Step 1: Ubah `navLinks` jadi menyimpan kunci, bukan label**

`src/constants/navigation.ts`:

```ts
import type { MessageKey } from "@/i18n/dictionary";

export interface NavLink {
  labelKey: MessageKey;
  href: string;
}

export const navLinks: NavLink[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.projects", href: "/projects" },
  { labelKey: "nav.experience", href: "/experience" },
  { labelKey: "nav.certificates", href: "/certificates" },
  { labelKey: "nav.contact", href: "/contact" },
];
```

`href` sengaja disimpan tanpa prefix bahasa; prefix ditambahkan saat render lewat `localeHref`.

- [ ] **Step 2: Tulis tombol pengganti bahasa**

`src/components/layout/language-switcher.tsx`:

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";

import { LOCALES, isLocale, type Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  className?: string;
};

export function LanguageSwitcher({ locale, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;

    // Cookie diingat setahun supaya kunjungan berikutnya langsung benar.
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;

    // Pindah ke path kembarannya, bukan kembali ke beranda: pembaca yang
    // sedang di /en/projects harus mendarat di /id/projects.
    const segments = pathname.split("/");
    if (isLocale(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || `/${next}`);
  }

  return (
    <div className={cn("flex items-center rounded-md border border-border", className)}>
      {LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => switchTo(item)}
          aria-current={item === locale ? "true" : undefined}
          className={cn(
            "px-2 py-1 text-xs font-medium uppercase transition-colors",
            item === locale
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Ubah navbar**

Di `src/components/layout/navbar.tsx`: tambahkan `locale: Locale` ke `NavbarProps`, ambil `const messages = getMessages(locale)`, dan

- ganti `href={item.href}` menjadi `href={localeHref(locale, item.href)}`
- ganti `{item.label}` menjadi `{messages[item.labelKey]}`
- ganti `href="/"` pada nama menjadi `href={localeHref(locale, "/")}`
- ganti teks `Download CV` menjadi `{messages["cta.downloadCv"]}`
- perbaiki perbandingan `isActive`: `pathname` sekarang berisi prefix bahasa, jadi bandingkan dengan `localeHref(locale, item.href)`, bukan `item.href`
- sisipkan `<LanguageSwitcher locale={locale} className="hidden md:flex" />` di dalam blok `hidden md:flex` bersama tombol unduhan
- teruskan `locale` ke `<MobileNav cvUrl={cvUrl} locale={locale} />`

`getMessages` aman dipanggil di komponen client karena kamusnya JSON statis, bukan permintaan jaringan.

- [ ] **Step 4: Ubah menu mobile**

Di `src/components/layout/mobile-nav.tsx`: tambahkan `locale: Locale` ke props, ambil `messages`, dan

- ganti `href={item.href}` menjadi `href={localeHref(locale, item.href)}`
- ganti `{item.label}` menjadi `{messages[item.labelKey]}`
- perbaiki `isActive` dengan cara yang sama seperti navbar
- ganti `aria-label="Open menu"` menjadi `aria-label={messages["nav.openMenu"]}`
- ganti teks `Download CV` menjadi `{messages["cta.downloadCv"]}`
- ganti `title="Navigation"` pada `SheetContent` menjadi `title={messages["footer.navigation"]}`
- tambahkan `<LanguageSwitcher locale={locale} className="self-start" />` di atas kedua tombol unduhan

- [ ] **Step 5: Ubah footer**

Di `src/components/layout/footer.tsx`: tambahkan `locale: Locale` ke props, ambil `messages`, dan

- ganti `href="/"` menjadi `href={localeHref(locale, "/")}`
- ganti `href={item.href}` menjadi `href={localeHref(locale, item.href)}`
- ganti `{item.label}` menjadi `{messages[item.labelKey]}`
- ganti `Navigation` menjadi `{messages["footer.navigation"]}`
- ganti `Social` menjadi `{messages["footer.social"]}`
- ganti `Fullstack Software Engineer.` menjadi `{messages["footer.tagline"]}`

Tautan media sosial memakai URL absolut, jadi `localeHref` membiarkannya utuh — tidak perlu perlakuan khusus.

- [ ] **Step 6: Teruskan locale dari layout**

Di `src/app/(site)/[locale]/layout.tsx`, ubah pemanggilannya:

```tsx
<Navbar cvUrl={cvUrl} locale={locale} />
{children}
<Footer locale={locale} />
```

`locale` di titik ini sudah lolos `isLocale`, jadi tipenya sudah menyempit menjadi `Locale`.

- [ ] **Step 7: Build dan lihat kedua bahasa**

```bash
pnpm build && pnpm dev
```

Buka `/id` dan `/en`, lalu periksa:
- Navbar `/id` berbunyi Beranda, Tentang, Proyek, Pengalaman, Sertifikat, Kontak; `/en` tetap Inggris
- Menekan `ID`/`EN` saat berada di `/en/projects` memindahkan ke `/id/projects` — **bukan** ke beranda
- Setelah menekan `ID`, buka lagi URL polos `/` dan pastikan mendarat di `/id` (cookie bekerja)
- Item nav yang aktif tersorot dengan benar di kedua bahasa
- Di lebar 360px, panel menu memuat kelima link berbahasa Indonesia plus tombol pengganti bahasa

- [ ] **Step 8: Commit**

```bash
git add src/components/layout src/constants/navigation.ts "src/app/(site)"
git commit -m "feat(i18n): translate layout chrome and add the language switcher"
```

---

### Task 5: Judul seksi, tombol, dan label formulir ikut bahasa

Mekanis tapi banyak: sembilan pemanggilan `SectionHeader`, formulir kontak, dan tombol-tombol.

**Files:**
- Modify: 6 halaman di `src/app/(site)/[locale]/` (meneruskan `locale`)
- Modify: `src/components/sections/projects/{index,projects-list}.tsx`
- Modify: `src/components/sections/experience/{index,experience-timeline}.tsx`
- Modify: `src/components/sections/certificates/{index,certificates-list}.tsx`
- Modify: `src/components/sections/about/{skills,tech-stack,about-hero}.tsx`
- Modify: `src/components/sections/contact/{contact-hero,contact-form}.tsx`
- Modify: `src/components/sections/hero/hero-content.tsx`, `src/components/sections/cta/index.tsx`
- Modify: `src/components/common/download-portfolio-button.tsx`

**Interfaces:**
- Consumes: `localeHref`, `type Locale` (Task 1); `getMessages` (Task 2).
- Produces: setiap komponen seksi menerima prop `locale: Locale`.

- [ ] **Step 1: Contoh lengkap satu berkas**

`src/components/sections/projects/index.tsx` dikerjakan seperti ini, dan berkas lain mengikuti pola yang sama:

```tsx
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";

type FeaturedProjectsProps = {
  projects: Project[];
  locale: Locale;
};

export function FeaturedProjects({ projects, locale }: FeaturedProjectsProps) {
  const messages = getMessages(locale);

  return (
    // ...
    <SectionHeader
      eyebrow={messages["section.featuredProjects.eyebrow"]}
      title={messages["section.featuredProjects.title"]}
      description={messages["section.featuredProjects.description"]}
      action={
        <Button variant="outline" asChild>
          <Link href={localeHref(locale, "/projects")}>
            {messages["cta.viewAll"]}
          </Link>
        </Button>
      }
    />
    // ...
  );
}
```

- [ ] **Step 2: Terapkan ke seluruh pemanggilan `SectionHeader`**

Setiap baris di bawah adalah satu berkas; ketiga prop diganti dengan kunci yang tercantum.

| Berkas | Awalan kunci |
|---|---|
| `sections/projects/index.tsx` | `section.featuredProjects.*` |
| `sections/projects/projects-list.tsx` | `section.allProjects.*` |
| `sections/experience/index.tsx` | `section.experiencePreview.*` |
| `sections/experience/experience-timeline.tsx` | `section.experienceTimeline.*` |
| `sections/certificates/index.tsx` | `section.featuredCertificates.*` |
| `sections/certificates/certificates-list.tsx` | `section.allCertificates.*` |
| `sections/about/skills.tsx` | `section.skills.*` |
| `sections/about/tech-stack.tsx` | `section.techStack.*` |
| `sections/contact/contact-hero.tsx` | `section.contact.*` |

Masing-masing memakai `.eyebrow`, `.title`, dan `.description`.

- [ ] **Step 3: Ganti teks tombol dan tautan**

| Berkas | Teks sekarang | Kunci |
|---|---|---|
| `sections/hero/hero-content.tsx` | `View Projects` | `cta.viewProjects` |
| `sections/hero/hero-content.tsx` | `Download CV` | `cta.downloadCv` |
| `sections/about/about-hero.tsx` | `Let's Connect` | `cta.letsConnect` |
| `sections/projects/index.tsx` | `View all` | `cta.viewAll` |
| `sections/experience/index.tsx` | `View all` | `cta.viewAll` |
| `sections/certificates/index.tsx` | `View all` | `cta.viewAll` |
| `common/download-portfolio-button.tsx` | `Portfolio` | `cta.portfolio` |
| `common/download-portfolio-button.tsx` | `Generating...` | `cta.generating` |
| `common/download-portfolio-button.tsx` | `Retry` | `cta.retry` |

Setiap `<Link href="/...">` internal di berkas-berkas ini dibungkus `localeHref(locale, ...)`. `DownloadPortfolioButton` mendapat prop `locale` baru; pemanggilnya di navbar dan menu mobile ikut meneruskannya.

- [ ] **Step 4: Formulir kontak**

Di `src/components/sections/contact/contact-form.tsx`, ganti empat pasang label dan placeholder:

| Elemen | Label | Placeholder |
|---|---|---|
| `name` | `form.name.label` | `form.name.placeholder` |
| `email` | `form.email.label` | `form.email.placeholder` |
| `subject` | `form.subject.label` | `form.subject.placeholder` |
| `message` | `form.message.label` | `form.message.placeholder` |

- [ ] **Step 5: Teruskan `locale` dari setiap halaman**

Keenam halaman di `src/app/(site)/[locale]/` menerima `params` dan meneruskannya. Contoh untuk `projects/page.tsx`:

```tsx
export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await getAllProjects();

  return (
    <main>
      <ProjectsList projects={projects} locale={locale as Locale} />
    </main>
  );
}
```

Layout sudah memanggil `notFound()` untuk segmen yang tidak dikenal, jadi di halaman `locale` dijamin sah.

Sekalian, **keenam halaman** mendapat `generateMetadata`. `projects/page.tsx` dan `contact/page.tsx` sudah punya `export const metadata` statis yang harus dihapus; empat sisanya belum punya sama sekali dan mewarisi metadata layout, jadi tab browsernya berbunyi sama di semua halaman.

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  return {
    title: messages["meta.projects.title"],
    description: messages["meta.projects.description"],
  };
}
```

Kunci per halaman: `meta.home.*` (`page.tsx`), `meta.about.*`, `meta.projects.*`, `meta.experience.*`, `meta.certificates.*`, `meta.contact.*`.

- [ ] **Step 6: Build dan periksa kedua bahasa**

```bash
pnpm build && pnpm dev
```

Telusuri keenam halaman di `/id` lalu di `/en`. Yang dicari:
- Tidak ada satu pun judul seksi yang masih berbahasa Inggris di `/id`
- Judul tab browser ikut bahasa di tiap halaman, bukan hanya beranda
- Tombol `Lihat semua` membawa ke `/id/projects`, bukan `/projects`
- Formulir kontak berlabel Indonesia di `/id`

Isi dari Sanity — bio, deskripsi proyek, deskripsi pengalaman — **masih berbahasa Inggris di kedua bahasa**. Itu benar; datanya baru dibuat dwibahasa mulai Task 6.

- [ ] **Step 7: Commit**

```bash
git add src/components src/app
git commit -m "feat(i18n): translate section headings, buttons, and the contact form"
```

---

### Task 6: Skema Sanity dwibahasa

Hanya skema. Data belum disentuh, query belum berubah, situs belum terpengaruh.

**Files:**
- Create: `src/sanity/schemaTypes/localized.schema.ts`
- Create: `src/sanity/schemaTypes/pageContent.schema.ts`
- Modify: `src/sanity/schemaTypes/index.ts`
- Modify: `src/sanity/schemaTypes/{siteSettings,project,experience,skill,certificate}.schema.ts`
- Modify: `sanity.config.ts`

**Interfaces:**
- Consumes: tidak ada.
- Produces: tipe objek `localizedString` dan `localizedText`; dokumen `pageContent`.

**Catatan:** setelah task ini, Studio akan menandai dokumen yang sudah ada sebagai tidak valid — datanya masih string sedangkan skemanya kini objek. Itu wajar dan sementara; Task 8 yang memindahkannya. Situs sendiri tidak terpengaruh karena query dan service belum berubah.

- [ ] **Step 1: Tulis tipe objek dwibahasa**

`src/sanity/schemaTypes/localized.schema.ts`:

```ts
import { defineField, defineType } from "sanity";

export const localizedStringSchema = defineType({
  name: "localizedString",
  title: "Teks dwibahasa",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Indonesia",
      description: "Kosongkan bila belum diterjemahkan — situs akan memakai versi English.",
      type: "string",
    }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
});

export const localizedTextSchema = defineType({
  name: "localizedText",
  title: "Paragraf dwibahasa",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Indonesia",
      description: "Kosongkan bila belum diterjemahkan — situs akan memakai versi English.",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
  ],
});
```

- [ ] **Step 2: Tulis skema `pageContent`**

`src/sanity/schemaTypes/pageContent.schema.ts`:

```ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const pageContentSchema = defineType({
  name: "pageContent",
  title: "Page Content",
  type: "document",
  description: "Teks halaman depan dan halaman Tentang yang sebelumnya tertanam di kode.",
  fields: [
    defineField({ name: "heroBadge", title: "Hero — Badge", type: "localizedString" }),
    defineField({ name: "heroHeadline", title: "Hero — Judul", type: "localizedString" }),
    defineField({
      name: "heroHighlight",
      title: "Hero — Judul (bagian berwarna)",
      type: "localizedString",
    }),
    defineField({ name: "heroDescription", title: "Hero — Deskripsi", type: "localizedText" }),
    defineField({ name: "storyEyebrow", title: "Cerita — Eyebrow", type: "localizedString" }),
    defineField({ name: "storyTitle", title: "Cerita — Judul", type: "localizedString" }),
    defineField({
      name: "storyParagraphs",
      title: "Cerita — Paragraf",
      type: "array",
      of: [defineArrayMember({ type: "localizedText" })],
    }),
    defineField({
      name: "statLabels",
      title: "Statistik — Label",
      description: "Tiga label di bawah angka statistik beranda. Angkanya sendiri belum diambil dari data.",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
    }),
  ],
});
```

- [ ] **Step 3: Ubah field dokumen yang ada**

Ganti `type` pada field berikut. Isi lain (`title`, `description` pada `defineField`) dibiarkan.

| Berkas | Field | `type` baru |
|---|---|---|
| `siteSettings.schema.ts` | `role` | `localizedString` |
| `siteSettings.schema.ts` | `bio` | `localizedText` |
| `project.schema.ts` | `description` | `localizedText` |
| `project.schema.ts` | `category` | `array` of `localizedString` |
| `experience.schema.ts` | `position` | `localizedString` |
| `experience.schema.ts` | `description` | `localizedText` |
| `skill.schema.ts` | `title` | `localizedString` |
| `skill.schema.ts` | `description` | `localizedText` |
| `certificate.schema.ts` | `title` | `localizedString` |

Untuk `bio` dan `description`, hapus properti `rows` — tinggi baris sekarang diatur di dalam `localizedText`.

**Jangan sentuh:** `fullName`, `project.title`, `experience.company`, `experience.location`, `certificate.issuer`, `technology.name`, `siteSettings.location`, dan seluruh URL, email, telepon, tanggal, serta tahun. Itu nama diri dan data non-teks.

Perhatian pada `preview` di tiap skema: beberapa memakai `title` atau `description` sebagai judul daftar dokumen di Studio. Field yang berubah jadi objek tidak lagi bisa dipakai langsung. Untuk `skill` dan `certificate` yang `title`-nya kini objek, ubah `preview.select` menjadi `title: "title.en"` supaya daftar dokumennya tetap terbaca.

- [ ] **Step 4: Daftarkan tipe baru**

`src/sanity/schemaTypes/index.ts`:

```ts
import { projectSchema } from "./project.schema";
import { experienceSchema } from "./experience.schema";
import { certificateSchema } from "./certificate.schema";
import { technologySchema } from "./technology.schema";
import { skillSchema } from "./skill.schema";
import { siteSettingsSchema } from "./siteSettings.schema";
import { pageContentSchema } from "./pageContent.schema";
import { localizedStringSchema, localizedTextSchema } from "./localized.schema";

export const schemaTypes = [
  projectSchema,
  experienceSchema,
  certificateSchema,
  technologySchema,
  skillSchema,
  siteSettingsSchema,
  pageContentSchema,
  localizedStringSchema,
  localizedTextSchema,
];
```

- [ ] **Step 5: Tambahkan `pageContent` ke struktur Studio**

Di `sanity.config.ts`, sisipkan tepat sebelum item `Site Settings`:

```tsx
S.listItem()
  .title("Page Content")
  .id("pageContent")
  .child(
    S.document()
      .schemaType("pageContent")
      .documentId("pageContent")
  ),
```

- [ ] **Step 6: Build dan buka Studio**

```bash
pnpm build && pnpm dev
```

Buka `http://localhost:3001/studio`:
- Ada menu **Page Content** dengan seluruh field kosong
- Buka satu Project: field Description kini dua kotak (Indonesia dan English), dan Studio menandai nilai lama sebagai tidak valid — **ini yang diharapkan** sampai Task 8
- Daftar Skills dan Certificates masih menampilkan judul dokumen, bukan `Untitled` (berkat `preview.select` di Step 3)

Situs di `/id` dan `/en` masih berjalan normal.

- [ ] **Step 7: Commit**

```bash
git add src/sanity sanity.config.ts
git commit -m "feat(sanity): add localized field types and the pageContent singleton"
```

---

### Task 7: Service memilih bahasa

Dikerjakan **sebelum** migrasi data, bukan sesudah. `pickLocalized` sengaja menerima string mentah maupun objek, jadi urutan ini membuat situs tidak pernah rusak di tengah jalan: sekarang data masih string dan tetap tampil, setelah Task 8 data jadi objek dan tetap tampil.

**Files:**
- Modify: `src/types/{project,experience,skill,certificate,siteSettings}.ts`
- Modify: `src/services/{project,experience,skill,certificate,settings,pdf}.service.ts`
- Modify: 6 halaman di `src/app/(site)/[locale]/`
- Modify: `src/i18n/messages/{id,en}.json` (3 kunci label kontak)

**Interfaces:**
- Consumes: `pickLocalized`, `type Locale`, `type Localized` (Task 1).
- Produces: seluruh service menerima `locale: Locale` sebagai argumen pertama; tipe domain (`Project`, `Experience`, `Skill`, `Certificate`) **tidak berubah** — tetap `string`.

Inilah inti rancangannya: pemetaan terjadi di service, sehingga tidak satu pun komponen tampilan perlu tahu soal dwibahasa.

- [ ] **Step 1: Longgarkan tipe Sanity**

Contoh `src/types/project.ts`:

```ts
import type { Localized } from "@/i18n/locale";

export interface SanityProject {
  _id: string;
  title: string;
  description: Localized | string;
  images?: string[];
  year: string;
  category?: (Localized | string)[];
  technologies?: SanityTechnology[];
  status?: ProjectStatus;
  github?: string;
  liveDemo?: string;
  order?: number;
}
```

`| string` dipertahankan dengan sengaja, bukan kelalaian: dokumen yang belum dimigrasi masih berisi string, dan tipe ini yang membuat urutan task di atas aman.

Field yang dilonggarkan di berkas lain: `SanityExperience.position`, `SanityExperience.description`, `SanitySkill.title`, `SanitySkill.description`, `SanityCertificate.title`, `SanitySettings.role`, `SanitySettings.bio`.

- [ ] **Step 2: Contoh lengkap satu service**

`src/services/project.service.ts`:

```ts
import { pickLocalized, type Locale } from "@/i18n/locale";

function toProject(raw: SanityProject, locale: Locale): Project {
  return {
    id: raw._id,
    title: raw.title,
    description: pickLocalized(raw.description, locale),
    images: raw.images ?? [],
    year: raw.year,
    categories: (raw.category ?? []).map((item) => pickLocalized(item, locale)),
    technologies: raw.technologies?.map((t) => t.name) ?? [],
    status: raw.status,
    github: raw.github,
    liveDemo: raw.liveDemo,
  };
}

export async function getAllProjects(locale: Locale): Promise<Project[]> {
  try {
    const data = await client.fetch<SanityProject[]>(allProjectsQuery, {}, {
      next: { tags: ["sanity", "project"] },
    });
    return data ? data.map((raw) => toProject(raw, locale)) : [];
  } catch (error) {
    console.warn("Failed to fetch projects from Sanity:", error);
    return [];
  }
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  // ...sama seperti sebelumnya, hanya toProject(raw, locale) dan
  // getAllProjects(locale) pada jalur cadangannya.
}
```

**Query GROQ tidak berubah sama sekali.** Field yang kini objek tetap terpilih apa adanya, dan objeknya sampai ke service dalam bentuk utuh.

- [ ] **Step 3: Terapkan ke service lain**

| Service | Fungsi | Field yang lewat `pickLocalized` |
|---|---|---|
| `experience.service.ts` | `getAllExperiences(locale)` | `position`, `description` |
| `skill.service.ts` | `getSkills(locale)` | `title`, `description` |
| `certificate.service.ts` | `getAllCertificates(locale)`, `getFeaturedCertificates(locale)` | `title` |
| `settings.service.ts` | `getSiteSettings(locale)`, `getPdfSettings(locale)` | `role`, `bio` |
| `pdf.service.ts` | `getPortfolioPdfData(locale)` | meneruskan `locale` ke semua service di atas |

- [ ] **Step 4: Label kontak ikut bahasa**

`getSiteSettings` menyusun `contactInfo` dengan label `Email`, `Phone`, dan `Location` yang tertulis mati. Tambahkan tiga kunci ke **kedua** kamus (uji kesamaan kunci akan menangkap kalau hanya satu yang diisi):

`en.json`: `"contact.email": "Email"`, `"contact.phone": "Phone"`, `"contact.location": "Location"`
`id.json`: `"contact.email": "Email"`, `"contact.phone": "Telepon"`, `"contact.location": "Lokasi"`

Lalu di `settings.service.ts`, ganti `label: "Email"` menjadi `label: messages["contact.email"]`, dan seterusnya. Label media sosial (GitHub, LinkedIn, X, Instagram) adalah nama produk — biarkan.

- [ ] **Step 5: Halaman meneruskan `locale` ke service**

Keenam halaman mengubah pemanggilan service. Contoh `src/app/(site)/[locale]/page.tsx`:

```tsx
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const [featuredProjects, experiences, featuredCertificates, { cvUrl }] =
    await Promise.all([
      getFeaturedProjects(typedLocale),
      getAllExperiences(typedLocale),
      getFeaturedCertificates(typedLocale),
      getSiteSettings(typedLocale),
    ]);
  // ...
}
```

`src/app/(site)/[locale]/layout.tsx` juga memanggil `getSiteSettings()` — tambahkan `locale` di sana.

- [ ] **Step 6: Build dan periksa**

Run: `pnpm build` — bersih. `pnpm test` — 34 lolos.

Buka `/id` dan `/en`. Isi dari Sanity masih berbahasa Inggris di keduanya, karena datanya memang belum dimigrasi dan `pickLocalized` mengembalikan string mentah apa adanya. **Yang penting: tidak ada halaman yang kosong atau error.** Kalau ada teks yang hilang, `pickLocalized` salah dipasang.

- [ ] **Step 7: Commit**

```bash
git add src/types src/services src/app src/i18n
git commit -m "feat(i18n): resolve localized Sanity fields per locale in services"
```

---

### Task 8: Migrasi data Sanity

Satu-satunya task yang menyentuh data produksi, dan satu-satunya yang tidak bisa dibatalkan.

**Files:**
- Create: `scripts/migrate-i18n.mjs`
- Modify: `package.json` (script `migrate:i18n`)

**Interfaces:**
- Consumes: `@sanity/client` (sudah jadi dependensi).
- Produces: seluruh field di tabel Task 6 berbentuk `{ en: <nilai lama> }`; dokumen `pageContent` terisi teks Inggris yang sekarang ada di kode.

- [ ] **Step 1: Siapkan token tulis dan cadangan**

Skrip ini menulis ke dataset, dan itu butuh token yang **belum ada** di `.env.local` (yang ada hanya `NEXT_PUBLIC_SANITY_*`, `SANITY_REVALIDATE_SECRET`, dan kredensial email).

1. Buat token di https://sanity.io/manage → project → API → Tokens, dengan izin **Editor**.
2. Tambahkan ke `.env.local`: `SANITY_API_WRITE_TOKEN=<token>`
3. **Ambil cadangan lebih dulu**, dan pastikan berkasnya benar-benar jadi:

```bash
npx sanity dataset export production ./sanity-backup-$(date +%F).tar.gz
ls -lh sanity-backup-*.tar.gz
```

Jangan lanjut ke langkah berikutnya sebelum berkas cadangan itu ada dan ukurannya masuk akal.

- [ ] **Step 2: Tulis skrip migrasi**

`scripts/migrate-i18n.mjs`:

```js
#!/usr/bin/env node
/**
 * Memindahkan field teks satu bahasa menjadi objek dwibahasa { en: <nilai> },
 * dan menyemai dokumen pageContent dari teks yang sekarang tertanam di kode.
 *
 * Dry-run adalah default. Menulis butuh --commit.
 * Idempoten: field yang sudah berbentuk objek dilewati.
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

const COMMIT = process.argv.includes("--commit");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID dan NEXT_PUBLIC_SANITY_DATASET wajib diisi.");
  process.exit(1);
}
if (COMMIT && !token) {
  console.error("SANITY_API_WRITE_TOKEN wajib diisi untuk --commit.");
  process.exit(1);
}

const client = createClient({
  projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false,
});

/** [tipe dokumen, field, tipe objek tujuan] */
const TEXT_FIELDS = [
  ["siteSettings", "role", "localizedString"],
  ["siteSettings", "bio", "localizedText"],
  ["project", "description", "localizedText"],
  ["experience", "position", "localizedString"],
  ["experience", "description", "localizedText"],
  ["skill", "title", "localizedString"],
  ["skill", "description", "localizedText"],
  ["certificate", "title", "localizedString"],
];

/** [tipe dokumen, field array, tipe objek tiap elemen] */
const ARRAY_FIELDS = [["project", "category", "localizedString"]];

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

async function collectPatches() {
  const patches = [];

  for (const [type, field, objectType] of TEXT_FIELDS) {
    const docs = await client.fetch(
      `*[_type == $type && defined(${field})]{_id, ${field}}`,
      { type },
    );
    for (const doc of docs) {
      const value = doc[field];
      if (isObject(value)) continue;                       // sudah dimigrasi
      if (typeof value !== "string" || value.trim() === "") continue;
      patches.push({
        id: doc._id,
        field,
        preview: value.slice(0, 60),
        next: { _type: objectType, en: value },
      });
    }
  }

  for (const [type, field, objectType] of ARRAY_FIELDS) {
    const docs = await client.fetch(
      `*[_type == $type && defined(${field})]{_id, ${field}}`,
      { type },
    );
    for (const doc of docs) {
      const value = doc[field];
      if (!Array.isArray(value) || value.length === 0) continue;
      if (value.every(isObject)) continue;                 // sudah dimigrasi
      patches.push({
        id: doc._id,
        field,
        preview: value.join(", ").slice(0, 60),
        // Elemen array di Sanity wajib punya _key yang unik.
        next: value.map((item) =>
          isObject(item)
            ? item
            : { _type: objectType, _key: randomUUID().slice(0, 8), en: String(item) },
        ),
      });
    }
  }

  return patches;
}

const PAGE_CONTENT = {
  _id: "pageContent",
  _type: "pageContent",
  heroBadge: { _type: "localizedString", en: "Available for work" },
  heroHeadline: { _type: "localizedString", en: "Dimas Rizki Ardiansyah" },
  heroHighlight: { _type: "localizedString", en: "Fullstack Web Developer." },
  heroDescription: {
    _type: "localizedText",
    en: "I design and build reliable web applications with modern technologies, focusing on performance, maintainability, and user experience.",
  },
  storyEyebrow: { _type: "localizedString", en: "My Story" },
  storyTitle: {
    _type: "localizedString",
    en: "Building software with purpose, not just features.",
  },
  storyParagraphs: [
    "I don't believe software should exist simply because it can be built. Every project I take on starts with one question: What problem does this actually solve?",
    "That mindset has shaped the way I learn and build. From web development and backend systems to IoT and machine learning, I enjoy turning ideas into practical solutions that people can actually use. One of the projects I'm most proud of is a smart agriculture system that combines embedded hardware, real-time communication, and software engineering to automate fertigation processes.",
    "Outside the classroom, I've had the opportunity to mentor students as a Laboratory Assistant and Teaching Assistant while also serving in student organizations. Those experiences taught me that writing code is only one part of engineering. Communicating ideas, collaborating with others, and leading a team are equally important.",
    "I'm still early in my journey, and there's a lot left to learn. But every project, every challenge, and every bug I solve reinforces why I chose this path. I aim to become a software engineer who builds technology that is reliable, scalable, and designed with purpose.",
  ].map((en) => ({ _type: "localizedText", _key: randomUUID().slice(0, 8), en })),
  statLabels: ["Years Experience", "Projects", "Certificates"].map((en) => ({
    _type: "localizedString",
    _key: randomUUID().slice(0, 8),
    en,
  })),
};

async function main() {
  const patches = await collectPatches();
  const existingPageContent = await client.fetch(`*[_id == "pageContent"][0]._id`);

  console.log(`Mode: ${COMMIT ? "COMMIT (menulis)" : "DRY RUN (tidak menulis apa pun)"}`);
  console.log(`Dataset: ${dataset}\n`);

  if (patches.length === 0) {
    console.log("Tidak ada field yang perlu dimigrasi.");
  } else {
    console.log(`${patches.length} field akan dipindah ke { en: ... }:\n`);
    for (const patch of patches) {
      console.log(`  ${patch.id}  .${patch.field}  "${patch.preview}"`);
    }
  }

  console.log(
    existingPageContent
      ? "\npageContent sudah ada — dilewati."
      : "\npageContent belum ada — akan dibuat.",
  );

  if (!COMMIT) {
    console.log("\nJalankan ulang dengan --commit untuk benar-benar menulis.");
    return;
  }

  if (patches.length > 0) {
    const tx = client.transaction();
    for (const patch of patches) {
      tx.patch(patch.id, { set: { [patch.field]: patch.next } });
    }
    await tx.commit();
    console.log(`\n${patches.length} field ditulis.`);
  }

  if (!existingPageContent) {
    await client.create(PAGE_CONTENT);
    console.log("pageContent dibuat.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 3: Tambahkan script ke `package.json`**

```json
"migrate:i18n": "node --env-file=.env.local scripts/migrate-i18n.mjs"
```

- [ ] **Step 4: Jalankan mode kering dan baca hasilnya**

Run: `pnpm migrate:i18n`

Expected: mode `DRY RUN`, **tidak ada** yang ditulis, dan daftar field yang akan dipindah. Dengan data saat ini perkiraannya sekitar 60 field — 9 proyek × 2, 8 experience × 2, 10 skill × 2, 14 certificate × 1, dan 2 dari siteSettings.

Baca daftarnya. Kalau ada dokumen yang tidak kamu kenali atau field yang tidak seharusnya ikut, berhenti dan laporkan sebelum menulis.

- [ ] **Step 5: Jalankan sungguhan**

Run: `pnpm migrate:i18n --commit`

Lalu jalankan lagi tanpa flag: `pnpm migrate:i18n`
Expected: `Tidak ada field yang perlu dimigrasi.` dan `pageContent sudah ada — dilewati.` Itu bukti skripnya idempoten.

- [ ] **Step 6: Periksa Studio dan situs**

Buka `/studio`:
- Peringatan "tidak valid" pada dokumen sudah hilang
- Buka satu Project: kotak English terisi, kotak Indonesia kosong
- **Page Content** terisi teks Inggris

Buka `/id` dan `/en`: keduanya masih menampilkan teks Inggris (karena kotak Indonesia memang masih kosong) dan **tidak ada satu bagian pun yang hilang**. Itu fallback bekerja.

Lalu uji fallback secara langsung: isi kotak Indonesia pada `bio` di Studio, publish, muat ulang `/id`. Bio berubah jadi Indonesia sementara `/en` tetap Inggris.

- [ ] **Step 7: Commit**

```bash
git add scripts/migrate-i18n.mjs package.json
git commit -m "feat(sanity): add the one-shot i18n data migration script"
```

---

### Task 9: Prosa halaman pindah dari kode ke Sanity

Setelah ini, cerita "My Story" dan teks hero bisa disunting dari Studio tanpa deploy — dan ikut dwibahasa.

**Files:**
- Create: `src/types/pageContent.ts`, `src/sanity/queries/pageContent.queries.ts`, `src/services/pageContent.service.ts`
- Modify: `src/components/sections/hero/{index,hero-content,hero-stats}.tsx`
- Modify: `src/components/sections/about/about-story.tsx`
- Modify: `src/app/(site)/[locale]/{page,about/page}.tsx`

**Interfaces:**
- Consumes: `pickLocalized`, `type Locale`, `type Localized` (Task 1).
- Produces: `getPageContent(locale: Locale): Promise<PageContent>` — seluruh medannya `string` atau `string[]`, tidak pernah `null`.

- [ ] **Step 1: Tipe dan query**

`src/types/pageContent.ts`:

```ts
import type { Localized } from "@/i18n/locale";

export interface PageContent {
  heroBadge: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  storyEyebrow: string;
  storyTitle: string;
  storyParagraphs: string[];
  statLabels: string[];
}

export interface SanityPageContent {
  heroBadge?: Localized;
  heroHeadline?: Localized;
  heroHighlight?: Localized;
  heroDescription?: Localized;
  storyEyebrow?: Localized;
  storyTitle?: Localized;
  storyParagraphs?: Localized[];
  statLabels?: Localized[];
}
```

`src/sanity/queries/pageContent.queries.ts`:

```ts
import { groq } from "next-sanity";

export const pageContentQuery = groq`
  *[_type == "pageContent"][0] {
    heroBadge,
    heroHeadline,
    heroHighlight,
    heroDescription,
    storyEyebrow,
    storyTitle,
    storyParagraphs,
    statLabels
  }
`;
```

- [ ] **Step 2: Service**

`src/services/pageContent.service.ts`:

```ts
import { client } from "@/sanity/client";
import { pageContentQuery } from "@/sanity/queries/pageContent.queries";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { PageContent, SanityPageContent } from "@/types/pageContent";

const EMPTY: PageContent = {
  heroBadge: "", heroHeadline: "", heroHighlight: "", heroDescription: "",
  storyEyebrow: "", storyTitle: "", storyParagraphs: [], statLabels: [],
};

export async function getPageContent(locale: Locale): Promise<PageContent> {
  let raw: SanityPageContent | null = null;
  try {
    raw = await client.fetch<SanityPageContent | null>(pageContentQuery, {}, {
      next: { tags: ["sanity", "pageContent"] },
    });
  } catch (error) {
    console.warn("Failed to fetch page content from Sanity:", error);
  }
  if (!raw) return EMPTY;

  return {
    heroBadge: pickLocalized(raw.heroBadge, locale),
    heroHeadline: pickLocalized(raw.heroHeadline, locale),
    heroHighlight: pickLocalized(raw.heroHighlight, locale),
    heroDescription: pickLocalized(raw.heroDescription, locale),
    storyEyebrow: pickLocalized(raw.storyEyebrow, locale),
    storyTitle: pickLocalized(raw.storyTitle, locale),
    storyParagraphs: (raw.storyParagraphs ?? []).map((p) => pickLocalized(p, locale)),
    statLabels: (raw.statLabels ?? []).map((s) => pickLocalized(s, locale)),
  };
}
```

Mengembalikan `EMPTY`, bukan `null`, supaya komponen tidak perlu menjaga-jaga terhadap nilai kosong di setiap tempat.

- [ ] **Step 3: Hero membaca dari Sanity**

`hero-content.tsx` menerima `content: PageContent`, `settings: { fullName?: string; role?: string }`, `locale`, dan `cvUrl`.

- Badge: `{content.heroBadge && <motion.span …>{content.heroBadge}</motion.span>}`
- Judul: `{content.heroHeadline || settings.fullName}` diikuti
  `<span className="text-teal-700">{content.heroHighlight || settings.role}</span>`
- Paragraf: `{content.heroDescription && <motion.p …>{content.heroDescription}</motion.p>}`
- Tombol: `{messages["cta.viewProjects"]}` dan `{messages["cta.downloadCv"]}`, `href={localeHref(locale, "/projects")}`

Cadangan ke `settings.fullName` dan `settings.role` dipilih dengan sengaja: keduanya data nyata yang sudah ada di Sanity, jadi kalau dokumen `pageContent` hilang, hero tetap menampilkan nama dan peran — bukan halaman kosong, dan bukan pula teks yang digandakan di dua tempat.

- [ ] **Step 4: Statistik hanya menukar labelnya**

`hero-stats.tsx` menerima `labels: string[]`. Angka `5+`, `12+`, dan `30+` **dibiarkan apa adanya** — itu keputusan tertunda di §9 spec, bukan bagian dari pekerjaan ini.

```tsx
export function HeroStats({ labels }: { labels: string[] }) {
  const values = ["5+", "12+", "30+"];
  return (
    <div className="grid grid-cols-3 gap-4">
      {values.map((value, i) => (
        <div key={value} className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xs">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{labels[i] ?? ""}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Hero meneruskan ke anaknya**

`hero/index.tsx` adalah yang menerima `content`, `settings`, dan `locale` dari
halaman, lalu membagikannya:

```tsx
<HeroContent content={content} settings={settings} locale={locale} cvUrl={cvUrl} />
<HeroImage />
<HeroStats labels={content.statLabels} />
```

- [ ] **Step 6: Cerita About membaca dari Sanity**

`about-story.tsx` menerima `content: PageContent` dan merender `storyEyebrow`, `storyTitle`, serta memetakan `storyParagraphs`. Keempat paragraf yang sekarang tertulis di dalam JSX dihapus seluruhnya — sumbernya kini Sanity.

```tsx
<div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
  {content.storyParagraphs.map((paragraph, i) => (
    <p key={i}>{paragraph}</p>
  ))}
</div>
```

- [ ] **Step 7: Halaman mengambil dan meneruskan**

`src/app/(site)/[locale]/page.tsx` dan `about/page.tsx` menambahkan `getPageContent(typedLocale)` ke `Promise.all` yang sudah ada, lalu meneruskan hasilnya ke `<Hero>` dan `<AboutStory>`.

- [ ] **Step 8: Build dan periksa**

```bash
pnpm build && pnpm dev
```

- `/id` dan `/en` menampilkan hero dan cerita seperti sebelumnya (masih Inggris — kotak Indonesia belum diisi)
- Di Studio, ubah `storyTitle` Indonesia, publish, muat ulang `/id`: judulnya berubah, `/en` tidak
- Kosongkan sementara `heroHeadline` di Studio dan pastikan hero jatuh ke `fullName`, bukan jadi kosong

- [ ] **Step 9: Commit**

```bash
git add src/types/pageContent.ts src/sanity/queries/pageContent.queries.ts src/services/pageContent.service.ts src/components/sections src/app
git commit -m "feat(i18n): move hero and story prose from components into Sanity"
```

---

### Task 10: Deck mengikuti bahasa

**Files:**
- Modify: `src/app/api/portfolio/pdf/route.ts`
- Modify: `src/components/common/download-portfolio-button.tsx`

**Interfaces:**
- Consumes: `getPortfolioPdfData(locale)` (Task 7); `isLocale`, `DEFAULT_LOCALE`, `type Locale` (Task 1).
- Produces: endpoint menerima `?lang=id|en`.

- [ ] **Step 1: Endpoint membaca parameter bahasa**

`src/app/api/portfolio/pdf/route.ts`:

```ts
export async function GET(request: Request): Promise<Response> {
  try {
    const lang = new URL(request.url).searchParams.get("lang") ?? undefined;
    const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

    const data = await getPortfolioPdfData(locale);

    const pdfBuffer = await renderToBuffer(
      React.createElement(PortfolioPdf, { data }) as ReactElement<DocumentProps>
    );

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Dimas-Rizki-Portfolio-Deck-${locale.toUpperCase()}.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    // ...tidak berubah
  }
}
```

Nilai `lang` yang tidak dikenal jatuh ke `id`, bukan melempar error — tautan yang salah ketik tetap menghasilkan deck.

- [ ] **Step 2: Tombol unduh meneruskan bahasa**

Di `src/components/common/download-portfolio-button.tsx`, gunakan prop `locale` yang sudah ditambahkan di Task 5:

```ts
const response = await fetch(`/api/portfolio/pdf?lang=${locale}`);
// ...
anchor.download = `Dimas-Rizki-Portfolio-Deck-${locale.toUpperCase()}.pdf`;
```

- [ ] **Step 3: Render kedua bahasa dan lihat**

```bash
pnpm dev
P=3001
curl -sS -m 240 -o /tmp/deck-id.pdf -w "id: %{http_code}\n" "http://localhost:$P/api/portfolio/pdf?lang=id"
curl -sS -m 240 -o /tmp/deck-en.pdf -w "en: %{http_code}\n" "http://localhost:$P/api/portfolio/pdf?lang=en"
for f in id en; do
  echo "--- $f"; pdfinfo /tmp/deck-$f.pdf | grep -E "^Pages|Page size"
  pdftotext /tmp/deck-$f.pdf - | grep -c "Invalid Date"
done
rm -rf /tmp/slides && mkdir -p /tmp/slides
pdftoppm -png -r 72 /tmp/deck-id.pdf /tmp/slides/id
```

Expected untuk keduanya: `200`, `Pages: 21`, `Page size: 960 x 540 pts`, dan hitungan `Invalid Date` = `0`.

Lalu **lihat slide-nya**, bukan hanya jumlah halamannya. Yang dicari pada versi `id`:
- Label kerangka masih Inggris — `selected work`, `credentials`, `how i work`. Itu memang keputusannya.
- Isi dari Sanity ikut Indonesia sejauh sudah diisi; sisanya Inggris. Tidak boleh ada bagian yang kosong.
- Tata letak tidak berubah: tidak ada teks yang meluber keluar kartu. Kalimat Indonesia lebih panjang, jadi slide bio, kartu experience, dan kartu proyek adalah yang paling mungkin bermasalah — periksa ketiganya secara khusus.

- [ ] **Step 4: Verifikasi menyeluruh**

```bash
pnpm test     # 34 lolos
pnpm build    # bersih
pnpm lint     # 11 error yang sudah ada sebelumnya di src/components/sections/**; tidak boleh bertambah
```

Telusuri sekali lagi keenam halaman di `/id` dan `/en`, lalu `/studio`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/portfolio/pdf/route.ts src/components/common/download-portfolio-button.tsx
git commit -m "feat(deck): generate the deck in the selected language"
```

---

## Catatan untuk pelaksana

- **Jangan menambah dependensi.** Sudah diukur bahwa library i18n tidak sepadan di sini: 8 link internal, 0 `useRouter`.
- **`src/i18n/locale.ts` tanpa import, selamanya.** Begitu ada satu `import`, `node --test` tidak bisa lagi menjalankannya dan seluruh jaring pengaman logika bahasa ikut hilang.
- **Urutan Task 7 sebelum Task 8 itu disengaja.** `pickLocalized` menerima string mentah maupun objek, jadi situs tidak pernah rusak di antara keduanya. Membalik urutannya akan membuat React mencoba merender objek dan halaman error.
- **Task 8 tidak bisa dibatalkan.** Jangan jalankan `--commit` sebelum berkas cadangan benar-benar ada di disk.
- **Jangan menyentuh angka statistik beranda.** `5+`, `12+`, `30+` adalah keputusan tertunda di §9 spec; pemiliknya yang memutuskan, bukan pelaksana.
- **Label kerangka deck tetap Inggris.** Kalau tergoda menerjemahkannya, baca §7 spec dulu: itu berarti memeriksa ulang tata letak 21 slide.
- **`/studio` adalah kenari.** Setiap kali menyentuh routing atau middleware, buka `/studio` dan pastikan masih hidup.
