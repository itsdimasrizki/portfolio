import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import type { Project } from "@/types/project";

import { ProjectGrid } from "./project-grid";

type Props = {
  projects: Project[];
  locale: Locale;
};

export function FeaturedProjects({ projects, locale }: Props) {
  const messages = getMessages(locale);

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

        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </Container>
    </Section>
  );
}
