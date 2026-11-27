import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/locale";
import type { PageContent } from "@/types/pageContent";
import type { SanityImageMeta } from "@/types/siteSettings";
import { HeroContent } from "./hero-content";

type HeroProps = {
  content: PageContent;
  settings: {
    fullName?: string;
    roles: string[];
    heroPortrait: SanityImageMeta;
    scrollSequenceFrames: string[];
  };
  locale: Locale;
};

export function Hero({ content, settings, locale }: HeroProps) {
  return (
    <Section
      id="hero"
      className="relative overflow-hidden pt-4 pb-0 sm:pt-6 lg:pt-6 lg:pb-0"
    >
      <Container className="max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <HeroContent content={content} settings={settings} locale={locale} />
      </Container>
    </Section>
  );
}
