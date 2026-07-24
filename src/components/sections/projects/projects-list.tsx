import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { projects } from "@/constants/projects";
import { ProjectGrid } from "./project-grid";

export function ProjectsList() {
  return (
    <Section>
      <Container>
        <SectionHeader
          as="h1"
          eyebrow="Projects"
          title="Things I've designed and built."
          description="A selection of projects spanning web apps, dashboards, APIs, and interfaces, built with a focus on performance and clean design."
        />

        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </Container>
    </Section>
  );
}
