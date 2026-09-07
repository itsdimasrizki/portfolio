import { client } from "@/sanity/client";
import { pageContentQuery } from "@/sanity/queries/pageContent.queries";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { PageContent, SanityPageContent } from "@/types/pageContent";

const EMPTY: PageContent = {
  heroBadge: "",
  heroHeadline: "",
  heroHighlight: "",
  heroDescription: "",
  storyEyebrow: "",
  storyTitle: "",
  storyParagraphs: [],
  statLabels: [],
  deckIntro: "",
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

  // EMPTY, bukan null: dengan begitu komponen tidak perlu menjaga-jaga
  // terhadap nilai kosong di setiap tempat.
  if (!raw) return EMPTY;

  return {
    heroBadge: pickLocalized(raw.heroBadge, locale),
    heroHeadline: pickLocalized(raw.heroHeadline, locale),
    heroHighlight: pickLocalized(raw.heroHighlight, locale),
    heroDescription: pickLocalized(raw.heroDescription, locale),
    storyEyebrow: pickLocalized(raw.storyEyebrow, locale),
    storyTitle: pickLocalized(raw.storyTitle, locale),
    storyParagraphs: (raw.storyParagraphs ?? []).map((p) =>
      pickLocalized(p, locale)
    ),
    statLabels: (raw.statLabels ?? []).map((s) => pickLocalized(s, locale)),
    deckIntro: pickLocalized(raw.deckIntro, locale),
  };
}
