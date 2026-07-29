"use client";

import { motion } from "framer-motion";
import { ComponentType } from "react";
import { Code2 } from "lucide-react";

import * as LuIcons from "lucide-react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa6";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { SkillCard } from "@/components/cards/skill-card";
import type { Skill } from "@/types/skill";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

type IconComponent = ComponentType<any>;

const allIcons: Record<string, IconComponent> = {
  ...(LuIcons as unknown as Record<string, IconComponent>),
  ...(SiIcons as unknown as Record<string, IconComponent>),
  ...(FaIcons as unknown as Record<string, IconComponent>),
  RefreshCow: LuIcons.RefreshCw as IconComponent,
};

function getDynamicSkillIcon(iconName: string): IconComponent {
  if (!iconName) return Code2;

  const trimmed = iconName.trim();
  if (allIcons[trimmed]) return allIcons[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, IconComp] of Object.entries(allIcons)) {
    if (key.toLowerCase() === lower) return IconComp;
  }

  return Code2;
}

type Props = {
  skills: Skill[];
};

export function Skills({ skills }: Props) {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Skills"
            title="What I bring to every project."
            description="Beyond the technologies I use, these are the core skills I apply to design, develop, and deliver high-quality software solutions."
          />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {skills.map((skill) => {
            const Icon = getDynamicSkillIcon(skill.iconName);

            return (
              <motion.div key={skill.title} variants={staggerItem}>
                <SkillCard
                  icon={<Icon size={24} />}
                  title={skill.title}
                  description={skill.description}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
