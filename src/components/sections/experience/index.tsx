import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

import { experiences } from "@/constants/experience";

import { ExperienceCard } from "./experience-card";

export function ExperiencePreview() {
  return (
    <Section>
      <Container>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Experience
            </h2>

            <p className="mt-2 text-muted-foreground">
              Companies and teams I've worked with.
            </p>
          </div>

          <Button asChild variant="ghost">
            <Link href="/experience">
              View all
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
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