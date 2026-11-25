"use client";

import { motion } from "framer-motion";
import { ComponentType } from "react";
import { Code2 } from "lucide-react";

import * as LuIcons from "lucide-react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa6";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import type { Skill } from "@/types/skill";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

const allIcons: Record<string, IconComponent> = {
  ...(LuIcons as unknown as Record<string, IconComponent>),
  ...(SiIcons as unknown as Record<string, IconComponent>),
  ...(FaIcons as unknown as Record<string, IconComponent>),
  RefreshCow: LuIcons.RefreshCw as IconComponent,
};

function getDynamicSkillIcon(iconName: string): IconComponent {
  if (!iconName) return Code2;

  const trimmed = iconName.trim();
  if (allIcons[trimmed]) return allIcons[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, IconComp] of Object.entries(allIcons)) {
    if (key.toLowerCase() === lower) return IconComp;
  }

  return Code2;
}

// Proficiency classification based on skill title
const EXPERT_SKILLS = new Set([
  "TypeScript", "Python", "React", "Next.js", "Node.js", "TailwindCSS",
]);
const ADVANCED_SKILLS = new Set([
  "FastAPI", "PostgreSQL", "Docker", "Git", "LangChain", "AWS",
]);

type ProficiencyLevel = "Expert" | "Advanced" | "Intermediate";

function getProficiency(title: string): ProficiencyLevel {
  if (EXPERT_SKILLS.has(title)) return "Expert";
  if (ADVANCED_SKILLS.has(title)) return "Advanced";
  return "Intermediate";
}

const proficiencyStyles: Record<ProficiencyLevel, string> = {
  Expert:
    "bg-primary/15 text-primary border-primary/30",
  Advanced:
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Intermediate:
    "bg-muted/50 text-muted-foreground border-border",
};

// Category grouping
const CATEGORY_GROUPS: { label: string; keywords: string[] }[] = [
  {
    label: "Languages",
    keywords: ["typescript", "javascript", "python", "go", "sql", "rust", "php", "java", "c++", "c#"],
  },
  {
    label: "Frameworks",
    keywords: ["react", "next.js", "node.js", "nestjs", "tailwindcss", "fastapi", "django", "express", "laravel", "vue", "nuxt"],
  },
  {
    label: "Cloud & DB",
    keywords: ["aws", "postgresql", "docker", "supabase", "redis", "mongodb", "mysql", "firebase", "vercel", "kubernetes"],
  },
  {
    label: "AI & ML",
    keywords: ["langchain", "langgraph", "openai", "claude", "rag", "pgvector", "mcp", "huggingface", "tensorflow", "pytorch"],
  },
  {
    label: "Tools",
    keywords: ["git", "linux", "figma", "ci/cd", "github", "gitlab", "vscode", "postman", "jira"],
  },
];

function assignCategory(title: string): string {
  const lower = title.toLowerCase();
  for (const group of CATEGORY_GROUPS) {
    if (group.keywords.some((kw) => lower.includes(kw))) {
      return group.label;
    }
  }
  return "Tools";
}

type Props = {
  skills: Skill[];
  locale: Locale;
};

export function Skills({ skills, locale }: Props) {
  const messages = getMessages(locale);

  // Group skills by category
  const grouped: Record<string, Skill[]> = {};
  for (const skill of skills) {
    const cat = assignCategory(skill.title);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(skill);
  }

  // Order categories according to CATEGORY_GROUPS
  const orderedCategories = [
    ...CATEGORY_GROUPS.map((g) => g.label).filter((l) => grouped[l]),
    ...Object.keys(grouped).filter(
      (k) => !CATEGORY_GROUPS.find((g) => g.label === k),
    ),
  ];

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={messages["section.skills.eyebrow"]}
            title={messages["section.skills.title"]}
            description={messages["section.skills.description"]}
          />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 space-y-8"
        >
          {orderedCategories.map((category) => (
            <motion.div key={category} variants={staggerItem}>
              {/* Category label */}
              <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {`// ${category}`}
              </p>

              {/* Skill chips grid */}
              <div className="flex flex-wrap gap-2">
                {grouped[category].map((skill) => {
                  const Icon = getDynamicSkillIcon(skill.iconName);
                  const level = getProficiency(skill.title);

                  return (
                    <div
                      key={skill.title}
                      className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:border-foreground/30"
                      title={skill.description}
                    >
                      {/* Icon */}
                      <span className="text-primary/80">
                        <Icon size={15} />
                      </span>

                      {/* Name */}
                      <span className="text-sm font-medium text-foreground">
                        {skill.title}
                      </span>

                      {/* Level badge */}
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${proficiencyStyles[level]}`}
                      >
                        {level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
