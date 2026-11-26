"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GraduationCap, BookOpen, FlaskConical, Trophy } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
const EDUCATION_DATA = {
  initials: "UPN",
  institution: 'Universitas Pembangunan Nasional "Veteran" Yogyakarta',
  department: "Teknik Informatika",
  degree: "S1 / Bachelor of Computer Science",
  period: "2021 – 2025",
  accordion: [
    {
      id: "courses",
      icon: BookOpen,
      label: "Mata Kuliah Inti",
      items: [
        "Algoritma & Struktur Data",
        "Basis Data",
        "Jaringan Komputer",
        "Rekayasa Perangkat Lunak",
        "Kecerdasan Buatan",
      ],
    },
    {
      id: "research",
      icon: FlaskConical,
      label: "Penelitian",
      items: [
        "Skripsi: AI-assisted career guidance system – membangun sistem rekomendasi karier berbasis LLM dan analisis profil pengguna secara real-time.",
      ],
    },
    {
      id: "awards",
      icon: Trophy,
      label: "Penghargaan",
      items: [
        "HIMATIF Leadership Award",
        "Juara kompetisi programming tingkat nasional",
        "Finalis hackathon AI se-Yogyakarta",
      ],
    },
  ],
};

export function EducationSection() {
  const [open, setOpen] = useState(false);

  return (
    <Section>
      <Container>
        {/* Section label */}
        <p className="mb-6 font-mono text-xs font-medium text-muted-foreground">
          Education
        </p>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Card header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Logo placeholder */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 font-mono text-lg font-bold text-primary">
                {EDUCATION_DATA.initials}
              </div>

              {/* Info */}
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {EDUCATION_DATA.institution}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {EDUCATION_DATA.department} · {EDUCATION_DATA.degree}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                  <GraduationCap size={11} />
                  {EDUCATION_DATA.period}
                </div>
              </div>
            </div>

            {/* Accordion toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle education details"
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/50"
            >
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </button>
          </div>

          {/* Accordion content */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="edu-accordion"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.25, delay: 0.08 },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.15 },
                  },
                }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
                  {EDUCATION_DATA.accordion.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id}>
                        <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
                          <Icon size={12} />
                          {section.label}
                        </div>
                        <ul className="space-y-1.5">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
