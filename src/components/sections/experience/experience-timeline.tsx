"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { TimelineItem } from "@/components/cards/timeline-item";

import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import type { Experience } from "@/types/experience";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

type Props = {
  experiences: Experience[];
  locale: Locale;
};

export function ExperienceTimeline({ experiences, locale }: Props) {
  const messages = getMessages(locale);

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            eyebrow={messages["section.experienceTimeline.eyebrow"]}
            title={messages["section.experienceTimeline.title"]}
            description={messages["section.experienceTimeline.description"]}
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
