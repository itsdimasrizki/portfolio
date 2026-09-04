# Portfolio Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti PDF portofolio A4 portrait dengan deck presentasi 16:9 bertema Swiss Brutalist + aksen pixel yang dirender dari data Sanity yang sama.

**Architecture:** Satu kosakata primitif visual (`Slide`, `BigType`, `Chip`, `PixelBar`, `Dither`, `BleedCircle`, `Card`) dipakai ulang oleh 14 komponen slide. Helper tata letak murni (`layout.ts`) memegang seluruh logika yang bisa salah — paginasi, pemotongan teks, format tanggal, ritme asimetri — sehingga bisa diuji unit tanpa merender PDF. `portfolio-pdf.tsx` hanya menyusun slide berdasarkan data yang tersedia.

**Tech Stack:** Next.js 16 (App Router), React 19, `@react-pdf/renderer` 4.5, TypeScript 5, Sanity, `node --test` bawaan Node 24 (tanpa dependensi test baru).

**Spec:** `docs/superpowers/specs/2026-09-05-portfolio-deck-design.md`

## Global Constraints

- **Tanpa dependensi npm baru.** Tidak ada test runner, tidak ada font loader, tidak ada library layout. `node --test` bawaan Node 24 sudah cukup.
- **Ukuran halaman `[960, 540]` pt** untuk setiap slide, tanpa kecuali.
- **Palet terkunci:** bone `#EAE8E3`, paper `#F5F4F1`, ink `#141414`, blue `#2B44FF`, orange `#FF6B3D`, peach `#F2D9CD`, mauve `#9A5F97`, lilac `#CFCFE6`, white `#FFFFFF`, muted `#8A8880`, mutedOn `#A9B4FF`.
- **Margin slide:** 48pt kiri/kanan, 40pt atas/bawah. Lebar konten 864pt.
- **Label deck berbahasa Inggris**, huruf kecil semua kecuali nama diri (`profile`, `work`, `experience`, `credentials`, `contact`).
- **Tidak boleh mengarang data.** Dilarang: kartu "open to work", label proficiency (`advanced`/`intermediate`) pada `PixelBar`, metrik impact yang tidak ada di Sanity. Bar teknologi selalu berlabel jumlah item.
- **Tidak boleh mencetak `Invalid Date`.** Tanggal tak terparse menghilangkan barisnya.
- **`src/pdf/deck/layout.ts` wajib tanpa import apa pun** — file itu dijalankan langsung oleh `node --test`, yang tidak mengerti alias `@/`.
- **Branch:** kerjakan di branch aktif `portofolio-v2` dengan commit per task. Endpoint PDF akan berada dalam kondisi setengah jadi di tengah rencana; itu diterima karena ini branch fitur.
- **Verifikasi visual wajib** di setiap task yang menghasilkan slide: render, konversi ke PNG, dan benar-benar lihat gambarnya. "Build lolos" bukan verifikasi.

### Perintah yang dipakai berulang

```bash
# Jalankan dev server (catat portnya; bisa bergeser ke 3001)
pnpm dev

# Render deck + potong jadi PNG per slide
curl -sS -m 120 -o /tmp/deck.pdf http://localhost:3001/api/portfolio/pdf
pdfinfo /tmp/deck.pdf | grep -E "Pages|Page size"
rm -rf /tmp/slides && mkdir -p /tmp/slides
pdftoppm -png -r 72 /tmp/deck.pdf /tmp/slides/s

# Uji helper murni
pnpm test
```

`Page size` harus selalu terbaca `960 x 540 pts`.

---

## File Structure

| File | Tanggung jawab |
|---|---|
| `public/fonts/*.ttf` | 4 font statis (Space Grotesk 400/500/700, Silkscreen 400) |
| `src/pdf/deck/fonts.ts` | Registrasi font + fallback Helvetica; mengekspor nama family yang sudah diresolusi |
| `src/pdf/deck/theme.ts` | Token: warna, skala tipografi, dimensi slide |
| `src/pdf/deck/layout.ts` | Helper murni: stagger, paginasi, potong teks, format tanggal, angka turunan. **Tanpa import.** |
| `src/pdf/deck/primitives.tsx` | Kosakata visual yang dipakai semua slide |
| `src/pdf/deck/slides/*.tsx` | 14 komponen slide, satu file satu slide |
| `src/pdf/portfolio-pdf.tsx` | Composer: memilih & mengurutkan slide sesuai data |
| `src/services/pdf.service.ts` | Menambah prefetch gambar jadi data URL |
| `src/types/pdf.ts` | Menambah `profileImage`, `projectImages` |
| `tests/deck/layout.test.ts` | Unit test helper murni |
| `next.config.ts` | `outputFileTracingIncludes` untuk font |
| `tsconfig.json` | Meng-exclude `tests/` |

**Dihapus di Task 10:** `src/pdf/theme.ts`, `src/pdf/page-shell.tsx`, `src/pdf/pages/` (8 file).

---

### Task 1: Fondasi — font, token, dan slide pertama yang bisa dilihat

Task ini membuktikan dua hal yang paling berisiko sekaligus: font kustom benar-benar tertanam di PDF, dan halaman benar-benar 960x540.

**Files:**
- Create: `public/fonts/SpaceGrotesk-{Regular,Medium,Bold}.ttf`, `public/fonts/Silkscreen-Regular.ttf`
- Create: `src/pdf/deck/fonts.ts`, `src/pdf/deck/theme.ts`
- Modify: `src/pdf/portfolio-pdf.tsx` (ditulis ulang jadi deck provisional 1 slide)
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `DISPLAY: string` dan `PIXEL: string` dari `fonts.ts` (nama family yang sudah diresolusi, sudah memperhitungkan fallback); `colors`, `type`, `SLIDE` dari `theme.ts`.
- Consumes: tidak ada.

- [ ] **Step 1: Unduh empat font statis**

Google Fonts hanya menyediakan Space Grotesk sebagai variable font di repo-nya; `@react-pdf/renderer` merender variable font pada instance default saja sehingga bold tidak berfungsi. CSS API dengan User-Agent lawas memberi instance statis.

```bash
mkdir -p public/fonts
for w in 400:Regular 500:Medium 700:Bold; do
  wt=${w%%:*}; nm=${w##*:}
  url=$(curl -sSL -A "Mozilla/4.0" "https://fonts.googleapis.com/css?family=Space+Grotesk:$wt" \
        | grep -o "https://[^)]*\.ttf" | head -1)
  curl -sSL -o "public/fonts/SpaceGrotesk-$nm.ttf" "$url"
done
curl -sSL -o public/fonts/Silkscreen-Regular.ttf \
  "https://github.com/google/fonts/raw/main/ofl/silkscreen/Silkscreen-Regular.ttf"
file public/fonts/*.ttf
```

Expected: empat baris `TrueType Font data`. Bila salah satu kosong atau berisi HTML, hentikan dan perbaiki URL — jangan lanjut dengan font rusak.

- [ ] **Step 2: Tulis `src/pdf/deck/fonts.ts`**

```ts
/**
 * Registrasi font deck. Dijalankan sekali saat modul diimpor.
 * Bila file font tidak ada (mis. tidak ikut ter-bundle di serverless), deck
 * jatuh ke Helvetica supaya endpoint tetap mengembalikan PDF, bukan 500.
 */
import fs from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";

const DIR = path.join(process.cwd(), "public", "fonts");

function file(name: string): string {
  const full = path.join(DIR, name);
  fs.accessSync(full, fs.constants.R_OK);
  return full;
}

let ok = false;

try {
  Font.register({
    family: "SpaceGrotesk",
    fonts: [
      { src: file("SpaceGrotesk-Regular.ttf"), fontWeight: 400 },
      { src: file("SpaceGrotesk-Medium.ttf"), fontWeight: 500 },
      { src: file("SpaceGrotesk-Bold.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Silkscreen",
    fonts: [{ src: file("Silkscreen-Regular.ttf"), fontWeight: 400 }],
  });
  // Tipografi brutalist tidak boleh dipenggal tanda hubung.
  Font.registerHyphenationCallback((word) => [word]);
  ok = true;
} catch (error) {
  console.error("[deck] font registration failed, falling back to Helvetica:", error);
}

export const FONTS_OK = ok;
export const DISPLAY = ok ? "SpaceGrotesk" : "Helvetica";
export const PIXEL = ok ? "Silkscreen" : "Courier";
```

- [ ] **Step 3: Tulis `src/pdf/deck/theme.ts`**

```ts
import { DISPLAY, PIXEL } from "./fonts";

export const colors = {
  bone: "#EAE8E3",
  paper: "#F5F4F1",
  ink: "#141414",
  blue: "#2B44FF",
  orange: "#FF6B3D",
  peach: "#F2D9CD",
  mauve: "#9A5F97",
  lilac: "#CFCFE6",
  white: "#FFFFFF",
  muted: "#8A8880",
  mutedOn: "#A9B4FF",
} as const;

export const SLIDE = {
  w: 960,
  h: 540,
  mx: 48,
  my: 40,
  cw: 864, // 960 - 2*48
} as const;

/** Skala tipografi. lineHeight adalah pengali tanpa satuan (react-pdf). */
export const type = {
  hero:    { fontFamily: DISPLAY, fontWeight: 700, fontSize: 108, lineHeight: 0.92 },
  display: { fontFamily: DISPLAY, fontWeight: 700, fontSize: 72,  lineHeight: 0.95 },
  stat:    { fontFamily: DISPLAY, fontWeight: 700, fontSize: 96,  lineHeight: 0.9 },
  stat2:   { fontFamily: DISPLAY, fontWeight: 700, fontSize: 64,  lineHeight: 0.9 },
  h1Big:   { fontFamily: DISPLAY, fontWeight: 700, fontSize: 52,  lineHeight: 1.0 },
  h1:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 44,  lineHeight: 1.02 },
  num:     { fontFamily: DISPLAY, fontWeight: 700, fontSize: 56,  lineHeight: 0.95 },
  h2:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 26,  lineHeight: 1.1 },
  h3:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 17,  lineHeight: 1.2 },
  body:    { fontFamily: DISPLAY, fontWeight: 400, fontSize: 12,  lineHeight: 1.45 },
  small:   { fontFamily: DISPLAY, fontWeight: 400, fontSize: 10,  lineHeight: 1.4 },
  micro:   { fontFamily: PIXEL,   fontWeight: 400, fontSize: 8,   letterSpacing: 0.6 },
  nano:    { fontFamily: PIXEL,   fontWeight: 400, fontSize: 6.5, letterSpacing: 0.4 },
} as const;
```

- [ ] **Step 4: Ganti `src/pdf/portfolio-pdf.tsx` dengan deck provisional**

Slide sementara ini hanya ada untuk membuktikan font & ukuran halaman. Isinya diganti total di Task 3.

```tsx
import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { colors, SLIDE, type } from "./deck/theme";

export function PortfolioPdf({ data }: { data: PortfolioPdfData }) {
  const name = data.settings.fullName ?? "Portfolio";
  return (
    <Document title={`${name} — Portfolio Deck`} author={name}>
      <Page size={[SLIDE.w, SLIDE.h]} style={{ backgroundColor: colors.bone, padding: SLIDE.mx }}>
        <Text style={{ ...type.micro, color: colors.blue }}>font check — silkscreen pixel</Text>
        <Text style={{ ...type.hero, color: colors.ink }}>Grotesk</Text>
        <Text style={{ ...type.body, color: colors.ink }}>
          Space Grotesk regular 400 — the quick brown fox jumps over the lazy dog.
        </Text>
        <View style={{ flexDirection: "row", marginTop: 16 }}>
          {[colors.blue, colors.orange, colors.ink, colors.peach, colors.mauve].map((c) => (
            <View key={c} style={{ width: 60, height: 40, backgroundColor: c, marginRight: 8 }} />
          ))}
        </View>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 5: Pastikan font ikut ter-bundle di serverless — `next.config.ts`**

Tambahkan `outputFileTracingIncludes` ke objek konfigurasi yang sudah ada (jangan menimpa opsi lain yang mungkin sudah ada di file):

```ts
outputFileTracingIncludes: {
  "/api/portfolio/pdf": ["./public/fonts/**"],
},
```

- [ ] **Step 6: Render dan buktikan**

```bash
pnpm dev   # catat portnya
curl -sS -m 120 -o /tmp/deck.pdf http://localhost:3001/api/portfolio/pdf
pdfinfo /tmp/deck.pdf | grep -E "Pages|Page size"
pdffonts /tmp/deck.pdf
```

Expected:
- `Page size: 960 x 540 pts`
- `pdffonts` memuat baris yang mengandung `SpaceGrotesk` **dan** `Silkscreen`, keduanya dengan `emb` = `yes`.
- Bila yang muncul hanya `Helvetica`, registrasi gagal — baca log dev server untuk pesan `[deck] font registration failed` dan perbaiki path sebelum lanjut.

- [ ] **Step 7: Lihat hasilnya**

```bash
pdftoppm -png -r 72 /tmp/deck.pdf /tmp/slides/s
```

Buka `/tmp/slides/s-1.png`. Yang harus terlihat: latar bone, kata "Grotesk" sangat besar dengan huruf grotesk (bukan Helvetica), satu baris kecil bergaya pixel, dan lima kotak warna.

- [ ] **Step 8: Commit**

```bash
git add public/fonts src/pdf/deck next.config.ts src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): add 16:9 slide foundation with embedded custom fonts"
```

---

### Task 2: Helper tata letak murni + unit test

Seluruh logika yang bisa salah diam-diam hidup di sini. Ini satu-satunya task dengan siklus TDD sungguhan.

**Files:**
- Create: `src/pdf/deck/layout.ts`
- Create: `tests/deck/layout.test.ts`
- Modify: `package.json` (script `test`), `tsconfig.json` (exclude `tests`)

**Interfaces:**
- Consumes: tidak ada. **File ini tidak boleh mengimpor apa pun** — ia dijalankan langsung oleh `node --test` yang tidak mengerti alias `@/`.
- Produces:
  - `stagger(i: number): number`
  - `heightFor(i: number, base: number): number`
  - `accentFor(i: number): "blue" | "orange" | "ink"`
  - `paginate<T>(items: T[], perPage: number, maxPages: number): T[][]`
  - `truncate(value: string, max: number): string`
  - `scaleTitle(title: string): number`
  - `formatDate(value?: string): string | undefined`
  - `yearRange(start?: string, end?: string): string | undefined`
  - `splitParagraphs(text: string, parts: number): string[]`
  - `yearsSince(dates: (string | undefined)[], now?: Date): number`
  - `pad2(n: number): string`

- [ ] **Step 1: Tambah script test dan exclude folder tests**

`package.json` — tambahkan ke `scripts`:

```json
"test": "node --test \"tests/**/*.test.ts\""
```

`tsconfig.json` — ganti baris `exclude`:

```json
"exclude": ["node_modules", "tests"]
```

Exclude ini wajib: file test mengimpor `../../src/pdf/deck/layout.ts` dengan ekstensi `.ts` eksplisit (dibutuhkan Node), yang akan ditolak `next build` bila ikut di-type-check tanpa `allowImportingTsExtensions`.

- [ ] **Step 2: Tulis test yang gagal**

`tests/deck/layout.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stagger, heightFor, accentFor, paginate, truncate, scaleTitle,
  formatDate, yearRange, splitParagraphs, yearsSince, pad2,
} from "../../src/pdf/deck/layout.ts";

test("stagger cycles through the offset pattern", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(stagger), [0, 28, -14, 34, 8, 0]);
});

test("heightFor varies card height around a base", () => {
  assert.equal(heightFor(0, 400), 400);
  assert.equal(heightFor(1, 400), 360);
  assert.equal(heightFor(5, 400), 400);
});

test("accentFor never repeats on adjacent slides", () => {
  const seq = [0, 1, 2, 3, 4, 5].map(accentFor);
  assert.deepEqual(seq, ["blue", "orange", "ink", "blue", "orange", "ink"]);
  for (let i = 1; i < seq.length; i++) assert.notEqual(seq[i], seq[i - 1]);
});

test("paginate splits, caps pages, and drops the overflow", () => {
  const items = Array.from({ length: 14 }, (_, i) => i);
  const pages = paginate(items, 6, 2);
  assert.equal(pages.length, 2);
  assert.deepEqual(pages[0], [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(pages[1], [6, 7, 8, 9, 10, 11]);
});

test("paginate returns no pages for an empty list", () => {
  assert.deepEqual(paginate([], 6, 2), []);
});

test("truncate cuts on a word boundary and marks the cut", () => {
  assert.equal(truncate("alpha beta gamma delta", 14), "alpha beta…");
});

test("truncate leaves short values untouched", () => {
  assert.equal(truncate("Toko Azizah", 40), "Toko Azizah");
});

test("truncate hard-cuts a single long word", () => {
  assert.equal(truncate("supercalifragilistic", 10), "supercalif…");
});

test("scaleTitle steps down for longer titles", () => {
  assert.equal(scaleTitle("Toko Azizah"), 52);
  assert.equal(scaleTitle("Agro Technology Melon"), 40);
  assert.equal(scaleTitle("Matcha - AI Career Assistance"), 32);
});

test("formatDate returns undefined instead of Invalid Date", () => {
  assert.equal(formatDate(undefined), undefined);
  assert.equal(formatDate(""), undefined);
  assert.equal(formatDate("not a date"), undefined);
});

test("formatDate renders a parseable date as MMM yyyy", () => {
  assert.equal(formatDate("2025-01-15"), "Jan 2025");
});

test("yearRange marks an open-ended range as now", () => {
  assert.equal(yearRange("2025-01-15", undefined), "2025—now");
  assert.equal(yearRange("2022-01-01", "2024-01-01"), "2022—2024");
});

test("yearRange returns undefined when the start is unusable", () => {
  assert.equal(yearRange("nope", "also nope"), undefined);
});

test("splitParagraphs splits on sentence boundaries", () => {
  const out = splitParagraphs("One thing. Two thing. Three thing. Four thing.", 2);
  assert.equal(out.length, 2);
  assert.ok(out[0].startsWith("One thing."));
  assert.ok(out[1].endsWith("Four thing."));
});

test("yearsSince counts from the earliest date and never returns zero", () => {
  const now = new Date("2026-09-05");
  assert.equal(yearsSince(["2024-01-01", "2022-01-01", undefined], now), 4);
  assert.equal(yearsSince([], now), 1);
  assert.equal(yearsSince(["2026-01-01"], now), 1);
});

test("pad2 pads slide numbers", () => {
  assert.equal(pad2(3), "03");
  assert.equal(pad2(23), "23");
});
```

- [ ] **Step 3: Jalankan test, pastikan gagal**

Run: `pnpm test`
Expected: FAIL — `Cannot find module .../src/pdf/deck/layout.ts`.

- [ ] **Step 4: Tulis implementasinya**

`src/pdf/deck/layout.ts`:

```ts
/**
 * Helper tata letak murni untuk deck.
 * TIDAK BOLEH mengimpor apa pun: file ini dijalankan langsung oleh `node --test`,
 * yang tidak mengerti alias path `@/`.
 */

const STAGGER = [0, 28, -14, 34, 8];
const HEIGHT_SCALE = [1, 0.9, 0.95, 0.86, 1.04];
const ACCENTS = ["blue", "orange", "ink"] as const;

export type Accent = (typeof ACCENTS)[number];

export function stagger(i: number): number {
  return STAGGER[i % STAGGER.length];
}

export function heightFor(i: number, base: number): number {
  return Math.round(base * HEIGHT_SCALE[i % HEIGHT_SCALE.length]);
}

export function accentFor(i: number): Accent {
  return ACCENTS[i % ACCENTS.length];
}

export function paginate<T>(items: T[], perPage: number, maxPages: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length && pages.length < maxPages; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  return pages;
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const space = cut.lastIndexOf(" ");
  const kept = space > max * 0.6 ? cut.slice(0, space) : cut;
  return kept.trimEnd() + "…";
}

export function scaleTitle(title: string): number {
  if (title.length > 26) return 32;
  if (title.length > 18) return 40;
  return 52;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Rentang tahun ringkas untuk kartu experience: "2025—now", "2022—2024". */
export function yearRange(start?: string, end?: string): string | undefined {
  const from = formatDate(start)?.split(" ")[1];
  if (!from) return undefined;
  return `${from}—${formatDate(end)?.split(" ")[1] ?? "now"}`;
}

export function splitParagraphs(text: string, parts: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((s) => s.trim()) ?? [text];
  if (parts <= 1 || sentences.length <= 1) return [text.trim()];
  const per = Math.ceil(sentences.length / parts);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += per) {
    out.push(sentences.slice(i, i + per).join(" "));
  }
  return out;
}

export function yearsSince(dates: (string | undefined)[], now: Date = new Date()): number {
  const years = dates
    .map((d) => (d ? new Date(d) : null))
    .filter((d): d is Date => d !== null && !Number.isNaN(d.getTime()))
    .map((d) => d.getUTCFullYear());
  if (years.length === 0) return 1;
  return Math.max(1, now.getUTCFullYear() - Math.min(...years));
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
```

- [ ] **Step 5: Jalankan test, pastikan lolos**

Run: `pnpm test`
Expected: PASS — `pass 16`, `fail 0`.

- [ ] **Step 6: Pastikan build tetap bersih**

Run: `pnpm build`
Expected: selesai tanpa error TypeScript. Bila muncul keluhan soal import berekstensi `.ts`, berarti `exclude` di `tsconfig.json` belum benar.

- [ ] **Step 7: Commit**

```bash
git add src/pdf/deck/layout.ts tests package.json tsconfig.json
git commit -m "feat(deck): add pure layout helpers with unit tests"
```

---

### Task 3: Kosakata visual + slide cover

Primitif dan cover dikerjakan bersama karena saling membuktikan: cover memakai `BleedCircle`, `BigType`, `ChipRow`, dan `PhotoFrame` sekaligus, jadi satu render sudah memvalidasi semuanya.

**Files:**
- Create: `src/pdf/deck/primitives.tsx`, `src/pdf/deck/slides/cover.tsx`
- Modify: `src/pdf/portfolio-pdf.tsx`

**Interfaces:**
- Consumes: `colors`, `SLIDE`, `type` (Task 1); `pad2` (Task 2).
- Produces:
  - `type Tone = "bone" | "paper" | "blue" | "ink" | "orange"`
  - `fgOn(tone: Tone): string`, `mutedOn(tone: Tone): string`
  - `<Slide tone? padded? children>`
  - `<SlideHeader eyebrow tone? rule?>`, `<SlideNumber tone?>`
  - `<BigType lines size? color accentColor? accentLast? style?>`
  - `<Chip label variant? tone?>`, `<ChipRow labels max tone? pattern?>`
  - `<PixelBar value tone? fill? cells? width? cellH?>`
  - `<PixelRule width color? size? gap?>`
  - `<Dither width height color? cell? from? to? invert?>`
  - `<BleedCircle size color corner dx? dy?>`
  - `<PhotoFrame src? width height caption? dashed? tone?>`
  - `<StatCard value label tone? width height size? dither? valueColor?>`
  - `<CoverSlide settings technologies photo?>`

- [ ] **Step 1: Tulis `src/pdf/deck/primitives.tsx`**

Dua aturan yang harus dipatuhi seluruh slide dan sudah dibakukan di sini: `react-pdf` tidak punya `z-index`, jadi **`BleedCircle` harus dirender sebagai anak pertama `Slide`** agar berada di belakang; dan `Dither` membatasi jumlah kotaknya sendiri karena ribuan `View` membuat render sangat lambat.

```tsx
import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { colors, SLIDE, type } from "./theme";
import { pad2 } from "./layout";

export type Tone = "bone" | "paper" | "blue" | "ink" | "orange";

const BG: Record<Tone, string> = {
  bone: colors.bone, paper: colors.paper, blue: colors.blue,
  ink: colors.ink, orange: colors.orange,
};
const FG: Record<Tone, string> = {
  bone: colors.ink, paper: colors.ink, blue: colors.bone,
  ink: colors.bone, orange: colors.ink,
};
const MUTED: Record<Tone, string> = {
  bone: colors.muted, paper: colors.muted, blue: colors.mutedOn,
  ink: "#7A786F", orange: "#8A3E22",
};

export function fgOn(tone: Tone): string { return FG[tone]; }
export function mutedOn(tone: Tone): string { return MUTED[tone]; }

/** Satu slide = satu Page. BleedCircle harus jadi anak pertama agar tampil di belakang. */
export function Slide({
  tone = "bone", padded = true, children,
}: { tone?: Tone; padded?: boolean; children: React.ReactNode }) {
  return (
    <Page
      size={[SLIDE.w, SLIDE.h]}
      style={{
        backgroundColor: BG[tone],
        overflow: "hidden",
        paddingHorizontal: padded ? SLIDE.mx : 0,
        paddingVertical: padded ? SLIDE.my : 0,
      }}
    >
      {children}
    </Page>
  );
}

export function SlideNumber({ tone = "bone" }: { tone?: Tone }) {
  return (
    <Text
      fixed
      style={{ ...type.micro, color: mutedOn(tone) }}
      render={({ pageNumber, totalPages }) => `${pad2(pageNumber)} / ${totalPages}`}
    />
  );
}

export function SlideHeader({
  eyebrow, tone = "bone", rule = true,
}: { eyebrow: string; tone?: Tone; rule?: boolean }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={{ ...type.micro, color: fgOn(tone) }}>{eyebrow}</Text>
        <SlideNumber tone={tone} />
      </View>
      {rule && <View style={{ height: 1.5, backgroundColor: fgOn(tone), marginTop: 8 }} />}
    </View>
  );
}

type BigSize = "hero" | "display" | "h1Big" | "h1";

export function BigType({
  lines, size = "hero", color, accentColor, accentLast = false, style,
}: {
  lines: string[]; size?: BigSize; color: string;
  accentColor?: string; accentLast?: boolean; style?: object;
}) {
  return (
    <View style={style}>
      {lines.map((line, i) => (
        <Text
          key={`${line}-${i}`}
          style={{ ...type[size], color: accentLast && i === lines.length - 1 ? (accentColor ?? color) : color }}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

export type ChipVariant = "outline" | "blue" | "orange" | "ink";

export function Chip({
  label, variant = "outline", tone = "bone",
}: { label: string; variant?: ChipVariant; tone?: Tone }) {
  const skin = {
    outline: { bg: "transparent", fg: fgOn(tone), border: fgOn(tone) },
    blue: { bg: colors.blue, fg: colors.bone, border: colors.blue },
    orange: { bg: colors.orange, fg: colors.ink, border: colors.orange },
    ink: { bg: colors.ink, fg: colors.bone, border: colors.ink },
  }[variant];
  return (
    <View style={{
      borderWidth: 1, borderColor: skin.border, backgroundColor: skin.bg,
      paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 6,
    }}>
      <Text style={{ ...type.small, fontWeight: 500, color: skin.fg }}>{label}</Text>
    </View>
  );
}

function chipVariant(i: number): ChipVariant {
  if (i !== 0 && i % 5 === 0) return "blue";
  if (i !== 0 && i % 7 === 0) return "orange";
  return "outline";
}

export function ChipRow({
  labels, max, tone = "bone", pattern = true,
}: { labels: string[]; max: number; tone?: Tone; pattern?: boolean }) {
  const shown = labels.slice(0, max);
  const rest = labels.length - shown.length;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {shown.map((label, i) => (
        <Chip key={`${label}-${i}`} label={label} tone={tone}
              variant={pattern ? chipVariant(i) : "outline"} />
      ))}
      {rest > 0 && <Chip label={`+${rest}`} tone={tone} variant="ink" />}
    </View>
  );
}

/** Progress bar dari kotak diskrit — bukan bar mulus. */
export function PixelBar({
  value, fill = colors.blue, empty = "#D9D7D0", cells = 20, width = 380, cellH = 8,
}: { value: number; fill?: string; empty?: string; cells?: number; width?: number; cellH?: number }) {
  const gap = 2;
  const cw = (width - gap * (cells - 1)) / cells;
  const filled = Math.max(1, Math.min(cells, Math.round(value * cells)));
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: cells }, (_, i) => (
        <View key={i} style={{
          width: cw, height: cellH, marginRight: i < cells - 1 ? gap : 0,
          backgroundColor: i < filled ? fill : empty,
        }} />
      ))}
    </View>
  );
}

export function PixelRule({
  width, color = colors.ink, size = 3, gap = 3,
}: { width: number; color?: string; size?: number; gap?: number }) {
  const n = Math.floor(width / (size + gap));
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: n }, (_, i) => (
        <View key={i} style={{ width: size, height: size, marginRight: gap, backgroundColor: color }} />
      ))}
    </View>
  );
}

/**
 * Gradient palsu dari kisi kotak — react-pdf tidak punya gradient CSS.
 * Ukuran kotak dinaikkan otomatis agar total kotak tidak melebihi ~1200,
 * karena ribuan View membuat render melambat drastis.
 */
export function Dither({
  width, height, color = colors.ink, cell = 8, from = 0.3, to = 0.02, invert = false,
}: {
  width: number; height: number; color?: string;
  cell?: number; from?: number; to?: number; invert?: boolean;
}) {
  const size = Math.max(cell, Math.ceil(Math.sqrt((width * height) / 1200)));
  const cols = Math.max(1, Math.floor(width / size));
  const rows = Math.max(1, Math.floor(height / size));
  return (
    <View style={{ width, height, overflow: "hidden" }}>
      {Array.from({ length: rows }, (_, r) => {
        const t = rows === 1 ? 0 : r / (rows - 1);
        const p = invert ? 1 - t : t;
        const opacity = from + (to - from) * p;
        return (
          <View key={r} style={{ flexDirection: "row" }}>
            {Array.from({ length: cols }, (_, c) => (
              <View key={c} style={{
                width: size, height: size, backgroundColor: color,
                opacity: (r + c) % 2 === 0 ? opacity : opacity * 0.35,
              }} />
            ))}
          </View>
        );
      })}
    </View>
  );
}

export type Corner = "tl" | "tr" | "bl" | "br";

export function BleedCircle({
  size, color, corner, dx = 0, dy = 0,
}: { size: number; color: string; corner: Corner; dx?: number; dy?: number }) {
  const off = -Math.round(size * 0.38);
  const pos: Record<string, number> = {};
  if (corner === "tl") { pos.left = off + dx; pos.top = off + dy; }
  if (corner === "tr") { pos.right = off - dx; pos.top = off + dy; }
  if (corner === "bl") { pos.left = off + dx; pos.bottom = off - dy; }
  if (corner === "br") { pos.right = off - dx; pos.bottom = off - dy; }
  return (
    <View style={{
      position: "absolute", width: size, height: size,
      borderRadius: size / 2, backgroundColor: color, ...pos,
    }} />
  );
}

export function PhotoFrame({
  src, width, height, caption, dashed = true, tone = "bone",
}: {
  src?: string; width: number; height: number;
  caption?: string; dashed?: boolean; tone?: Tone;
}) {
  return (
    <View style={{ width }}>
      <View style={{
        width, height, overflow: "hidden", backgroundColor: colors.paper,
        borderWidth: dashed ? 1 : 0, borderColor: mutedOn(tone), borderStyle: "dashed",
      }}>
        {src
          ? <Image src={src} style={{ width, height, objectFit: "cover" }} />
          : <Dither width={width} height={height} />}
      </View>
      {caption && (
        <View style={{
          backgroundColor: colors.ink, alignSelf: "flex-start",
          paddingHorizontal: 10, paddingVertical: 6,
        }}>
          <Text style={{ ...type.micro, color: colors.bone }}>{caption}</Text>
        </View>
      )}
    </View>
  );
}

export function StatCard({
  value, label, tone = "paper", width, height, size = "stat2",
  dither = false, valueColor,
}: {
  value: string; label: string; tone?: Tone; width: number;
  height: number; size?: "stat" | "stat2"; dither?: boolean; valueColor?: string;
}) {
  return (
    <View style={{
      width, height, backgroundColor: BG[tone], padding: 20, justifyContent: "flex-end",
    }}>
      {dither && (
        <View style={{ position: "absolute", right: 0, top: 0 }}>
          <Dither width={Math.round(width * 0.5)} height={Math.round(height * 0.4)}
                  color={fgOn(tone)} invert />
        </View>
      )}
      <Text style={{ ...type[size], color: valueColor ?? fgOn(tone) }}>{value}</Text>
      <Text style={{ ...type.small, color: mutedOn(tone), marginTop: 8 }}>{label}</Text>
    </View>
  );
}
```

- [ ] **Step 2: Tulis `src/pdf/deck/slides/cover.tsx`**

Teks headline diambil dari kata-kata bio milik pemilik portofolio sendiri ("modern, scalable, and maintainable web applications") — bukan slogan karangan.

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType, ChipRow, PhotoFrame } from "../primitives";
import { colors, type } from "../theme";
import type { SanitySettings } from "@/types/siteSettings";

const NAV = ["profile", "work", "experience", "credentials", "contact"];

export function CoverSlide({
  settings, technologies, photo,
}: { settings: SanitySettings; technologies: string[]; photo?: string }) {
  const name = (settings.fullName ?? "portfolio").toLowerCase();
  const role = (settings.role ?? "").toLowerCase();
  const place = (settings.location ?? "").toLowerCase();

  return (
    <Slide tone="bone">
      <BleedCircle size={520} color={colors.peach} corner="bl" />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={{ ...type.body, fontWeight: 700, color: colors.ink }}>{name}</Text>
        <Text style={{ ...type.small, color: colors.muted }}>
          {role}   ·   {place}   ·   <Text style={{ color: colors.blue }}>portfolio 2026</Text>
        </Text>
      </View>
      <View style={{ height: 1, backgroundColor: colors.ink, marginTop: 10 }} />

      <View style={{ flexDirection: "row", marginTop: 30, flexGrow: 1 }}>
        <View style={{ width: 500, paddingRight: 28 }}>
          <BigType
            size="display"
            lines={["modern,", "scalable,", "maintainable", "web apps."]}
            color={colors.ink}
            accentColor={colors.blue}
            accentLast
          />
          <View style={{ marginTop: 24 }}>
            <ChipRow labels={technologies} max={6} />
          </View>
        </View>
        <View style={{ width: 336 }}>
          <PhotoFrame src={photo} width={336} height={292} caption="fig. 01 — the maker" />
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: colors.ink, marginBottom: 10 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {NAV.map((word) => (
          <Text key={word} style={{ ...type.micro, color: colors.muted }}>{word}</Text>
        ))}
      </View>
    </Slide>
  );
}
```

- [ ] **Step 3: Pakai cover di composer**

Ganti isi `src/pdf/portfolio-pdf.tsx` (slide provisional Task 1 dibuang). `photo` sengaja belum diisi — plumbing gambar baru datang di Task 5, jadi untuk sekarang `PhotoFrame` menampilkan placeholder dither. Itu memang yang ingin dilihat di render ini.

```tsx
import React from "react";
import { Document } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { CoverSlide } from "./deck/slides/cover";

export function PortfolioPdf({ data }: { data: PortfolioPdfData }) {
  const { settings, technologies } = data;
  const name = settings.fullName ?? "Portfolio";
  const techNames = technologies.flatMap((group) => group.items.map((item) => item.name));

  return (
    <Document
      title={`${name} — Portfolio Deck`}
      author={name}
      subject={`${settings.role ?? "Software Engineer"} portfolio deck`}
      creator="Portfolio Deck Generator"
    >
      <CoverSlide settings={settings} technologies={techNames} />
    </Document>
  );
}
```

- [ ] **Step 4: Render dan lihat**

```bash
curl -sS -m 120 -o /tmp/deck.pdf http://localhost:3001/api/portfolio/pdf
pdftoppm -png -r 72 /tmp/deck.pdf /tmp/slides/s
```

Buka `/tmp/slides/s-1.png`. Daftar periksa:
- Lingkaran peach terpotong tepi kiri-bawah dan berada **di belakang** teks, bukan menutupinya.
- Empat baris headline rapat (lineHeight 0.95), baris terakhir biru.
- Enam chip teknologi; chip ke-6 (indeks 5) berlatar biru solid.
- Bingkai foto bergaris putus-putus dengan pola dither di dalamnya dan tab hitam `fig. 01 — the maker` menempel di bawahnya.
- Tidak ada teks yang melewati margin 48pt.

- [ ] **Step 5: Commit**

```bash
git add src/pdf/deck src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): add visual primitives and cover slide"
```

---

### Task 4: Slide struktural — divider, contents, closing

Tiga slide yang tidak bergantung pada koleksi data mana pun, jadi bisa dibuat dan dilihat sekaligus. Divider dipakai ulang empat kali dengan tone berbeda.

**Files:**
- Create: `src/pdf/deck/slides/divider.tsx`, `src/pdf/deck/slides/contents.tsx`, `src/pdf/deck/slides/closing.tsx`
- Modify: `src/pdf/portfolio-pdf.tsx`

**Interfaces:**
- Consumes: primitif Task 3.
- Produces:
  - `<DividerSlide eyebrow lines subline? tone corner>` dengan `tone: "bone" | "blue" | "ink" | "orange"`
  - `<ContentsSlide entries>` dengan `entries: { label: string; page?: number }[]`
  - `<ClosingSlide settings>`

- [ ] **Step 1: `src/pdf/deck/slides/divider.tsx`**

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType, SlideNumber, fgOn, type Corner, type Tone } from "../primitives";
import { colors, type } from "../theme";

export function DividerSlide({
  eyebrow, lines, subline, tone, corner,
}: {
  eyebrow: string; lines: string[]; subline?: string;
  tone: Extract<Tone, "bone" | "blue" | "ink" | "orange">; corner: Corner;
}) {
  const fg = fgOn(tone);
  return (
    <Slide tone={tone}>
      <BleedCircle size={460} color={tone === "bone" ? colors.peach : colors.mauve} corner={corner} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ ...type.micro, color: fg }}>{eyebrow}</Text>
        <SlideNumber tone={tone} />
      </View>
      <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <BigType size="hero" lines={lines} color={fg} />
        {subline && (
          <Text style={{ ...type.body, color: fg, marginTop: 14, maxWidth: 520 }}>{subline}</Text>
        )}
      </View>
    </Slide>
  );
}
```

- [ ] **Step 2: `src/pdf/deck/slides/contents.tsx`**

Lima kartu dengan tinggi dan offset berbeda — inilah penerapan pertama aturan "grid tidak boleh rata". Nomor halaman dihitung composer di Task 10; selama masih `undefined`, barisnya tidak dicetak.

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader } from "../primitives";
import { colors, type } from "../theme";
import { pad2 } from "../layout";

const WIDTH = 158;
const GUTTER = 18;
const HEIGHTS = [408, 372, 390, 352, 408];
const OFFSETS = [0, 24, 8, 36, 0];

export function ContentsSlide({ entries }: { entries: { label: string; page?: number }[] }) {
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="contents" />
      <View style={{ flexDirection: "row" }}>
        {entries.slice(0, 5).map((entry, i) => {
          const last = i === 4;
          const fg = last ? colors.bone : colors.ink;
          return (
            <View
              key={entry.label}
              style={{
                width: WIDTH,
                height: HEIGHTS[i],
                marginTop: OFFSETS[i],
                marginRight: i < 4 ? GUTTER : 0,
                backgroundColor: last ? colors.blue : colors.paper,
                padding: 16,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ ...type.num, color: last ? colors.bone : i % 2 === 0 ? colors.blue : colors.orange }}>
                  {pad2(i + 1)}
                </Text>
                <Text style={{ ...type.h3, color: fg, marginTop: 6 }}>{entry.label}</Text>
              </View>
              {entry.page !== undefined && (
                <Text style={{ ...type.micro, color: last ? colors.mutedOn : colors.muted }}>
                  p. {pad2(entry.page)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
```

- [ ] **Step 3: `src/pdf/deck/slides/closing.tsx`**

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType } from "../primitives";
import { colors, type } from "../theme";
import type { SanitySettings } from "@/types/siteSettings";

export function ClosingSlide({ settings }: { settings: SanitySettings }) {
  const line = [settings.fullName, settings.role, settings.email, settings.portfolioUrl]
    .filter(Boolean)
    .join("  ·  ");
  return (
    <Slide tone="bone">
      <BleedCircle size={430} color={colors.lilac} corner="bl" />
      <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <BigType size="hero" lines={["any", "questions?"]} color={colors.ink} />
        <Text style={{ ...type.body, color: colors.muted, marginTop: 16 }}>{line}</Text>
      </View>
    </Slide>
  );
}
```

- [ ] **Step 4: Rangkai sementara di composer untuk dilihat**

Tambahkan setelah `<CoverSlide …/>` di `src/pdf/portfolio-pdf.tsx` (import ketiganya di atas):

```tsx
<ContentsSlide
  entries={[
    { label: "profile" }, { label: "work" }, { label: "experience" },
    { label: "credentials" }, { label: "contact" },
  ]}
/>
<DividerSlide eyebrow="section 01" lines={["the", "profile"]} tone="bone" corner="bl"
  subline="Who is behind the work, and how they think about building it." />
<DividerSlide eyebrow="section 02" lines={["selected", "work"]} tone="blue" corner="tr"
  subline="What the problem was, what was decided, and what came out of it." />
<DividerSlide eyebrow="section 03" lines={["where i've", "worked"]} tone="ink" corner="tl"
  subline="Teaching, research labs, student organisations, and industry programmes." />
<DividerSlide eyebrow="section 04" lines={["credentials"]} tone="orange" corner="br"
  subline="Scheduled proof of learning — not a substitute for experience." />
<ClosingSlide settings={data.settings} />
```

- [ ] **Step 5: Render dan lihat ketujuh slide**

```bash
curl -sS -m 120 -o /tmp/deck.pdf http://localhost:3001/api/portfolio/pdf
rm -rf /tmp/slides && mkdir -p /tmp/slides
pdftoppm -png -r 72 /tmp/deck.pdf /tmp/slides/s
```

Daftar periksa:
- Slide contents: kelima kartu **tidak** sejajar di atas maupun bawah; kartu ke-5 biru dengan teks bone.
- Empat divider: masing-masing warna berbeda, lingkaran di sudut berbeda, tipografi 108pt terbaca penuh tanpa terpotong tepi kanan.
- Divider `bone` memakai lingkaran peach; tiga lainnya mauve.
- Nomor slide (`03 / 07` dst) muncul di kanan atas setiap slide dan angkanya benar.
- Slide closing: "any questions?" dua baris, lingkaran lilac di kiri bawah.

- [ ] **Step 6: Commit**

```bash
git add src/pdf/deck/slides src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): add divider, contents, and closing slides"
```

---

### Task 5: Plumbing gambar + slide bio

Task ini menambahkan satu-satunya jalur I/O baru di seluruh rencana, lalu langsung membuktikannya lewat slide pertama yang memakai foto.

**Files:**
- Modify: `src/types/pdf.ts`, `src/services/pdf.service.ts`, `src/pdf/portfolio-pdf.tsx`
- Create: `src/pdf/deck/slides/bio.tsx`

**Interfaces:**
- Consumes: `splitParagraphs`, `truncate` (Task 2); primitif Task 3.
- Produces:
  - `PortfolioPdfData` bertambah `profileImage?: string` dan `projectImages: Record<string, string | undefined>`
  - `<BioSlide settings photo?>`

- [ ] **Step 1: Perluas tipe di `src/types/pdf.ts`**

```ts
export interface PortfolioPdfData {
  settings: SanitySettings;
  experiences: Experience[];
  featuredProjects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
  skills: Skill[];
  qrCodeDataUrl: string;
  /** Foto profil sebagai data URL; undefined bila file tidak terbaca. */
  profileImage?: string;
  /** Gambar pertama tiap proyek sebagai data URL, dikunci project.id. */
  projectImages: Record<string, string | undefined>;
}
```

- [ ] **Step 2: Prefetch gambar di `src/services/pdf.service.ts`**

Gambar tidak pernah diserahkan ke react-pdf sebagai URL mentah: satu URL mati akan melempar dan membuat seluruh endpoint jadi 500. Semua kegagalan diserap di sini.

Tambahkan import `fs` dan `path` di atas, lalu fungsi berikut, dan panggil dari `getPortfolioPdfData`:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";

const IMAGE_TIMEOUT_MS = 6000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

async function fetchAsDataUrl(url?: string): Promise<string | undefined> {
  if (!url) return undefined;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error(`not an image (${contentType})`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error(`too large (${buffer.byteLength}b)`);
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.warn("[deck] skipping image", url, error instanceof Error ? error.message : error);
    return undefined;
  }
}

async function readProfileImage(): Promise<string | undefined> {
  try {
    const file = path.join(process.cwd(), "public", "images", "profile", "profile.jpeg");
    const buffer = await fs.readFile(file);
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.warn("[deck] profile image unavailable:", error instanceof Error ? error.message : error);
    return undefined;
  }
}
```

Di dalam `getPortfolioPdfData`, setelah `Promise.all` yang sudah ada dan sebelum `return`:

```ts
const [profileImage, projectImageEntries] = await Promise.all([
  readProfileImage(),
  Promise.all(
    featuredProjects.map(async (project) =>
      [project.id, await fetchAsDataUrl(project.images?.[0])] as const
    )
  ),
]);
const projectImages = Object.fromEntries(projectImageEntries);
```

lalu tambahkan `profileImage` dan `projectImages` ke objek yang dikembalikan.

- [ ] **Step 3: `src/pdf/deck/slides/bio.tsx`**

Tiga frasa di bawah tipografi diambil langsung dari bio pemilik ("clean architecture, intuitive user experiences, efficient backend systems"). Tidak ada kutipan yang dikarang dan tidak ada kartu "open to work" — Sanity tidak menyimpan ketersediaan kerja.

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, BigType, PhotoFrame, PixelRule } from "../primitives";
import { colors, type } from "../theme";
import { splitParagraphs, truncate } from "../layout";
import type { SanitySettings } from "@/types/siteSettings";

const FOCUS = ["clean architecture", "intuitive interfaces", "efficient backends"];

export function BioSlide({ settings, photo }: { settings: SanitySettings; photo?: string }) {
  const first = (settings.fullName ?? "").split(" ")[0]?.toLowerCase() || "me";
  const paragraphs = splitParagraphs(settings.bio ?? "", 2);
  const facts = [
    { key: "location", value: settings.location },
    { key: "role", value: settings.role },
    { key: "email", value: settings.email },
    { key: "portfolio", value: settings.portfolioUrl },
  ].filter((fact): fact is { key: string; value: string } => Boolean(fact.value));

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="01 — profile" />
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 372, marginRight: 36 }}>
          <PhotoFrame src={photo} width={372} height={252} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
            {facts.map((fact, i) => {
              const highlight = i === 3;
              return (
                <View
                  key={fact.key}
                  style={{
                    width: 180, height: 62, padding: 10,
                    marginRight: i % 2 === 0 ? 12 : 0, marginBottom: 12,
                    backgroundColor: highlight ? colors.blue : colors.paper,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ ...type.micro, color: highlight ? colors.mutedOn : colors.muted }}>
                    {fact.key}
                  </Text>
                  <Text style={{
                    ...type.small, fontWeight: 500, marginTop: 4,
                    color: highlight ? colors.bone : colors.ink,
                  }}>
                    {truncate(fact.value, 28)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ width: 456 }}>
          <BigType
            size="h1"
            lines={[`hi, i'm ${first} —`, "i turn ideas into", "reliable software."]}
            color={colors.ink}
            accentColor={colors.blue}
            accentLast
          />
          {paragraphs.map((paragraph, i) => (
            <Text key={i} style={{ ...type.body, color: colors.ink, marginTop: 14 }}>
              {paragraph}
            </Text>
          ))}
          <View style={{ marginTop: 18 }}>
            <PixelRule width={456} color={colors.orange} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            {FOCUS.map((item) => (
              <Text key={item} style={{ ...type.micro, color: colors.muted, marginRight: 22 }}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Slide>
  );
}
```

- [ ] **Step 4: Sambungkan foto ke cover dan bio**

Di `src/pdf/portfolio-pdf.tsx`: ambil `profileImage` dari `data`, teruskan sebagai `photo` ke `<CoverSlide>`, dan sisipkan `<BioSlide settings={settings} photo={profileImage} />` tepat setelah divider `profile`.

- [ ] **Step 5: Render dan lihat**

```bash
curl -sS -m 120 -o /tmp/deck.pdf http://localhost:3001/api/portfolio/pdf
rm -rf /tmp/slides && mkdir -p /tmp/slides && pdftoppm -png -r 72 /tmp/deck.pdf /tmp/slides/s
```

Daftar periksa:
- Cover dan bio kini menampilkan **foto asli**, bukan pola dither.
- Bio: dua paragraf, empat fact card 2x2, kartu `portfolio` biru, garis pixel oranye, tiga frasa fokus.
- Tidak ada teks fact card yang meluber keluar kartu (`truncate` 28 karakter bekerja).
- Log dev server tidak memuat peringatan `[deck] profile image unavailable`.

- [ ] **Step 6: Buktikan jalur gagalnya benar-benar aman**

```bash
mv public/images/profile/profile.jpeg /tmp/profile.bak
curl -sS -m 120 -o /tmp/deck-nophoto.pdf -w "%{http_code}\n" http://localhost:3001/api/portfolio/pdf
mv /tmp/profile.bak public/images/profile/profile.jpeg
```

Expected: `200`, bukan 500. Log memuat `[deck] profile image unavailable`, dan slide bio menampilkan placeholder dither. Ini membuktikan aturan "gambar rusak tidak boleh menjatuhkan endpoint".

- [ ] **Step 7: Commit**

```bash
git add src/types/pdf.ts src/services/pdf.service.ts src/pdf/deck/slides/bio.tsx src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): prefetch images safely and add bio slide"
```

---

### Task 6: Slide numbers + stack

**Files:**
- Create: `src/pdf/deck/slides/numbers.tsx`, `src/pdf/deck/slides/stack.tsx`
- Modify: `src/pdf/portfolio-pdf.tsx`

**Interfaces:**
- Consumes: `yearsSince`, `truncate` (Task 2); `StatCard`, `PixelBar`, `ChipRow`, `BigType`, `SlideHeader` (Task 3).
- Produces:
  - `buildStats(input): { value: string; label: string }[]` diekspor dari `numbers.tsx`
  - `<NumbersSlide experiences featuredProjects certificates technologies>`
  - `<StackSlide technologies>`

- [ ] **Step 1: `src/pdf/deck/slides/numbers.tsx`**

Semua angka dihitung dari data yang benar-benar ada. Tidak ada metrik impact karangan seperti "61%".

```tsx
import React from "react";
import { View } from "@react-pdf/renderer";
import { Slide, SlideHeader, StatCard } from "../primitives";
import { colors } from "../theme";
import { yearsSince } from "../layout";
import type { Experience } from "@/types/experience";
import type { Project } from "@/types/project";
import type { Certificate } from "@/types/certificate";
import type { TechnologyGroup } from "@/types/technology";

type Stat = { value: string; label: string };

export function buildStats(input: {
  experiences: Experience[];
  featuredProjects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
}): Stat[] {
  const { experiences, featuredProjects, certificates, technologies } = input;
  const toolCount = technologies.reduce((sum, group) => sum + group.items.length, 0);

  const lead: Stat = experiences.length
    ? {
        value: String(yearsSince(experiences.map((e) => e.startDate))),
        label: "years building for the web",
      }
    : {
        value: String(new Set(featuredProjects.flatMap((p) => p.categories)).size),
        label: "domains worked in",
      };

  return [
    lead,
    { value: String(featuredProjects.length), label: "projects shipped" },
    { value: String(certificates.length), label: "certifications earned" },
    { value: String(toolCount), label: "tools in daily rotation" },
  ];
}

export function NumbersSlide(props: {
  experiences: Experience[];
  featuredProjects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
}) {
  const [lead, second, third, fourth] = buildStats(props);
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="by the numbers" />
      <View style={{ flexDirection: "row" }}>
        <StatCard value={lead.value} label={lead.label} tone="blue"
                  width={400} height={360} size="stat" dither />
        <View style={{ width: 440, marginLeft: 24 }}>
          <View style={{ flexDirection: "row" }}>
            <StatCard value={second.value} label={second.label} tone="paper" width={208} height={168} />
            <View style={{ width: 24 }} />
            <StatCard value={third.value} label={third.label} tone="paper"
                      width={208} height={168} valueColor={colors.orange} />
          </View>
          <View style={{ marginTop: 24 }}>
            <StatCard value={fourth.value} label={fourth.label} tone="ink" width={440} height={168} />
          </View>
        </View>
      </View>
    </Slide>
  );
}
```

- [ ] **Step 2: `src/pdf/deck/slides/stack.tsx`**

Label bar berbunyi jumlah item, **bukan** tingkat kemahiran — Sanity tidak menyimpan proficiency, dan bar yang panjangnya ditentukan jumlah tool tidak boleh dibaca sebagai klaim keahlian. Legend menyatakannya eksplisit.

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, BigType, ChipRow, PixelBar } from "../primitives";
import { colors, type } from "../theme";
import { truncate } from "../layout";
import type { TechnologyGroup } from "@/types/technology";

const OFFSETS = [0, 12, 0, 10, 0];

export function StackSlide({ technologies }: { technologies: TechnologyGroup[] }) {
  const names = technologies.flatMap((group) => group.items.map((item) => item.name));
  const groups = [...technologies].sort((a, b) => b.items.length - a.items.length).slice(0, 5);
  const max = Math.max(1, ...groups.map((group) => group.items.length));

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="02 — tools" />
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 440, marginRight: 24 }}>
          <BigType size="h1" lines={["the tools", "i reach for"]} color={colors.ink} />
          <View style={{ marginTop: 24 }}>
            <ChipRow labels={names} max={24} />
          </View>
          <Text style={{ ...type.nano, color: colors.muted, marginTop: 14 }}>
            bar length = tools per group, not proficiency
          </Text>
        </View>

        <View style={{ width: 400 }}>
          {groups.map((group, i) => (
            <View
              key={group.title}
              style={{
                width: 388, marginLeft: OFFSETS[i], marginBottom: 12,
                backgroundColor: colors.paper, padding: 16,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                <Text style={{ ...type.h3, color: colors.ink }}>{truncate(group.title, 26)}</Text>
                <Text style={{ ...type.micro, color: colors.muted }}>
                  {group.items.length} tools
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <PixelBar
                  value={group.items.length / max}
                  width={356}
                  fill={i % 2 === 0 ? colors.blue : colors.orange}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </Slide>
  );
}
```

- [ ] **Step 3: Sisipkan keduanya di composer**

Setelah `<BioSlide …/>`, tambahkan `<NumbersSlide …/>` lalu `<StackSlide technologies={technologies} />`, keduanya dibungkus kondisi yang sesuai (`technologies.length > 0` untuk stack).

- [ ] **Step 4: Render dan lihat**

Daftar periksa:
- Angka slide numbers cocok dengan data nyata: **4** tahun, **3** proyek, **14** sertifikat, **37** tools. Bila salah satunya `0` atau `NaN`, hitungannya salah.
- Pola dither di kartu biru terlihat sebagai kisi kotak, bukan blok pekat, dan render tidak terasa melambat drastis.
- Slide stack: lima kartu grup **tidak** rata di kiri; chip terpotong di 24 dengan chip terakhir `+13` berlatar hitam.
- Legend `bar length = tools per group, not proficiency` terbaca.

- [ ] **Step 5: Commit**

```bash
git add src/pdf/deck/slides/numbers.tsx src/pdf/deck/slides/stack.tsx src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): add derived numbers and tech stack slides"
```

---

### Task 7: Slide "how i work" (berpaginasi)

Penerapan pertama `paginate`. Data nyata punya 10 skill → 2 slide berisi 5 kartu.

**Files:**
- Create: `src/pdf/deck/slides/process.tsx`
- Modify: `src/pdf/portfolio-pdf.tsx`

**Interfaces:**
- Consumes: `paginate`, `stagger`, `heightFor`, `accentFor`, `truncate`, `pad2` (Task 2).
- Produces: `<ProcessSlide skills pageIndex>` — satu slide per halaman; composer memanggilnya sekali per hasil `paginate`.

- [ ] **Step 1: `src/pdf/deck/slides/process.tsx`**

Nomor kartu berjalan menerus lintas slide (01–05 lalu 06–10), jadi `pageIndex` wajib diteruskan.

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, fgOn, type Tone } from "../primitives";
import { colors, type } from "../theme";
import { stagger, heightFor, accentFor, truncate, pad2 } from "../layout";
import type { Skill } from "@/types/skill";

const WIDTH = 158;
const GUTTER = 18;
const BASE = 300;

export function ProcessSlide({ skills, pageIndex }: { skills: Skill[]; pageIndex: number }) {
  const heroIndex = pageIndex % 5;
  const heroTone: Tone = accentFor(pageIndex);

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow={pageIndex === 0 ? "how i work" : "how i work (cont.)"} />
      <View style={{ flexDirection: "row" }}>
        {skills.map((skill, i) => {
          const hero = i === heroIndex;
          const tone: Tone = hero ? heroTone : "paper";
          return (
            <View
              key={skill.title}
              style={{
                width: WIDTH,
                height: heightFor(i, BASE),
                marginTop: Math.max(0, stagger(i)),
                marginRight: i < skills.length - 1 ? GUTTER : 0,
                backgroundColor: tone === "paper" ? colors.paper
                  : tone === "blue" ? colors.blue
                  : tone === "orange" ? colors.orange : colors.ink,
                padding: 16,
              }}
            >
              <Text style={{ ...type.num, color: hero ? fgOn(tone) : i % 2 === 0 ? colors.blue : colors.orange }}>
                {pad2(pageIndex * 5 + i + 1)}
              </Text>
              <Text style={{ ...type.h3, color: fgOn(tone), marginTop: 6 }}>
                {truncate(skill.title, 24)}
              </Text>
              <Text style={{ ...type.small, color: hero ? fgOn(tone) : colors.ink, marginTop: 10 }}>
                {truncate(skill.description, 120)}
              </Text>
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
```

- [ ] **Step 2: Panggil dari composer**

```tsx
{paginate(skills, 5, 2).map((page, i) => (
  <ProcessSlide key={`process-${i}`} skills={page} pageIndex={i} />
))}
```

- [ ] **Step 3: Render dan lihat**

Daftar periksa:
- Muncul **dua** slide "how i work"; yang kedua ber-eyebrow `how i work (cont.)`.
- Penomoran berjalan 01→10 tanpa mengulang.
- Kartu hero berbeda warna antar dua slide (`accentFor(0)` = blue, `accentFor(1)` = orange).
- Kartu tidak sejajar atas maupun bawah, dan tidak ada yang melewati tepi bawah slide.
- Deskripsi terpotong rapi, tidak meluber keluar kartu.

- [ ] **Step 4: Commit**

```bash
git add src/pdf/deck/slides/process.tsx src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): add paginated how-i-work slides"
```

---

### Task 8: Slide proyek — index, detail, grid

**Files:**
- Create: `src/pdf/deck/slides/project-index.tsx`, `src/pdf/deck/slides/project-detail.tsx`, `src/pdf/deck/slides/project-grid.tsx`
- Modify: `src/pdf/portfolio-pdf.tsx`

**Interfaces:**
- Consumes: `truncate`, `scaleTitle`, `pad2`, `stagger` (Task 2); `Slide`, `SlideHeader`, `SlideNumber`, `PixelRule`, `ChipRow`, `Chip`, `Dither` (Task 3); `projectImages` (Task 5).
- Produces:
  - `<ProjectIndexSlide projects>`
  - `<ProjectDetailSlide project index image?>`
  - `<ProjectGridSlide projects images startIndex>`

- [ ] **Step 1: `src/pdf/deck/slides/project-index.tsx`**

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, PixelRule } from "../primitives";
import { colors, type } from "../theme";
import { truncate, pad2 } from "../layout";
import type { Project } from "@/types/project";

export function ProjectIndexSlide({ projects }: { projects: Project[] }) {
  const rows = projects.slice(0, 6);
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="index — selected work" />
      {rows.map((project, i) => (
        <View key={project.id}>
          <View style={{ flexDirection: "row", alignItems: "center", height: 58 }}>
            <Text style={{ ...type.h1, fontSize: 32, width: 60, color: i % 2 === 0 ? colors.blue : colors.orange }}>
              {pad2(i + 1)}
            </Text>
            <Text style={{ ...type.h2, fontSize: 30, flexGrow: 1, color: colors.ink }}>
              {truncate(project.title, 30)}
            </Text>
            <Text style={{ ...type.small, color: colors.muted, width: 280, textAlign: "right" }}>
              {truncate(project.technologies.join(" · "), 46)}
            </Text>
            <Text style={{ ...type.body, color: colors.ink, width: 56, textAlign: "right" }}>
              {project.year}
            </Text>
          </View>
          {i < rows.length - 1 && <PixelRule width={864} color="#C9C7C0" />}
        </View>
      ))}
    </Slide>
  );
}
```

- [ ] **Step 2: `src/pdf/deck/slides/project-detail.tsx`**

Layout cermin: indeks genap = teks kiri, gambar kanan; ganjil = kebalikan. Slide ini memakai `padded={false}` karena setengah bidangnya full-bleed, jadi nomor slide diposisikan manual.

```tsx
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { Slide, SlideNumber, ChipRow, Chip, Dither } from "../primitives";
import { colors, type } from "../theme";
import { truncate, scaleTitle, pad2 } from "../layout";
import type { Project } from "@/types/project";

function shortUrl(url: string): string {
  return truncate(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), 30);
}

export function ProjectDetailSlide({
  project, index, image,
}: { project: Project; index: number; image?: string }) {
  const mirrored = index % 2 === 1;
  const meta = [project.categories[0], project.year, project.status]
    .filter(Boolean)
    .join("  ·  ");

  const text = (
    <View style={{ width: 480, paddingHorizontal: 48, paddingVertical: 40, justifyContent: "space-between" }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text style={{ ...type.h1, fontSize: 32, color: colors.blue, marginRight: 12 }}>
            {pad2(index + 1)}
          </Text>
          <Text style={{ ...type.small, color: colors.muted, marginBottom: 6 }}>{meta}</Text>
        </View>
        <View style={{ height: 1.5, backgroundColor: colors.ink, marginTop: 10, marginBottom: 14 }} />
        <Text style={{ ...type.h1Big, fontSize: scaleTitle(project.title), color: colors.ink }}>
          {project.title}
        </Text>
        <Text style={{ ...type.body, color: colors.ink, marginTop: 12 }}>
          {truncate(project.description, 320)}
        </Text>
        <View style={{ marginTop: 16 }}>
          <ChipRow labels={project.technologies} max={8} />
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {project.github && <Chip label={`github ↗ ${shortUrl(project.github)}`} variant="ink" />}
        {project.liveDemo && <Chip label={`live ↗ ${shortUrl(project.liveDemo)}`} variant="outline" />}
      </View>
    </View>
  );

  const media = (
    <View style={{ width: 480, height: 540, backgroundColor: colors.paper }}>
      {image
        ? <Image src={image} style={{ width: 480, height: 540, objectFit: "cover" }} />
        : <Dither width={480} height={540} />}
      {project.status && (
        <View style={{
          position: "absolute", top: 40,
          left: mirrored ? 40 : undefined, right: mirrored ? undefined : 40,
          backgroundColor: colors.orange, paddingHorizontal: 10, paddingVertical: 6,
        }}>
          <Text style={{ ...type.micro, color: colors.ink }}>{project.status}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Slide tone="bone" padded={false}>
      <View style={{ flexDirection: "row", width: 960, height: 540 }}>
        {mirrored ? media : text}
        {mirrored ? text : media}
      </View>
      <View style={{ position: "absolute", top: 40, right: 48 }}>
        <SlideNumber />
      </View>
    </Slide>
  );
}
```

- [ ] **Step 3: `src/pdf/deck/slides/project-grid.tsx`**

Slide ini hanya muncul bila featured project lebih dari 4. Dengan data saat ini (3 proyek) ia tidak akan dirender — tetap dibuat karena jumlah proyek di Sanity bisa bertambah.

```tsx
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { Slide, SlideHeader, Dither } from "../primitives";
import { colors, type } from "../theme";
import { truncate, pad2, stagger } from "../layout";
import type { Project } from "@/types/project";

export function ProjectGridSlide({
  projects, images, startIndex,
}: { projects: Project[]; images: Record<string, string | undefined>; startIndex: number }) {
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="more work" />
      <View style={{ flexDirection: "row" }}>
        {projects.slice(0, 3).map((project, i) => {
          const image = images[project.id];
          return (
            <View
              key={project.id}
              style={{
                width: 272, marginRight: i < 2 ? 24 : 0,
                marginTop: Math.max(0, stagger(i)),
                backgroundColor: colors.paper, padding: 16,
              }}
            >
              <View style={{ width: 240, height: 132, overflow: "hidden", backgroundColor: colors.bone }}>
                {image
                  ? <Image src={image} style={{ width: 240, height: 132, objectFit: "cover" }} />
                  : <Dither width={240} height={132} />}
              </View>
              <Text style={{ ...type.h1, fontSize: 28, color: colors.blue, marginTop: 14 }}>
                {pad2(startIndex + i + 1)}
              </Text>
              <Text style={{ ...type.h3, color: colors.ink, marginTop: 4 }}>
                {truncate(project.title, 26)}
              </Text>
              <Text style={{ ...type.small, color: colors.ink, marginTop: 8 }}>
                {truncate(project.description, 130)}
              </Text>
              <Text style={{ ...type.micro, color: colors.muted, marginTop: 12 }}>
                {truncate(project.technologies.join(" · "), 32)} — {project.year}
              </Text>
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
```

- [ ] **Step 4: Sambungkan di composer**

```tsx
{featuredProjects.length > 0 && <ProjectIndexSlide projects={featuredProjects} />}
{featuredProjects.slice(0, 4).map((project, i) => (
  <ProjectDetailSlide key={project.id} project={project} index={i} image={projectImages[project.id]} />
))}
{featuredProjects.length > 4 && (
  <ProjectGridSlide projects={featuredProjects.slice(4, 6)} images={projectImages} startIndex={4} />
)}
```

- [ ] **Step 5: Render dan lihat**

Daftar periksa:
- Tiga slide detail; slide 1 dan 3 teks di kiri, slide 2 teks di kanan (layout cermin bekerja).
- Judul `Matcha - AI Career Assistance` (29 karakter) turun ke 32pt dan **muat satu baris**, tidak terpotong.
- Proyek dengan 11 teknologi menampilkan 8 chip + chip `+3`.
- Screenshot proyek memenuhi setengah bidang tanpa distorsi (objectFit cover).
- Badge oranye `completed` tidak menutupi bagian penting gambar dan berpindah sisi mengikuti cermin.
- Deskripsi 560 karakter terpotong di ~320 dengan `…`, tidak meluber ke luar kolom.
- Nomor slide tetap muncul di kanan atas meski slide ini tanpa padding.

- [ ] **Step 6: Commit**

```bash
git add src/pdf/deck/slides/project-*.tsx src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): add project index, detail, and grid slides"
```

---

### Task 9: Slide experience + certificates (keduanya berpaginasi)

**Files:**
- Create: `src/pdf/deck/slides/experience.tsx`, `src/pdf/deck/slides/certificates.tsx`
- Modify: `src/pdf/portfolio-pdf.tsx`

**Interfaces:**
- Consumes: `paginate`, `truncate`, `formatDate`, `yearRange` (Task 2); primitif Task 3.
- Produces:
  - `<ExperienceSlide experiences pageIndex>`
  - `<CertificatesSlide certificates pageIndex overflow>`

- [ ] **Step 1: `src/pdf/deck/slides/experience.tsx`**

Field `location` sengaja tidak ditampilkan: pada data nyata isinya mengulang nama institusi. Rentang tahun memakai `yearRange` yang sudah teruji, jadi tanggal tak terparse membuat barisnya hilang — bukan mencetak `Invalid Date`.

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, fgOn, mutedOn, type Tone } from "../primitives";
import { colors, type } from "../theme";
import { truncate, yearRange } from "../layout";
import type { Experience } from "@/types/experience";

const INDENT = [0, 26, 0, 26];

export function ExperienceSlide({
  experiences, pageIndex,
}: { experiences: Experience[]; pageIndex: number }) {
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow={pageIndex === 0 ? "work history" : "work history (cont.)"} />
      {experiences.map((experience, i) => {
        const hero = pageIndex === 0 && i === 0;
        const tone: Tone = hero ? "blue" : "paper";
        const range = yearRange(experience.startDate, experience.endDate);
        return (
          <View
            key={experience.id}
            style={{
              width: 864 - INDENT[i % 4], marginLeft: INDENT[i % 4],
              height: 84, marginBottom: 12, padding: 14, flexDirection: "row",
              backgroundColor: hero ? colors.blue : colors.paper,
            }}
          >
            <View style={{ width: 190 }}>
              {range && (
                <Text style={{ ...type.h2, fontSize: 24, color: fgOn(tone) }}>{range}</Text>
              )}
              <Text style={{ ...type.micro, color: mutedOn(tone), marginTop: 4 }}>
                {truncate(experience.position, 34)}
              </Text>
            </View>
            <View style={{ flexGrow: 1, paddingLeft: 16 }}>
              <Text style={{ ...type.h3, color: fgOn(tone) }}>
                {truncate(experience.company, 46)}
              </Text>
              <Text style={{ ...type.small, color: fgOn(tone), marginTop: 6 }}>
                {truncate(experience.description, 150)}
              </Text>
            </View>
          </View>
        );
      })}
    </Slide>
  );
}
```

- [ ] **Step 2: `src/pdf/deck/slides/certificates.tsx`**

```tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, fgOn, mutedOn, type Tone } from "../primitives";
import { colors, type } from "../theme";
import { truncate, formatDate } from "../layout";
import type { Certificate } from "@/types/certificate";

const HEIGHTS = [190, 172, 182, 172, 190, 178];

export function CertificatesSlide({
  certificates, pageIndex, overflow,
}: { certificates: Certificate[]; pageIndex: number; overflow: number }) {
  const showOverflow = overflow > 0;
  const cards = showOverflow ? certificates.slice(0, 5) : certificates;

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow={pageIndex === 0 ? "credentials" : "credentials (cont.)"} />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cards.map((certificate, i) => {
          const tone: Tone = i === 1 ? "blue" : i === 5 ? "ink" : "paper";
          const issued = formatDate(certificate.issuedAt);
          return (
            <View
              key={certificate.id}
              style={{
                width: 272, height: HEIGHTS[i], padding: 16, marginBottom: 16,
                marginRight: i % 3 === 2 ? 0 : 24,
                backgroundColor: tone === "blue" ? colors.blue : tone === "ink" ? colors.ink : colors.paper,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ ...type.small, color: tone === "paper" ? (i % 2 === 0 ? colors.blue : colors.orange) : mutedOn(tone) }}>
                  {truncate(certificate.issuer, 28)}
                </Text>
                <Text style={{ ...type.h3, color: fgOn(tone), marginTop: 8 }}>
                  {truncate(certificate.title, 48)}
                </Text>
              </View>
              {issued && (
                <Text style={{ ...type.micro, color: mutedOn(tone) }}>{issued}</Text>
              )}
            </View>
          );
        })}
        {showOverflow && (
          <View style={{
            width: 272, height: HEIGHTS[5], padding: 16, marginBottom: 16,
            backgroundColor: colors.ink, justifyContent: "flex-end",
          }}>
            <Text style={{ ...type.num, color: colors.bone }}>+{overflow}</Text>
            <Text style={{ ...type.small, color: colors.mutedOn, marginTop: 6 }}>
              more credentials
            </Text>
          </View>
        )}
      </View>
    </Slide>
  );
}
```

- [ ] **Step 3: Sambungkan di composer**

```tsx
{paginate(experiences, 4, 2).map((page, i) => (
  <ExperienceSlide key={`exp-${i}`} experiences={page} pageIndex={i} />
))}
```

dan untuk sertifikat — `overflow` hanya diberikan pada halaman terakhir:

```tsx
{(() => {
  const pages = paginate(certificates, 6, 2);
  const shown = pages.flat().length;
  const overflow = certificates.length - shown;
  return pages.map((page, i) => (
    <CertificatesSlide
      key={`cert-${i}`}
      certificates={page}
      pageIndex={i}
      overflow={i === pages.length - 1 ? Math.max(0, overflow) : 0}
    />
  ));
})()}
```

- [ ] **Step 4: Render dan lihat**

Daftar periksa:
- Dua slide experience (8 entri / 4 per slide); entri pertama slide pertama biru.
- Kartu experience ber-indent selang-seling, tidak rata kiri semua.
- Tidak ada satu pun `Invalid Date` — jalankan `pdftotext /tmp/deck.pdf - | grep -c "Invalid Date"`, harus `0`.
- Sertifikat dengan `issuedAt` rusak tampil **tanpa baris tanggal**, bukan dengan placeholder.
- Dua slide sertifikat; kartu terakhir slide kedua bertulis `+2` `more credentials` (14 sertifikat, 12 tampil).
- Judul sertifikat panjang seperti `Participans Competitive Programming GUNADARMA CODE WEEK` terpotong rapi, tidak menabrak tanggal.

- [ ] **Step 5: Commit**

```bash
git add src/pdf/deck/slides/experience.tsx src/pdf/deck/slides/certificates.tsx src/pdf/portfolio-pdf.tsx
git commit -m "feat(deck): add paginated experience and certificate slides"
```

---

### Task 10: Slide contact, composer final, dan pembersihan

Task penutup: slide terakhir, penyusunan urutan penuh berikut nomor halaman daftar isi, penghapusan modul A4 lama, dan satu putaran verifikasi visual atas seluruh deck.

**Files:**
- Create: `src/pdf/deck/slides/contact.tsx`
- Modify: `src/pdf/portfolio-pdf.tsx` (versi final), `src/app/api/portfolio/pdf/route.ts` (nama file unduhan)
- Delete: `src/pdf/theme.ts`, `src/pdf/page-shell.tsx`, `src/pdf/pages/` (8 file)

**Interfaces:**
- Consumes: seluruh slide Task 3–9; `paginate` (Task 2).
- Produces: `<ContactSlide settings qrCodeDataUrl>`; `PortfolioPdf` final.

- [ ] **Step 1: `src/pdf/deck/slides/contact.tsx`**

```tsx
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType, SlideNumber } from "../primitives";
import { colors, type } from "../theme";
import { truncate } from "../layout";
import type { SanitySettings } from "@/types/siteSettings";

export function ContactSlide({
  settings, qrCodeDataUrl,
}: { settings: SanitySettings; qrCodeDataUrl: string }) {
  const items = [
    { key: "email", value: settings.email },
    { key: "phone", value: settings.phone },
    { key: "github", value: settings.githubUrl },
    { key: "linkedin", value: settings.linkedinUrl },
  ].filter((item): item is { key: string; value: string } => Boolean(item.value));

  return (
    <Slide tone="blue">
      <BleedCircle size={440} color={colors.mauve} corner="tr" />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ ...type.micro, color: colors.bone }}>05 — contact</Text>
        <SlideNumber tone="blue" />
      </View>

      <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <BigType size="hero" lines={["let's build", "something."]} color={colors.bone} />
        <View style={{ height: 1, backgroundColor: colors.bone, marginTop: 22, marginBottom: 14 }} />
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row", flexGrow: 1 }}>
            {items.map((item) => (
              <View key={item.key} style={{ width: 190 }}>
                <Text style={{ ...type.micro, color: colors.mutedOn }}>{item.key}</Text>
                <Text style={{ ...type.small, fontWeight: 700, color: colors.bone, marginTop: 5 }}>
                  {truncate(item.value.replace(/^https?:\/\//, ""), 26)}
                </Text>
              </View>
            ))}
          </View>
          {qrCodeDataUrl && (
            <View style={{ backgroundColor: colors.white, padding: 8 }}>
              <Image src={qrCodeDataUrl} style={{ width: 76, height: 76 }} />
            </View>
          )}
        </View>
      </View>
    </Slide>
  );
}
```

- [ ] **Step 2: Tulis composer final `src/pdf/portfolio-pdf.tsx`**

Nomor halaman di daftar isi dihitung, bukan ditulis tangan: cover halaman 1, contents halaman 2, sehingga `rest[i]` berada di halaman `i + 3`. Bila sebuah bagian tidak punya data, bagian itu tidak muncul dan nomornya jadi `undefined` sehingga barisnya tidak dicetak.

```tsx
import React from "react";
import type { ReactElement } from "react";
import { Document } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { paginate } from "./deck/layout";
import { CoverSlide } from "./deck/slides/cover";
import { ContentsSlide } from "./deck/slides/contents";
import { DividerSlide } from "./deck/slides/divider";
import { BioSlide } from "./deck/slides/bio";
import { NumbersSlide } from "./deck/slides/numbers";
import { StackSlide } from "./deck/slides/stack";
import { ProcessSlide } from "./deck/slides/process";
import { ProjectIndexSlide } from "./deck/slides/project-index";
import { ProjectDetailSlide } from "./deck/slides/project-detail";
import { ProjectGridSlide } from "./deck/slides/project-grid";
import { ExperienceSlide } from "./deck/slides/experience";
import { CertificatesSlide } from "./deck/slides/certificates";
import { ContactSlide } from "./deck/slides/contact";
import { ClosingSlide } from "./deck/slides/closing";

const SECTIONS = ["profile", "work", "experience", "credentials", "contact"] as const;
type Section = (typeof SECTIONS)[number];
type Entry = { section?: Section; node: ReactElement };

export function PortfolioPdf({ data }: { data: PortfolioPdfData }) {
  const {
    settings, experiences, featuredProjects, certificates, technologies,
    skills, qrCodeDataUrl, profileImage, projectImages,
  } = data;

  const name = settings.fullName ?? "Portfolio";
  const techNames = technologies.flatMap((group) => group.items.map((item) => item.name));
  const rest: Entry[] = [];

  rest.push({
    section: "profile",
    node: (
      <DividerSlide key="d-profile" eyebrow="section 01" lines={["the", "profile"]}
        tone="bone" corner="bl"
        subline="Who is behind the work, and how they think about building it." />
    ),
  });
  rest.push({ node: <BioSlide key="bio" settings={settings} photo={profileImage} /> });
  rest.push({
    node: (
      <NumbersSlide key="numbers" experiences={experiences} featuredProjects={featuredProjects}
        certificates={certificates} technologies={technologies} />
    ),
  });
  if (technologies.length > 0) {
    rest.push({ node: <StackSlide key="stack" technologies={technologies} /> });
  }
  paginate(skills, 5, 2).forEach((page, i) => {
    rest.push({ node: <ProcessSlide key={`process-${i}`} skills={page} pageIndex={i} /> });
  });

  if (featuredProjects.length > 0) {
    rest.push({
      section: "work",
      node: (
        <DividerSlide key="d-work" eyebrow="section 02" lines={["selected", "work"]}
          tone="blue" corner="tr"
          subline="What the problem was, what was decided, and what came out of it." />
      ),
    });
    rest.push({ node: <ProjectIndexSlide key="p-index" projects={featuredProjects} /> });
    featuredProjects.slice(0, 4).forEach((project, i) => {
      rest.push({
        node: (
          <ProjectDetailSlide key={project.id} project={project} index={i}
            image={projectImages[project.id]} />
        ),
      });
    });
    if (featuredProjects.length > 4) {
      rest.push({
        node: (
          <ProjectGridSlide key="p-grid" projects={featuredProjects.slice(4, 6)}
            images={projectImages} startIndex={4} />
        ),
      });
    }
  }

  if (experiences.length > 0) {
    rest.push({
      section: "experience",
      node: (
        <DividerSlide key="d-exp" eyebrow="section 03" lines={["where i've", "worked"]}
          tone="ink" corner="tl"
          subline="Teaching, research labs, student organisations, and industry programmes." />
      ),
    });
    paginate(experiences, 4, 2).forEach((page, i) => {
      rest.push({ node: <ExperienceSlide key={`exp-${i}`} experiences={page} pageIndex={i} /> });
    });
  }

  if (certificates.length > 0) {
    rest.push({
      section: "credentials",
      node: (
        <DividerSlide key="d-cred" eyebrow="section 04" lines={["credentials"]}
          tone="orange" corner="br"
          subline="Scheduled proof of learning — not a substitute for experience." />
      ),
    });
    const pages = paginate(certificates, 6, 2);
    const overflow = Math.max(0, certificates.length - pages.flat().length);
    pages.forEach((page, i) => {
      rest.push({
        node: (
          <CertificatesSlide key={`cert-${i}`} certificates={page} pageIndex={i}
            overflow={i === pages.length - 1 ? overflow : 0} />
        ),
      });
    });
  }

  rest.push({
    section: "contact",
    node: <ContactSlide key="contact" settings={settings} qrCodeDataUrl={qrCodeDataUrl} />,
  });
  rest.push({ node: <ClosingSlide key="closing" settings={settings} /> });

  // Cover = halaman 1, contents = halaman 2, jadi rest[i] jatuh di halaman i + 3.
  const entries = SECTIONS.map((label) => {
    const at = rest.findIndex((entry) => entry.section === label);
    return { label, page: at === -1 ? undefined : at + 3 };
  });

  return (
    <Document
      title={`${name} — Portfolio Deck`}
      author={name}
      subject={`${settings.role ?? "Software Engineer"} portfolio deck`}
      keywords="portfolio, deck, fullstack, next.js, react, typescript"
      creator="Portfolio Deck Generator"
    >
      <CoverSlide settings={settings} technologies={techNames} photo={profileImage} />
      <ContentsSlide entries={entries} />
      {rest.map((entry) => entry.node)}
    </Document>
  );
}
```

- [ ] **Step 3: Perbarui nama file unduhan**

Di `src/app/api/portfolio/pdf/route.ts`, ganti nilai `Content-Disposition` menjadi:

```ts
"Content-Disposition": 'attachment; filename="Dimas-Rizki-Portfolio-Deck.pdf"',
```

- [ ] **Step 4: Hapus modul A4 lama**

```bash
git rm -r src/pdf/pages src/pdf/page-shell.tsx src/pdf/theme.ts
```

Tidak boleh ada yang mengimpornya lagi — buktikan:

```bash
grep -rn "page-shell\|pdf/theme\|pdf/pages" src || echo "tidak ada sisa referensi"
```

Expected: `tidak ada sisa referensi`.

- [ ] **Step 5: Verifikasi menyeluruh**

```bash
pnpm test
pnpm build
pnpm lint
curl -sS -m 180 -o /tmp/deck.pdf -w "http=%{http_code} time=%{time_total}s\n" http://localhost:3001/api/portfolio/pdf
pdfinfo /tmp/deck.pdf | grep -E "Pages|Page size"
pdffonts /tmp/deck.pdf
pdftotext /tmp/deck.pdf - | grep -c "Invalid Date"
rm -rf /tmp/slides && mkdir -p /tmp/slides && pdftoppm -png -r 72 /tmp/deck.pdf /tmp/slides/s
ls /tmp/slides
```

Expected:
- `pnpm test` — semua lolos; `pnpm build` dan `pnpm lint` bersih.
- `http=200`.
- `Page size: 960 x 540 pts`, `Pages: 23`.
- `pdffonts` menampilkan SpaceGrotesk (tiga berat) dan Silkscreen, semuanya `emb yes`.
- Hitungan `Invalid Date` = `0`.

- [ ] **Step 6: Lihat SETIAP slide, satu per satu**

Buka ke-23 PNG di `/tmp/slides/`. Ini langkah yang tidak boleh dilewati — bukan sekadar mengecek build lolos. Untuk tiap slide periksa:

1. Tidak ada teks yang melewati tepi kartu atau tepi slide.
2. Tidak ada kartu yang bertumpuk atau keluar tepi bawah.
3. Kontras teks memadai (bone di atas blue/ink, ink di atas orange/bone).
4. Tidak ada placeholder dither yang tidak disengaja (artinya gambar gagal dimuat).
5. Nomor slide berurutan 01–23 dan nomor di daftar isi menunjuk ke slide yang benar — buka halaman yang disebut daftar isi dan pastikan itu memang divider bagian tersebut.
6. **Tidak ada slide konten yang tampak sebagai grid rata.** Bila ada, `stagger`/`heightFor` belum diterapkan di slide itu.
7. Tidak ada dua slide berurutan dengan warna hero yang sama.

Perbaiki temuan, lalu ulangi dari Step 5 sampai bersih.

- [ ] **Step 7: Commit**

```bash
git add -A src docs
git commit -m "feat(deck): finish deck composer and remove the A4 PDF module"
```

---

## Catatan untuk pelaksana

- **Jangan menambah dependensi.** Bila terasa butuh library layout atau test runner, itu tanda ada yang salah dipahami — semua sudah bisa dikerjakan dengan yang ada.
- **Jangan mengarang data.** Tidak ada metrik impact, tidak ada label proficiency, tidak ada kutipan, tidak ada status ketersediaan kerja. Kalau sebuah slot layout terasa kosong, kecilkan slotnya — jangan isi dengan karangan.
- **Urutan render menentukan lapisan.** `react-pdf` tidak punya `z-index`; `BleedCircle` harus selalu jadi anak pertama `Slide`.
- **`Dither` itu mahal.** Ia sudah membatasi diri sendiri, tapi jangan memakainya untuk bidang sangat besar lebih dari sekali per slide.
- **Server dev sudah berjalan di port 3001** pada sesi ini. Bila kamu memulai sesi baru, jalankan `pnpm dev` dan sesuaikan port di semua perintah `curl`.
