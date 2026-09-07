"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { heroItem } from "@/lib/motion";
import type { PageContent } from "@/types/pageContent";
import { RoleRotator } from "./role-rotator";

type HeroContentProps = {
  content: PageContent;
  /**
   * `fullName` jadi cadangan judul bila dokumen `pageContent` hilang, dan
   * `roles` adalah jalur utama peran yang berputar di judul — `heroHighlight`
   * turun jadi cadangannya.
   */
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
    <div className="max-w-xl">
      {content.heroBadge && (
        <motion.span
          custom={0}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700"
        >
          {content.heroBadge}
        </motion.span>
      )}

      <motion.h1
        custom={1}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
      >
        {headline}{" "}
        {settings.roles.length > 0 ? (
          <RoleRotator roles={settings.roles} />
        ) : (
          <span className="text-teal-700">{content.heroHighlight}</span>
        )}
      </motion.h1>

      {content.heroDescription && (
        <motion.p
          custom={2}
          variants={heroItem}
          initial="hidden"
          animate="visible"
          className="mt-6 text-base leading-relaxed text-muted-foreground"
        >
          {content.heroDescription}
        </motion.p>
      )}

      <motion.div
        custom={3}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-wrap gap-4"
      >
        <Button size="lg" asChild>
          <Link href={localeHref(locale, "/projects")}>
            {messages["cta.viewProjects"]}
          </Link>
        </Button>

        <Button size="lg" variant="outline" asChild>
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
