import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { projects } from "@/constants/projects";
import { ProjectGrid } from "./project-grid";

export function ProjectsList() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            Projects
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Things I&apos;ve designed and built.
          </h1>

          <p className="mt-4 text-muted-foreground">
            A selection of projects spanning web apps, dashboards, APIs, and
            interfaces, built with a focus on performance and clean design.
          </p>
        </div>

        <div className="mt-16">
          <ProjectGrid projects={projects} />
        </div>
      </Container>
    </Section>
  );
}
