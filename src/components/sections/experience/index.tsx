"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import type { Experience } from "@/types/experience";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

import { ExperienceCard } from "./experience-card";

type Props = {
  experiences: Experience[];
};

export function ExperiencePreview({ experiences }: Props) {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow="Experience"
            title="Experience"
            description="Companies and teams I've worked with."
            action={
              <Button asChild variant="ghost">
                <Link href="/experience">View all</Link>
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
