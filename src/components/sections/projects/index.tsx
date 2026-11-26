import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import type { Project } from "@/types/project";

import { ProjectSlider } from "./project-slider";

type Props = {
  projects: Project[];
  locale: Locale;
};

export function FeaturedProjects({ projects, locale }: Props) {
  const messages = getMessages(locale);

  const featuredProjects = projects.filter(
    (p) => p.status === "ongoing" || p.liveDemo,
  );
  const sliderProjects =
    featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow={messages["section.featuredProjects.eyebrow"]}
            title={messages["section.featuredProjects.title"]}
            description={messages["section.featuredProjects.description"]}
            action={
              <Button asChild variant="ghost">
                <Link href={localeHref(locale, "/projects")}>
                  {messages["cta.viewAll"]}
                </Link>
              </Button>
            }
          />
        </Reveal>

        {sliderProjects.length > 0 && (
          <div className="mt-8">
            <ProjectSlider projects={sliderProjects} locale={locale} />
          </div>
        )}
      </Container>
    </Section>
  );
}
