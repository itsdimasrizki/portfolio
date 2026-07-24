import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TechnologyCard } from "@/components/cards/technology-card";

import { technologies } from "@/constants/technologies";

export function TechStack() {
  return (
    <Section>
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            Tech Stack
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            The technologies I use every day.
          </h2>

          <p className="mt-4 text-muted-foreground">
            A curated set of tools and technologies I use to build modern,
            scalable, and maintainable applications.
          </p>
        </div>

        {/* Categories */}
        <div className="mt-16 space-y-12">
          {technologies.map((category) => (
            <div 
                key={category.title} 
                className="border-b border-border pb-10 last:border-none last:pb-0"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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