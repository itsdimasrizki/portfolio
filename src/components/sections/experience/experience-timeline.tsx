import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TimelineItem } from "@/components/cards/timeline-item";
import { experiences } from "@/constants/experience";

export function ExperienceTimeline() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            Experience
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            A timeline of my professional journey.
          </h1>

          <p className="mt-4 text-muted-foreground">
            The companies and teams I&apos;ve worked with, and the impact I made
            along the way.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          {experiences.map((experience, index) => (
            <TimelineItem
              key={experience.id}
              experience={experience}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
