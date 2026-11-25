import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Locale } from "@/i18n/locale";
import type { PageContent } from "@/types/pageContent";
import type { Project } from "@/types/project";
import { HeroContent } from "./hero-content";
import { BuildingCard } from "./building-card";
import { TestimonialSlider } from "./testimonial-slider";

type HeroProps = {
  content: PageContent;
  settings: { fullName?: string; roles: string[] };
  cvUrl?: string | null;
  locale: Locale;
  featuredProject?: Project | null;
};

export function Hero({
  content,
  settings,
  cvUrl,
  locale,
  featuredProject,
}: HeroProps) {
  return (
    <Section id="hero" className="relative pt-6 pb-16 lg:py-20">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column (Asymmetric 12-column layout: 7 cols) */}
          <div className="lg:col-span-7">
            <HeroContent
              content={content}
              settings={settings}
              cvUrl={cvUrl}
              locale={locale}
            />
          </div>

          {/* Right Column (Showcase Area: 5 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <BuildingCard locale={locale} project={featuredProject} />
            <TestimonialSlider locale={locale} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
