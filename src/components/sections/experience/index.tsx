"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import type { Experience } from "@/types/experience";

import { ExperienceCard } from "./experience-card";

// ─── Slide variants ──────────────────────────────────────────────────────────

const easeOut = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: easeOut },
  }),
};

// ─── Props ───────────────────────────────────────────────────────────────────

type Props = {
  experiences: Experience[];
  locale: Locale;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ExperiencePreview({ experiences, locale }: Props) {
  const messages = getMessages(locale);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const total = experiences.length;

  const navigate = (dir: 1 | -1) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + total) % total);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (total === 0) return null;

  const active = experiences[current];

  return (
    <Section className="border-t border-[var(--border-contrast)] bg-[var(--bg-surface-elevated)]">
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

        {/* Carousel */}
        <div className="mt-12">
          {/* Card area */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <ExperienceCard
                  experience={active}
                  expanded={!!expanded[active.id]}
                  onToggle={() => toggleExpand(active.id)}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          {total > 1 && (
            <div className="mt-6 flex flex-col items-center gap-4">
              {/* Nav buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Previous experience"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Experience slides">
                  {experiences.map((exp, i) => (
                    <button
                      key={exp.id}
                      role="tab"
                      aria-selected={i === current}
                      aria-label={`Go to experience ${i + 1}`}
                      onClick={() => {
                        setDirection(i > current ? 1 : -1);
                        setCurrent(i);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        i === current
                          ? "w-5 bg-primary"
                          : "w-2 bg-border hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => navigate(1)}
                  aria-label="Next experience"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Counter */}
              <p className="font-mono text-xs text-muted-foreground">
                {current + 1} / {total}
              </p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
