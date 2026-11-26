"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { heroItem } from "@/lib/motion";
import type { PageContent } from "@/types/pageContent";

import { AboutPillModal, type PillKey } from "./about-pill-modal";

type AboutHeroProps = {
  cvUrl?: string | null;
  locale: Locale;
  content: PageContent;
};

function PillButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-xs text-primary cursor-pointer hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
    </button>
  );
}

export function AboutHero({ cvUrl, locale, content }: AboutHeroProps) {
  const messages = getMessages(locale);
  const [activePill, setActivePill] = useState<PillKey | null>(null);

  const openPill = (pill: PillKey) => setActivePill(pill);
  const closePill = () => setActivePill(null);

  return (
    <>
      <Section className="pt-8 pb-10 lg:py-12">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(300px,420px)_1fr] lg:gap-14">
            {/* LEFT COLUMN: Large Borderless Portrait Cutout */}
            <motion.div
              custom={0}
              variants={heroItem}
              initial="hidden"
              animate="visible"
              className="relative mx-auto w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[400px]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 bottom-4 h-2/3 rounded-full opacity-20 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 60%, var(--accent-primary), transparent 70%)",
                }}
              />
              <div
                className="relative w-full border-0 bg-transparent"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 80%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 80%, transparent 100%)",
                }}
              >
                <Image
                  src="/assets/dimas-about.png"
                  alt="Dimas Rizki Ardiansyah"
                  width={800}
                  height={1000}
                  priority
                  className="mx-auto h-auto w-full object-contain object-bottom drop-shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                />
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Eyebrow, Headline, Academic Sub-headline, Actions & Integrated My Story */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <motion.p
                custom={0}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="font-mono text-xs font-semibold uppercase tracking-widest text-primary"
              >
                01 // About Me
              </motion.p>

              <motion.h1
                custom={1}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight tracking-tight text-foreground"
              >
                Dimas Rizki Ardiansyah
              </motion.h1>

              <motion.p
                custom={2}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground"
              >
                Informatics Engineering Student at UPN &ldquo;Veteran&rdquo;
                Yogyakarta, passionate about Software Engineering and Artificial
                Intelligence.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                custom={3}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
              >
                <Button
                  size="default"
                  className="rounded-full bg-primary px-6 font-mono text-xs uppercase tracking-wider text-primary-foreground"
                  asChild
                >
                  <a
                    href={cvUrl ?? "/resume.pdf"}
                    download
                    target={cvUrl ? "_blank" : undefined}
                    rel={cvUrl ? "noopener noreferrer" : undefined}
                  >
                    {messages["cta.downloadCv"]}
                  </a>
                </Button>

                <Button
                  size="default"
                  variant="outline"
                  className="rounded-full border-border px-6 font-mono text-xs uppercase tracking-wider"
                  asChild
                >
                  <Link href={localeHref(locale, "/contact")}>
                    {messages["cta.letsConnect"]}
                  </Link>
                </Button>
              </motion.div>

              {/* Integrated "My Story" Narrative Block with Interactive Keyword Pills */}
              <motion.div
                custom={4}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="mt-8 w-full border-t border-border/70 pt-6 text-left"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">
                    {content.storyEyebrow || "MY STORY"}
                  </span>
                  {content.storyTitle && (
                    <span className="text-xs text-muted-foreground">
                      — {content.storyTitle}
                    </span>
                  )}
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <p>
                    I am a{" "}
                    <PillButton onClick={() => openPill("Full-stack + AI")}>
                      Full-stack + AI
                    </PillButton>{" "}
                    engineer focused on building{" "}
                    <PillButton onClick={() => openPill("Production Systems")}>
                      Production Systems
                    </PillButton>{" "}
                    that actually scale. From pixel-perfect interfaces to
                    resilient backend services, I care about the full picture —
                    not just the happy path.
                  </p>

                  <p>
                    I have shipped{" "}
                    <PillButton onClick={() => openPill("Mission Critical")}>
                      Mission Critical
                    </PillButton>{" "}
                    software where downtime has real-world consequences, which
                    means I build with observability, graceful degradation, and
                    runbooks from day one. Infrastructure is not an
                    afterthought.
                  </p>

                  <p>
                    My background spans modern{" "}
                    <PillButton onClick={() => openPill("Cloud Architecture")}>
                      Cloud Architecture
                    </PillButton>{" "}
                    on AWS and GCP, writing infrastructure as code and
                    automating everything from provisioning to cost anomaly
                    alerts — so the team can ship fast without flying blind.
                  </p>

                  {content.storyParagraphs.slice(3).map((paragraph, i) => (
                    <p key={i + 3}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>

      <AboutPillModal pill={activePill} onClose={closePill} />
    </>
  );
}
