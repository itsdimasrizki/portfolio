import { client } from "@/sanity/client";
import { allSkillsQuery } from "@/sanity/queries/skill.queries";
import type { SanitySkill, Skill } from "@/types/skill";

export async function getSkills(): Promise<Skill[]> {
  try {
    const data = await client.fetch<SanitySkill[]>(allSkillsQuery, {}, {
      next: { tags: ["sanity", "skill"] },
    });

    if (!data || !Array.isArray(data)) return [];

    return data
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        title: item.title,
        description: item.description,
        iconName: item.iconName,
      }));
  } catch (error) {
    console.warn("Failed to fetch skills from Sanity:", error);
    return [];
  }
}
