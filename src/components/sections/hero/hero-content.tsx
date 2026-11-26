"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageSequenceCanvas } from "@/components/motion/image-sequence-canvas";
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

  return (
    <div className="grid min-h-[calc(100svh-4rem)] grid-cols-1 items-center gap-6 py-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(360px,500px)_minmax(0,1fr)] lg:items-center lg:gap-8 lg:py-0">
      {/* LEFT FLANK: Status, Name, Specialization & Primary Action */}
      <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
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
      </div>

      {/* CENTERPIECE: Ring Sequence Canvas Aligned Directly Behind Borderless Portrait Cutout */}
      <motion.div
        custom={1}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="order-1 relative mx-auto flex w-full max-w-[340px] items-center justify-center py-6 md:order-3 md:col-span-2 md:max-w-[420px] lg:order-2 lg:col-span-1 lg:max-w-[500px] lg:py-0"
      >
        <ImageSequenceCanvas
          variant="backdrop"
          frames={settings.scrollSequenceFrames}
        />

        <div
          className="relative z-10 w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 84%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 84%, transparent 100%)",
          }}
        >
          <Image
            src={settings.heroPortrait.url}
            alt={headline}
            width={settings.heroPortrait.width}
            height={settings.heroPortrait.height}
            priority
            className="mx-auto h-auto w-full object-contain object-bottom drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]"
          />
        </div>
      </motion.div>

      {/* RIGHT FLANK: Concise Narrative & Single Secondary Action */}
      <div className="order-3 flex flex-col items-center pb-8 text-center md:order-2 md:items-start md:pb-0 md:text-left lg:order-3">
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
      </div>
    </div>
  );
}
