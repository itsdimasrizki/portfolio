"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import type { Project } from "@/types/project";

import { ProjectGrid } from "./project-grid";

const ALL = "All";

type Props = {
  projects: Project[];
  locale: Locale;
};

export function ProjectsList({ projects, locale }: Props) {
  const messages = getMessages(locale);
  const [activeCategory, setActiveCategory] = useState(ALL);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(projects.flatMap((p) => p.categories))
    ).sort();
    return [ALL, ...unique];
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeCategory === ALL) return projects;
    return projects.filter((p) => p.categories.includes(activeCategory));
  }, [activeCategory, projects]);

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            eyebrow={messages["section.allProjects.eyebrow"]}
            title={messages["section.allProjects.title"]}
            description={messages["section.allProjects.description"]}
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </Reveal>

        <div className="mt-12">
          <ProjectGrid key={activeCategory} projects={filtered} />
        </div>
      </Container>
    </Section>
  );
}
