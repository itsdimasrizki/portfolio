import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { featuredProjects } from "@/constants/projects";
import { ProjectCard } from "./project-card";

export function FeaturedProjects() {
  return (
    <Section>
      <Container>
        <h2 className="mb-8 text-3xl font-bold">
          Featured Projects
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}