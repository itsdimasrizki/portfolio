import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";

import { experiences } from "@/constants/experience";

import { ExperienceCard } from "./experience-card";

export function ExperiencePreview() {
  return (
    <Section>
      <Container>
        <SectionHeader
          align="left"
          eyebrow="Experience"
          title="Experience"
          description="Companies and teams I've worked with."
          action={
            <Button asChild variant="ghost">
              <Link href="/experience">View all</Link>
            </Button>
          }
        />

        <div className="mt-12 space-y-6">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
