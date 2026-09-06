import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/locale";
import { HeroContent } from "./hero-content";
import { HeroImage } from "./hero-image";

type HeroProps = {
  cvUrl?: string | null;
  locale: Locale;
};

export function Hero({ cvUrl, locale }: HeroProps) {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <HeroContent cvUrl={cvUrl} locale={locale} />
          <HeroImage />
        </div>
      </Container>
    </Section>
  );
}