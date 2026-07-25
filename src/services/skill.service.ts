import { Code2, Database, Globe, Server, Settings } from "lucide-react";
import { FaFigma } from "react-icons/fa6";
import { ComponentType } from "react";

import { client } from "@/sanity/client";
import { allSkillsQuery } from "@/sanity/queries/skill.queries";
import type { SanitySkill, Skill } from "@/types/skill";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

const iconMap: Record<string, IconComponent> = {
  Code2,
  Database,
  Globe,
  Server,
  Settings,
  FaFigma,
};

export async function getSkills(): Promise<Skill[]> {
  try {
    const data = await client.fetch<SanitySkill[]>(allSkillsQuery);

    if (!data || !Array.isArray(data)) return [];

    return data
      .filter((item) => iconMap[item.iconName])
      .map((item) => ({
        title: item.title,
        description: item.description,
        icon: iconMap[item.iconName],
      }));
  } catch (error) {
    console.warn("Failed to fetch skills from Sanity:", error);
    return [];
  }
}
