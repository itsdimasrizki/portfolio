"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { heroItem } from "@/lib/motion";
import type { PageContent } from "@/types/pageContent";
import { RoleRotator } from "./role-rotator";
import { TypewriterGreeting } from "./typewriter-greeting";
import { DogBuddy } from "./dog-buddy";
import { AiModal } from "./ai-modal";

type HeroContentProps = {
  content: PageContent;
  settings: { fullName?: string; roles: string[] };
  cvUrl?: string | null;
  locale: Locale;
};

export function HeroContent({
  content,
  settings,
  cvUrl,
  locale,
}: HeroContentProps) {
  const messages = getMessages(locale);
  const headline = content.heroHeadline || settings.fullName || "";

  return (
    <div className="max-w-2xl">
      {/* Top Monospace Terminal Badge */}
      <motion.div
        custom={0}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 font-mono text-xs uppercase tracking-wider text-foreground backdrop-blur-xs"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-bold text-primary">{messages["hero.terminal.prefix"]}</span>
        <span className="text-border">|</span>
        <span className="truncate max-w-[200px] sm:max-w-none">
          {content.heroBadge || messages["hero.terminal.status"]}
        </span>
      </motion.div>

      {/* Main Heading & Greeting */}
      <motion.div
        custom={1}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-6"
      >
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
          <TypewriterGreeting locale={locale} />
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {headline}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xl font-medium text-foreground sm:text-2xl">
          <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
            {"// "}{messages["hero.specialization.label"]}
          </span>
          <RoleRotator roles={settings.roles} />
        </div>
      </motion.div>

      {/* Bio Description */}
      {content.heroDescription && (
        <motion.p
          custom={2}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {content.heroDescription}
        </motion.p>
      )}

      {/* Action Buttons & Playful Widgets */}
      <motion.div
        custom={3}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <Button
          size="lg"
          className="rounded-full bg-primary px-6 font-mono text-xs uppercase tracking-wider text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary"
          asChild
        >
          <Link href={localeHref(locale, "/projects")}>
            {messages["cta.viewProjects"]}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-border px-6 font-mono text-xs uppercase tracking-wider hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
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

        {/* Playful Companion & AI Launcher */}
        <DogBuddy locale={locale} />
        <AiModal locale={locale} />
      </motion.div>
    </div>
  );
}
