import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";

import type { Project } from "@/types/project";

import { ProjectGrid } from "./project-grid";

type Props = {
  projects: Project[];
};

export function ProjectsList({ projects }: Props) {
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

        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </Container>
    </Section>
  );
}
