import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { TimelineItem } from "@/components/cards/timeline-item";
import { experiences } from "@/constants/experience";

export function ExperienceTimeline() {
  return (
    <Section>
      <Container>
        <SectionHeader
          as="h1"
          eyebrow="Experience"
          title="A timeline of my professional journey."
          description="The companies and teams I've worked with, and the impact I made along the way."
        />

        <div className="mx-auto mt-12 max-w-2xl">
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
