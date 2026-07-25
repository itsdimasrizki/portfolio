"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { TimelineItem } from "@/components/cards/timeline-item";

import type { Experience } from "@/types/experience";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

type Props = {
  experiences: Experience[];
};

export function ExperienceTimeline({ experiences }: Props) {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            eyebrow="Experience"
            title="A timeline of my professional journey."
            description="The companies and teams I've worked with, and the impact I made along the way."
          />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto mt-12 max-w-2xl"
        >
          {experiences.map((experience, index) => (
            <motion.div key={experience.id} variants={staggerItem}>
              <TimelineItem
                experience={experience}
                isLast={index === experiences.length - 1}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
