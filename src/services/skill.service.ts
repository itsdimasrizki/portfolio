import { client } from "@/sanity/client";
import { allSkillsQuery } from "@/sanity/queries/skill.queries";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { SanitySkill, Skill } from "@/types/skill";
import { MOCK_SKILLS } from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function getSkills(locale: Locale): Promise<Skill[]> {
  if (USE_MOCK) return MOCK_SKILLS;
  try {
    const data = await client.fetch<SanitySkill[]>(allSkillsQuery, {}, {
      next: { tags: ["sanity", "skill"] },
    });

    if (!data || !Array.isArray(data)) return [];

    return data
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        title: pickLocalized(item.title, locale),
        description: pickLocalized(item.description, locale),
        iconName: item.iconName,
      }));
  } catch (error) {
    console.warn("Failed to fetch skills from Sanity:", error);
    return [];
  }
}
