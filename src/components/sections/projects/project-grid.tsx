"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";
import { staggerContainer } from "@/lib/motion";

type ProjectGridProps = {
  projects: Project[];
};

const CATEGORIES = ["ALL", "AI & AGENTS", "IOT & HARDWARE", "WEB APPS"] as const;

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "ALL") return true;

    const textToMatch = [
      project.title,
      project.description,
      ...(project.technologies || []),
      ...(project.categories || []),
    ]
      .join(" ")
      .toLowerCase();

    if (selectedCategory === "AI & AGENTS") {
      return (
        textToMatch.includes("ai") ||
        textToMatch.includes("ml") ||
        textToMatch.includes("langgraph") ||
        textToMatch.includes("python") ||
        textToMatch.includes("assistant")
      );
    }

    if (selectedCategory === "IOT & HARDWARE") {
      return (
        textToMatch.includes("iot") ||
        textToMatch.includes("esp") ||
        textToMatch.includes("mqtt") ||
        textToMatch.includes("c++") ||
        textToMatch.includes("arduino") ||
        textToMatch.includes("agro")
      );
    }

    if (selectedCategory === "WEB APPS") {
      return (
        textToMatch.includes("web") ||
        textToMatch.includes("react") ||
        textToMatch.includes("next") ||
        textToMatch.includes("php") ||
        textToMatch.includes("tailwind")
      );
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4 font-mono text-xs">
        <span className="text-muted-foreground mr-1 text-[11px] uppercase tracking-wider">
          FILTER_BY //
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 transition-colors border ${
              selectedCategory === cat
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            [{cat}]
          </button>
        ))}
        <span className="ml-auto text-[11px] text-muted-foreground">
          {filteredProjects.length} OF {projects.length} SYSTEMS
        </span>
      </div>

      {/* Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

