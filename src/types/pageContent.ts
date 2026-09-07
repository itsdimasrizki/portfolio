import type { Localized } from "@/i18n/locale";

/**
 * Teks halaman setelah service memilih bahasanya. Tidak ada medan yang boleh
 * `null` atau `undefined`: komponen tampilan cukup memeriksa string kosong.
 */
export interface PageContent {
  heroBadge: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  storyEyebrow: string;
  storyTitle: string;
  storyParagraphs: string[];
  statLabels: string[];
  deckIntro: string;
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
  deckIntro?: Localized;
}
