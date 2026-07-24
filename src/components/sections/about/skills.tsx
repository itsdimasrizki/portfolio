import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";

import { SkillCard } from "@/components/cards/skill-card";

import { skills } from "@/constants/skills";

export function Skills() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Skills"
          title="What I bring to every project."
          description="Beyond the technologies I use, these are the core skills I apply to design, develop, and deliver high-quality software solutions."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {skills.map((skill) => {
            const Icon = skill.icon;

            return (
              <SkillCard
                key={skill.title}
                icon={<Icon size={24} />}
                title={skill.title}
                description={skill.description}
              />
            );
          })}
        </div>
      </Container>
    </Section>
  );
}