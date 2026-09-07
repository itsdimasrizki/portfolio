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
