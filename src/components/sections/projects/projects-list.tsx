"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import type { Project } from "@/types/project";

import { ProjectGrid } from "./project-grid";

const ALL = "All";

type Props = {
  projects: Project[];
};

export function ProjectsList({ projects }: Props) {
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
            eyebrow="Projects"
            title="Things I've designed and built."
            description="A selection of projects spanning web apps, dashboards, APIs, and interfaces, built with a focus on performance and clean design."
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
