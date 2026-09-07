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

const YEAR_ONLY = /^\s*(\d{4})\s*$/;

export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  // Tahun telanjang tetap telanjang: `new Date("2026")` mendarat di 1 Januari,
  // jadi mencetak "Jan 2026" berarti mengarang bulan yang tidak ada di data.
  const bareYear = YEAR_ONLY.exec(value);
  if (bareYear) return bareYear[1];
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Tahun saja dari sebuah tanggal, apa pun bentuk keluaran `formatDate`. */
function yearOf(value?: string): string | undefined {
  const formatted = formatDate(value);
  if (!formatted) return undefined;
  const parts = formatted.split(" ");
  return parts[parts.length - 1];
}

/** Rentang tahun ringkas untuk kartu experience: "2025—now", "2022—2024". */
export function yearRange(start?: string, end?: string): string | undefined {
  const from = yearOf(start);
  if (!from) return undefined;
  return `${from}—${yearOf(end) ?? "now"}`;
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

/**
 * Menggabung peran untuk baris header cover, berhenti sebelum melewati anggaran
 * karakter. Selalu menyisakan peran pertama: baris itu orientasi pembaca, bukan
 * daftar lengkap — daftar penuhnya ada di slide profil.
 */
export function joinRoles(roles: string[], maxChars: number): string {
  const kept = roles.map((role) => role.trim()).filter(Boolean);
  if (kept.length === 0) return "";

  let line = truncate(kept[0], maxChars);
  for (const role of kept.slice(1)) {
    const next = `${line} · ${role}`;
    if (next.length > maxChars) break;
    line = next;
  }
  return line;
}

export type IntroSize = "display" | "h1Big";

/**
 * Memecah perkenalan cover jadi baris seperti yang ditulis di Studio, lalu
 * memilih ukuran hurufnya. Kalimat Indonesia hampir selalu lebih panjang dari
 * padanan Inggrisnya; tanpa penurunan ukuran, @react-pdf/renderer melipat
 * sendiri barisnya dan merusak susunan yang disengaja.
 */
const INTRO_MAX_LINES = 4;
const DISPLAY_MAX_CHARS = 13;

export function introLines(
  text: string,
  max: number = INTRO_MAX_LINES,
): { lines: string[]; size: IntroSize } {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, max);
  const longest = lines.reduce((n, line) => Math.max(n, line.length), 0);
  return { lines, size: longest > DISPLAY_MAX_CHARS ? "h1Big" : "display" };
}
