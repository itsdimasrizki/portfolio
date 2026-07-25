"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { TechnologyCard } from "@/components/cards/technology-card";
import type { TechnologyGroup } from "@/types/technology";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

type Props = {
  technologies: TechnologyGroup[];
};

export function TechStack({ technologies }: Props) {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Tech Stack"
            title="The technologies I use every day."
            description="A curated set of tools and technologies I use to build modern, scalable, and maintainable applications."
          />
        </Reveal>

        <div className="mt-12 space-y-12">
          {technologies.map((category) => (
            <Reveal
              key={category.title}
              className="border-b border-border pb-10 last:border-none last:pb-0"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {category.title}
              </h3>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              >
                {category.items.map((tech) => {
                  const Icon = tech.icon;

                  return (
                    <motion.div key={tech.name} variants={staggerItem}>
                      <TechnologyCard
                        name={tech.name}
                        icon={<Icon size={22} />}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
