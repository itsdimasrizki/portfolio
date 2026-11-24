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
      {content.heroBadge && (
        <motion.div
          custom={0}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground uppercase tracking-wider"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>{content.heroBadge}</span>
        </motion.div>
      )}

      <motion.div
        custom={1}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-5 space-y-2"
      >
        <div className="flex items-center gap-2 font-mono text-base md:text-lg text-muted-foreground">
          <TypewriterGreeting />
          <span>, I am</span>
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-foreground">
          {headline}
        </h1>

        <div className="pt-1 font-display text-xl md:text-2xl font-semibold text-muted-foreground">
          {settings.roles.length > 0 ? (
            <RoleRotator roles={settings.roles} />
          ) : (
            <span className="text-primary">{content.heroHighlight}</span>
          )}
        </div>
      </motion.div>

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

      <motion.div
        custom={3}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-wrap items-center gap-4"
      >
        <Button size="lg" className="rounded-none px-6 font-mono text-xs uppercase tracking-wider" asChild>
          <Link href={localeHref(locale, "/projects")}>
            {messages["cta.viewProjects"]}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button size="lg" variant="outline" className="rounded-none border-border px-6 font-mono text-xs uppercase tracking-wider" asChild>
          <a
            href={cvUrl ?? "/resume.pdf"}
            download
            target={cvUrl ? "_blank" : undefined}
            rel={cvUrl ? "noopener noreferrer" : undefined}
          >
            {messages["cta.downloadCv"]}
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
