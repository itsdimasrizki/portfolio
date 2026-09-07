import { client } from "@/sanity/client";
import { allExperiencesQuery } from "@/sanity/queries/experience.queries";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { Experience, SanityExperience } from "@/types/experience";

function toExperience(raw: SanityExperience, locale: Locale): Experience {
  return {
    id: raw._id,
    company: raw.company,
    position: pickLocalized(raw.position, locale),
    location: raw.location ?? "",
    startDate: raw.startDate,
    endDate: raw.endDate,
    description: pickLocalized(raw.description, locale),
    technologies: raw.technologies?.map((t) => t.name) ?? [],
  };
}

export async function getAllExperiences(locale: Locale): Promise<Experience[]> {
  try {
    const data = await client.fetch<SanityExperience[]>(allExperiencesQuery, {}, {
      next: { tags: ["sanity", "experience"] },
    });
    return data ? data.map((raw) => toExperience(raw, locale)) : [];
  } catch (error) {
    console.warn("Failed to fetch experiences from Sanity:", error);
    return [];
  }
}
