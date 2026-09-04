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
