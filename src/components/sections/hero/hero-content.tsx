"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageSequenceCanvas } from "@/components/motion/image-sequence-canvas";
import { useHeroRecede } from "@/components/motion/hero-stack";
import { TypeText } from "@/components/motion/type-text";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { heroItem } from "@/lib/motion";
import type { PageContent } from "@/types/pageContent";
import type { SanityImageMeta } from "@/types/siteSettings";
import { RoleRotator } from "./role-rotator";

type HeroContentProps = {
  content: PageContent;
  settings: {
    fullName?: string;
    roles: string[];
    heroPortrait: SanityImageMeta;
    scrollSequenceFrames: string[];
  };
  locale: Locale;
};

export function HeroContent({ content, settings, locale }: HeroContentProps) {
  const messages = getMessages(locale);
  const headline =
    settings.fullName || content.heroHeadline || "Dimas Rizki Ardiansyah";
  const statusText = content.heroBadge || messages["hero.terminal.status"];

  // Depth parallax while the hero is being covered: the copy is "closer" to
  // the viewer than the portrait, so it travels faster and fades out first.
  const recede = useHeroRecede();
  const reduceMotion = useReducedMotion();
  const flankOpacity = useTransform(recede, [0, 0.55], [1, 0]);
  const leftY = useTransform(recede, [0, 1], [0, reduceMotion ? 0 : -140]);
  const rightY = useTransform(recede, [0, 1], [0, reduceMotion ? 0 : -100]);

  return (
    <div className="grid min-h-[calc(100svh-4rem)] grid-cols-1 items-end gap-6 pt-2 pb-0 md:grid-cols-2 lg:grid-cols-[minmax(280px,1fr)_minmax(480px,760px)_minmax(280px,1fr)] lg:gap-8 xl:grid-cols-[minmax(320px,1.1fr)_minmax(560px,840px)_minmax(320px,1fr)] xl:gap-10">
      {/* LEFT FLANK: Status, Name, Specialization & Primary Action */}
      <motion.div
        style={{ y: leftY, opacity: flankOpacity }}
        className="order-2 flex flex-col items-center self-center text-center md:order-1 md:items-start md:text-left py-4 lg:py-10"
      >
        <motion.div
          custom={0}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-2 w-2 rounded-full bg-emerald-500"
          />
          <span>{statusText}</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-foreground"
        >
          {headline}
        </motion.h1>

        <motion.div
          custom={2}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-base font-medium text-foreground md:justify-start"
        >
          <span className="text-xs font-medium text-muted-foreground">
            {messages["hero.specialization.label"]}:
          </span>
          <RoleRotator roles={settings.roles} />
        </motion.div>

        <motion.div
          custom={3}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        >
          <Button
            size="lg"
            className="rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            asChild
          >
            <Link href={localeHref(locale, "/projects")}>
              {messages["cta.viewProjects"]}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* CENTERPIECE: Scaled Hero Portrait Grounded to Section Bottom with Rich 3D Orbital Backdrop */}
      <motion.div
        custom={1}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="order-1 relative mx-auto flex w-full max-w-[420px] self-end items-end justify-center overflow-visible md:order-3 md:col-span-2 md:max-w-[540px] lg:order-2 lg:col-span-1 lg:max-w-[720px] xl:max-w-[820px] 2xl:max-w-[880px]"
      >
        <ImageSequenceCanvas
          variant="backdrop"
          frames={settings.scrollSequenceFrames}
        />

        {/* Subtle floating telemetry badges flanking the heroic portrait */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.4 },
            y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute -right-6 top-[16%] z-20 hidden rounded-xl border border-border/80 bg-card/85 px-3.5 py-2.5 shadow-xl backdrop-blur-md lg:flex lg:flex-col lg:gap-1 lg:-right-10 xl:-right-14"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Fullstack · AI · IoT</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Production-Grade Systems
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.5 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute -left-6 bottom-[30%] z-20 hidden rounded-xl border border-border/80 bg-card/85 px-3.5 py-2.5 shadow-xl backdrop-blur-md lg:flex lg:flex-col lg:gap-1 lg:-left-10 xl:-left-14"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>UPN &quot;Veteran&quot; YK</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Informatics Engineering
          </span>
        </motion.div>

        <div
          className="relative z-10 w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 86%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 86%, transparent 100%)",
          }}
        >
          <Image
            src={settings.heroPortrait.url}
            alt={headline}
            width={settings.heroPortrait.width}
            height={settings.heroPortrait.height}
            priority
            className="mx-auto h-auto w-full object-contain object-bottom drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)]"
          />
        </div>
      </motion.div>

      {/* RIGHT FLANK: Concise Narrative, Secondary CTA & Grounding Telemetry Card */}
      <motion.div
        style={{ y: rightY, opacity: flankOpacity }}
        className="order-3 flex flex-col items-center self-center pb-8 text-center md:order-2 md:items-start md:pb-10 md:text-left lg:order-3 py-4 lg:py-10"
      >
        {content.heroDescription && (
          <motion.p
            custom={2}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {content.heroDescription}
          </motion.p>
        )}

        <motion.div
          custom={3}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        >
          <Button
            size="lg"
            variant="outline"
            className="rounded-lg border-border bg-card/60 px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            asChild
          >
            <Link href={localeHref(locale, "/contact")}>
              <Mail className="mr-2 h-4 w-4" />
              {messages["cta.letsConnect"]}
            </Link>
          </Button>
        </motion.div>

        {/* Technical telemetry micro-panel to eliminate empty dashboard impression */}
        <motion.div
          custom={4}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-8 hidden w-full max-w-sm rounded-xl border border-border/80 bg-card/60 p-4 text-xs backdrop-blur-sm sm:block"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5 text-muted-foreground">
            <span className="font-semibold tracking-wider uppercase text-[11px] text-foreground/80 font-sans">&#47;&#47; TELEMETRY</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium font-sans">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="mt-3 space-y-2.5 text-[12px] font-sans">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] uppercase tracking-wider">DOMAIN</span>
              <TypeText text="Fullstack · AI · IoT" delay={0.8} className="text-foreground font-medium" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] uppercase tracking-wider">BASE</span>
              <TypeText text="Yogyakarta, ID" delay={1.6} className="text-foreground font-medium" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] uppercase tracking-wider">STATUS</span>
              <TypeText text="Open to Work" delay={2.3} className="text-primary font-medium" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
