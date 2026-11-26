"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { heroItem } from "@/lib/motion";
import type { PageContent } from "@/types/pageContent";
import { RoleRotator } from "./role-rotator";

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
  const headline =
    settings.fullName || content.heroHeadline || "Dimas Rizki Ardiansyah";

  const stats = [
    { value: "3+", label: messages["hero.stat.experience"] },
    { value: "15+", label: messages["hero.stat.projects"] },
    { value: "20+", label: messages["hero.stat.technologies"] },
  ];

  return (
    <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 items-center gap-6 md:grid-cols-2 lg:grid-cols-[1fr_minmax(320px,460px)_1fr] lg:items-end lg:gap-8">
      {/* LEFT COLUMN: Status, Name, Role & Primary Action */}
      <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left lg:self-center lg:pb-12">
        <motion.div
          custom={0}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground backdrop-blur-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold text-primary">
            [ONLINE // AVAILABLE]
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold leading-[1.06] tracking-[-0.03em] text-foreground"
        >
          {headline}
        </motion.h1>

        <motion.div
          custom={2}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-lg font-medium text-foreground md:justify-start"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {"// "}
            {messages["hero.specialization.label"]}
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
            className="rounded-full bg-primary px-6 font-mono text-xs uppercase tracking-wider text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
            asChild
          >
            <Link href={localeHref(locale, "/projects")}>
              {messages["cta.viewProjects"]}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* CENTER COLUMN: Borderless Cutout Portrait Anchored at Bottom */}
      <motion.div
        custom={1}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="order-1 relative mx-auto flex w-full max-w-[300px] items-end justify-center pt-4 md:order-3 md:col-span-2 md:max-w-[380px] md:pt-0 lg:order-2 lg:col-span-1 lg:max-w-[460px] lg:self-end"
      >
        {/* Subtle radial glow behind subject */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 bottom-0 h-3/4 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, var(--accent-primary), transparent 70%)",
          }}
        />
        <div
          className="relative w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 82%, transparent 100%)",
          }}
        >
          <Image
            src="/assets/dimas-pointing.png"
            alt="Dimas Rizki Ardiansyah"
            width={920}
            height={1150}
            priority
            className="mx-auto h-auto w-full object-contain object-bottom drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          />
        </div>
      </motion.div>

      {/* RIGHT COLUMN: Concise Technical Narrative, Micro Stats & Secondary Contact */}
      <div className="order-3 flex flex-col items-center pb-8 text-center md:order-2 md:items-start md:pb-0 md:text-left lg:order-3 lg:self-center lg:pb-12">
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

        {/* Micro Stats */}
        <motion.div
          custom={3}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-6 grid w-full max-w-md grid-cols-3 gap-2.5 border-y border-border/70 py-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Secondary Contact & CV Action */}
        <motion.div
          custom={4}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        >
          <Button
            size="default"
            variant="outline"
            className="rounded-full border-border bg-card/50 px-5 font-mono text-xs uppercase tracking-wider hover:border-primary/60 hover:text-primary"
            asChild
          >
            <Link href={localeHref(locale, "/contact")}>
              <Mail className="mr-2 h-3.5 w-3.5" />
              {messages["cta.letsConnect"]}
            </Link>
          </Button>

          <Button
            size="default"
            variant="ghost"
            className="rounded-full px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
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
        </motion.div>
      </div>
    </div>
  );
}
