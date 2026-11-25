"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Image from "next/image";

import type { Project } from "@/types/project";
import type { Locale } from "@/i18n/locale";

type Props = {
  projects: Project[];
  locale: Locale;
};

function getStatusBadge(project: Project): { label: string; classes: string } {
  if (project.status === "ongoing") {
    return {
      label: "FEATURED · WIP",
      classes:
        "bg-amber-500/10 text-amber-500 border border-amber-500/30",
    };
  }
  if (project.liveDemo) {
    return {
      label: "FEATURED · LIVE",
      classes:
        "bg-primary/10 text-primary border border-primary/30",
    };
  }
  return {
    label: "RESEARCH PROJECT",
    classes:
      "bg-muted/50 text-muted-foreground border border-border",
  };
}

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.42, ease: easeOut },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.3, ease: easeOut },
  }),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProjectSlider({ projects, locale }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!projects.length) return null;

  const project = projects[current];
  const badge = getStatusBadge(project);

  function navigate(dir: number) {
    setDirection(dir);
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return projects.length - 1;
      if (next >= projects.length) return 0;
      return next;
    });
  }

  const techChips = (project.technologies ?? []).slice(0, 6);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slide area */}
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={project.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="grid gap-8 rounded-2xl border border-border bg-card p-6 lg:grid-cols-2 lg:p-10"
        >
          {/* Left: Content */}
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Badge */}
              <span
                className={`inline-block rounded-full px-3 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest ${badge.classes}`}
              >
                {badge.label}
              </span>

              {/* Title */}
              <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground">
                {project.title}
              </h3>

              {/* Description (truncated 3 lines) */}
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {/* Tech chips */}
              {techChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techChips.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-sm border border-border bg-muted/40 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.technologies?.length ?? 0) > 6 && (
                    <span className="rounded-sm border border-border bg-muted/20 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      +{(project.technologies?.length ?? 0) - 6}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Live Demo
                  <ArrowUpRight size={14} />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
                >
                  <FaGithub size={14} />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Right: Image preview */}
          {project.images?.[0] ? (
            <div className="relative hidden aspect-video overflow-hidden rounded-xl border border-border bg-muted/20 lg:block">
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0px, 50vw"
              />
            </div>
          ) : (
            <div className="hidden items-center justify-center rounded-xl border border-border bg-muted/10 lg:flex">
              <span className="font-mono text-6xl font-bold tracking-tighter text-muted-foreground/20 select-none">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev/Next floating buttons */}
      {projects.length > 1 && (
        <>
          <button
            onClick={() => navigate(-1)}
            aria-label="Previous project"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => navigate(1)}
            aria-label="Next project"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {projects.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              aria-label={`Go to project ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
