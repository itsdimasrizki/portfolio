import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { featuredProjects } from "@/constants/projects";
import { ProjectGrid } from "./project-grid";

export function FeaturedProjects() {
  return (
    <Section>
      <Container>
        <h2 className="mb-8 text-3xl font-bold">
          Featured Projects
        </h2>

        <ProjectGrid projects={featuredProjects} />
      </Container>
    </Section>
  );
}
