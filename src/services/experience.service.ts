import { client } from "@/sanity/client";
import { allExperiencesQuery } from "@/sanity/queries/experience.queries";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { Experience, SanityExperience } from "@/types/experience";
import { MOCK_EXPERIENCES } from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

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
  if (USE_MOCK) return MOCK_EXPERIENCES;
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
