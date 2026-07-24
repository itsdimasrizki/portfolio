import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { SkillCard } from "@/components/cards/skill-card";

import { skills } from "@/constants/skills";

export function Skills() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            Skills
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            What I bring to every project.
          </h2>

          <p className="mt-4 text-muted-foreground">
            Beyond the technologies I use, these are the core skills I apply to
            design, develop, and deliver high-quality software solutions.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
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