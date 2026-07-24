import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import { featuredProjects } from "@/constants/projects";

import { ProjectGrid } from "./project-grid";

export function FeaturedProjects() {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow="Projects"
            title="Featured Projects"
            description="A selection of things I've designed and built recently."
            action={
              <Button asChild variant="ghost">
                <Link href="/projects">View all</Link>
              </Button>
            }
          />
        </Reveal>

        <div className="mt-12">
          <ProjectGrid projects={featuredProjects} />
        </div>
      </Container>
    </Section>
  );
}

