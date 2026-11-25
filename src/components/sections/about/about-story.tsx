"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { PageContent } from "@/types/pageContent";

import { AboutPillModal, type PillKey } from "./about-pill-modal";

// ─── Pill button ────────────────────────────────────────────────────────────

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
      className="inline rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 font-mono text-sm text-primary cursor-pointer hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
    </button>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function AboutStory({ content }: { content: PageContent }) {
  const [activePill, setActivePill] = useState<PillKey | null>(null);

  const openPill = (pill: PillKey) => setActivePill(pill);
  const closePill = () => setActivePill(null);

  return (
    <>
      <Section>
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            {content.storyEyebrow && (
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
                {content.storyEyebrow}
              </p>
            )}

            {content.storyTitle && (
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {content.storyTitle}
              </h2>
            )}

            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              {/* First paragraph – keyword pills embedded inline */}
              <p>
                I am a{" "}
                <PillButton onClick={() => openPill("Full-stack + AI")}>
                  Full-stack + AI
                </PillButton>{" "}
                engineer focused on building{" "}
                <PillButton onClick={() => openPill("Production Systems")}>
                  Production Systems
                </PillButton>{" "}
                that actually scale. From pixel-perfect interfaces to resilient
                backend services, I care about the full picture — not just the
                happy path.
              </p>

              <p>
                I have shipped{" "}
                <PillButton onClick={() => openPill("Mission Critical")}>
                  Mission Critical
                </PillButton>{" "}
                software where downtime has real-world consequences, which means
                I build with observability, graceful degradation, and runbooks
                from day one. Infrastructure is not an afterthought.
              </p>

              <p>
                My background spans modern{" "}
                <PillButton onClick={() => openPill("Cloud Architecture")}>
                  Cloud Architecture
                </PillButton>{" "}
                on AWS and GCP, writing infrastructure as code and automating
                everything from provisioning to cost anomaly alerts — so the
                team can ship fast without flying blind.
              </p>

              {/* Remaining paragraphs from CMS (skip first 3 which are now inline) */}
              {content.storyParagraphs.slice(3).map((paragraph, i) => (
                <p key={i + 3}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <AboutPillModal pill={activePill} onClose={closePill} />
    </>
  );
}
