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
import type { SanityImageMeta } from "@/types/siteSettings";

import { AboutPillModal, type PillKey } from "./about-pill-modal";

type AboutHeroProps = {
  cvUrl?: string | null;
  locale: Locale;
  content: PageContent;
  portrait: SanityImageMeta;
  fullName?: string;
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
      className="inline rounded-md border border-primary/35 bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary cursor-pointer hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
    </button>
  );
}

export function AboutHero({
  cvUrl,
  locale,
  content,
  portrait,
  fullName,
}: AboutHeroProps) {
  const messages = getMessages(locale);
  const [activePill, setActivePill] = useState<PillKey | null>(null);
  const displayName = fullName || "Dimas Rizki Ardiansyah";

  return (
    <>
      <Section className="pt-6 pb-8 lg:py-10">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:gap-12">
            {/* LEFT COLUMN: Large Borderless Portrait Cutout */}
            <motion.div
              custom={0}
              variants={heroItem}
              initial="hidden"
              animate="visible"
              className="relative mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px]"
            >
              <div
                className="relative w-full border-0 bg-transparent"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 84%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 84%, transparent 100%)",
                }}
              >
                <Image
                  src={portrait.url}
                  alt={displayName}
                  width={portrait.width}
                  height={portrait.height}
                  priority
                  className="mx-auto h-auto w-full object-contain object-bottom drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
                />
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Heading, Academic Subtitle, Actions & Localized My Story */}
            <div className="flex flex-col items-start text-left">
              <motion.h1
                custom={1}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-[-0.025em] text-foreground"
              >
                {displayName}
              </motion.h1>

              <motion.p
                custom={2}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground"
              >
                {messages["about.academicSubtitle"]}
              </motion.p>

              {/* Action Buttons (Max 2) */}
              <motion.div
                custom={3}
                variants={heroItem}
                initial="hidden"
                animate="visible"
                className="mt-6 flex flex-wrap gap-3"
              >
                <Button
                  size="default"
                  className="rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
                  className="rounded-lg border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary"
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
                className="mt-7 w-full border-t border-border/70 pt-6 text-left"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">
                    {content.storyEyebrow || messages["about.story.eyebrow"]}
                  </span>
                  {content.storyTitle && (
                    <span className="text-xs text-muted-foreground">
                      — {content.storyTitle}
                    </span>
                  )}
                </div>

                {locale === "id" && content.storyParagraphs.length > 0 ? (
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {content.storyParagraphs.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(
                        [
                          "Full-stack + AI",
                          "Production Systems",
                          "Mission Critical",
                          "Cloud Architecture",
                        ] as PillKey[]
                      ).map((pill) => (
                        <PillButton key={pill} onClick={() => setActivePill(pill)}>
                          {pill}
                        </PillButton>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <p>
                      I am a{" "}
                      <PillButton onClick={() => setActivePill("Full-stack + AI")}>
                        Full-stack + AI
                      </PillButton>{" "}
                      engineer focused on building{" "}
                      <PillButton onClick={() => setActivePill("Production Systems")}>
                        Production Systems
                      </PillButton>{" "}
                      that actually scale. From crisp interfaces to resilient
                      backend services, I care about the full picture — not just
                      the happy path.
                    </p>

                    <p>
                      I have shipped{" "}
                      <PillButton onClick={() => setActivePill("Mission Critical")}>
                        Mission Critical
                      </PillButton>{" "}
                      software where downtime has real-world consequences,
                      building with observability, graceful degradation, and
                      runbooks from day one.
                    </p>

                    <p>
                      My work spans{" "}
                      <PillButton onClick={() => setActivePill("Cloud Architecture")}>
                        Cloud Architecture
                      </PillButton>{" "}
                      and practical automation so teams can ship reliably without
                      flying blind.
                    </p>

                    {content.storyParagraphs.slice(3).map((paragraph, i) => (
                      <p key={i + 3}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>

      <AboutPillModal pill={activePill} onClose={() => setActivePill(null)} />
    </>
  );
}
