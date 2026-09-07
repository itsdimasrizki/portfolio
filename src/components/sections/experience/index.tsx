"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import type { Experience } from "@/types/experience";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

import { ExperienceCard } from "./experience-card";

type Props = {
  experiences: Experience[];
  locale: Locale;
};

export function ExperiencePreview({ experiences, locale }: Props) {
  const messages = getMessages(locale);

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow={messages["section.experiencePreview.eyebrow"]}
            title={messages["section.experiencePreview.title"]}
            description={messages["section.experiencePreview.description"]}
            action={
              <Button asChild variant="ghost">
                <Link href={localeHref(locale, "/experience")}>
                  {messages["cta.viewAll"]}
                </Link>
              </Button>
            }
          />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 space-y-6"
        >
          {experiences.map((experience) => (
            <motion.div key={experience.id} variants={staggerItem}>
              <ExperienceCard experience={experience} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
