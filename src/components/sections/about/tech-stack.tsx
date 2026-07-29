"use client";

import { motion } from "framer-motion";
import { ComponentType } from "react";
import { Code2 } from "lucide-react";

import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa6";
import * as LuIcons from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { TechnologyCard } from "@/components/cards/technology-card";
import type { TechnologyGroup } from "@/types/technology";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

type IconComponent = ComponentType<any>;

const allIcons: Record<string, IconComponent> = {
  ...(SiIcons as unknown as Record<string, IconComponent>),
  ...(FaIcons as unknown as Record<string, IconComponent>),
  ...(LuIcons as unknown as Record<string, IconComponent>),
  // Aliases for common typos or user inputs
  SiNextdojs: SiIcons.SiNextdotjs as IconComponent,
  "c++": SiIcons.SiCplusplus as IconComponent,
  cpp: SiIcons.SiCplusplus as IconComponent,
  python: FaIcons.FaPython as IconComponent,
};

function getDynamicIcon(iconName: string): IconComponent {
  if (!iconName) return Code2;

  const trimmed = iconName.trim();

  // 1. Direct match (e.g. SiCplusplus, FaPython, Code2)
  if (allIcons[trimmed]) return allIcons[trimmed];

  // 2. Auto-prefix (e.g. user typed "Python" or "React" -> try "SiPython", "FaPython", "FaReact")
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (allIcons[`Si${capitalized}`]) return allIcons[`Si${capitalized}`];
  if (allIcons[`Fa${capitalized}`]) return allIcons[`Fa${capitalized}`];

  // 3. Case-insensitive lookup
  const lower = trimmed.toLowerCase();
  for (const [key, IconComp] of Object.entries(allIcons)) {
    if (key.toLowerCase() === lower) return IconComp;
  }

  // 4. Default fallback icon
  return Code2;
}

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
                  const Icon = getDynamicIcon(tech.iconName);

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
