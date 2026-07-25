import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiShadcnui,
  SiFramer,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiPostman,
  SiVercel,
  SiSanity,
} from "react-icons/si";

import {
  FaReact,
  FaNodeJs,
  FaLaravel,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaFigma,
} from "react-icons/fa6";

import { ComponentType } from "react";
import { client } from "@/sanity/client";
import { allTechnologiesQuery } from "@/sanity/queries/technology.queries";
import type { SanityTechnology, TechnologyGroup } from "@/types/technology";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

const iconMap: Record<string, IconComponent> = {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiShadcnui,
  SiFramer,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiPostman,
  SiVercel,
  SiSanity,
  FaReact,
  FaNodeJs,
  FaLaravel,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaFigma,
};

const CATEGORY_ORDER = ["Frontend", "Backend", "Database", "Tools"];

export async function getTechnologies(): Promise<TechnologyGroup[]> {
  try {
    const data = await client.fetch<SanityTechnology[]>(allTechnologiesQuery);

    if (!data || !Array.isArray(data)) return [];

    const grouped = data.reduce<Record<string, TechnologyGroup>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { title: item.category, items: [] };
      }

      const icon = iconMap[item.iconName];
      if (icon) {
        acc[item.category].items.push({ name: item.name, icon });
      }

      return acc;
    }, {});

    return CATEGORY_ORDER.filter((cat) => grouped[cat]).map(
      (cat) => grouped[cat]
    );
  } catch (error) {
    console.warn("Failed to fetch technologies from Sanity:", error);
    return [];
  }
}
