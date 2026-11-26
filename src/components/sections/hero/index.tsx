import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/locale";
import type { PageContent } from "@/types/pageContent";
import { HeroContent } from "./hero-content";

type HeroProps = {
  content: PageContent;
  settings: { fullName?: string; roles: string[] };
  cvUrl?: string | null;
  locale: Locale;
};

export function Hero({ content, settings, cvUrl, locale }: HeroProps) {
  return (
    <Section
      id="hero"
      className="relative overflow-hidden pt-6 pb-0 sm:pt-8 lg:pt-10 lg:pb-0"
    >
      <Container>
        <HeroContent
          content={content}
          settings={settings}
          cvUrl={cvUrl}
          locale={locale}
        />
      </Container>
    </Section>
  );
}
