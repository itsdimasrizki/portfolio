"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import type { Project } from "@/types/project";
import { heroItem } from "@/lib/motion";

interface BuildingCardProps {
  locale: Locale;
  project?: Project | null;
}

export function BuildingCard({ locale, project }: BuildingCardProps) {
  const messages = getMessages(locale);

  const title = project?.title || messages["hero.building.title"];
  const description = project?.description || messages["hero.building.description"];
  const techStack = project?.technologies && project.technologies.length > 0
    ? project.technologies.slice(0, 5)
    : ["Python", "LangGraph", "FastAPI", "React", "PostgreSQL"];

  const liveUrl = project?.liveDemo || "https://matcha-career-assistant.vercel.app/";
  const githubUrl = project?.github;

  return (
    <motion.article
      custom={2}
      variants={heroItem}
      initial="hidden"
      animate="visible"
      className="relative w-full overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-md"
      aria-label={title}
    >
      {/* Mock Browser Window Titlebar */}
      <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>

        {/* Address pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-3 py-0.5 font-mono text-[11px] text-muted-foreground">
          <Globe className="h-3 w-3 text-primary/70" />
          <span className="truncate max-w-[150px] sm:max-w-[200px]">
            matcha.ai/career-agent
          </span>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="hidden sm:inline">{messages["hero.building.status"]}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
            {messages["hero.building.badge"]}
          </span>
        </div>

        <h3 className="mt-1 font-display text-lg font-bold text-foreground">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>

        {/* Tech Stack Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5" aria-label="Technologies used">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground transition-colors hover:border-primary/50"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <span>{messages["hero.building.liveDemo"]}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <FaGithub className="h-3.5 w-3.5" />
                <span>{messages["hero.building.source"]}</span>
              </a>
            )}
          </div>

          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            v2.6 // PROD
          </span>
        </div>
      </div>
    </motion.article>
  );
}
