"use client";

import { Plus, Minus } from "lucide-react";

import { Experience } from "@/types/experience";

type ExperienceCardProps = {
  experience: Experience;
  expanded?: boolean;
  onToggle?: () => void;
};

export function ExperienceCard({
  experience,
  expanded = false,
  onToggle,
}: ExperienceCardProps) {
  return (
    <article className="relative rounded-2xl border border-border bg-card p-4 shadow-xs transition-colors duration-200 hover:border-foreground/40 sm:p-6">
      {/* Expand / collapse toggle */}
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? "Collapse description" : "Expand description"}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {expanded ? <Minus size={14} /> : <Plus size={14} />}
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pr-10">
        <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
          {experience.position}
        </h3>

        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {experience.startDate} — {experience.endDate}
        </span>
      </div>

      {/* Company / location */}
      <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-primary">
        <span className="font-semibold">{experience.company}</span>
        {experience.location && (
          <>
            <span className="text-border">/</span>
            <span className="text-muted-foreground">{experience.location}</span>
          </>
        )}
      </div>

      {/* Description */}
      <p
        className={`mt-4 text-sm leading-relaxed text-muted-foreground transition-all duration-300 ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {experience.description}
      </p>

      {/* Tech stack chips */}
      {experience.technologies && experience.technologies.length > 0 && (
        <div
          className={`mt-4 flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
