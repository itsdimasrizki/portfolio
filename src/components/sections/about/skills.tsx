"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { SkillCard } from "@/components/cards/skill-card";
import type { Skill } from "@/types/skill";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

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
            const Icon = skill.icon;

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
