import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { TechnologyCard } from "@/components/cards/technology-card";

import { technologies } from "@/constants/technologies";

export function TechStack() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Tech Stack"
          title="The technologies I use every day."
          description="A curated set of tools and technologies I use to build modern, scalable, and maintainable applications."
        />

        <div className="mt-12 space-y-12">
          {technologies.map((category) => (
            <div
              key={category.title}
              className="border-b border-border pb-10 last:border-none last:pb-0"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {category.title}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {category.items.map((tech) => {
                  const Icon = tech.icon;

                  return (
                    <TechnologyCard
                      key={tech.name}
                      name={tech.name}
                      icon={<Icon size={22} />}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}