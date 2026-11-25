"use client";

import React from "react";

/** About Section with clickable keyword pills */
export function AboutSection() {
  const pills = [
    "Full‑stack + AI",
    "Production Systems",
    "Micro‑Interactions",
  ];

  return (
    <section className="py-12" aria-labelledby="about-heading">
      <h2 id="about-heading" className="text-3xl font-display mb-6">
        About Me
      </h2>
      <p className="text-base text-muted-foreground mb-4">
        Full‑stack engineer with a passion for AI, production systems, and playful UI.
      </p>
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <button
            key={pill}
            className="rounded-full bg-accent-primary/20 px-3 py-1 text-sm text-accent-primary hover:bg-accent-primary/30"
            onClick={() => alert(`Pill "${pill}" clicked – modal would open`)}
          >
            {pill}
          </button>
        ))}
      </div>
    </section>
  );
}
