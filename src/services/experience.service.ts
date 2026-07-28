import { client } from "@/sanity/client";
import { allExperiencesQuery } from "@/sanity/queries/experience.queries";
import type { Experience, SanityExperience } from "@/types/experience";

function toExperience(raw: SanityExperience): Experience {
  return {
    id: raw._id,
    company: raw.company,
    position: raw.position,
    location: raw.location ?? "",
    startDate: raw.startDate,
    endDate: raw.endDate,
    description: raw.description ?? "",
    technologies: raw.technologies?.map((t) => t.name) ?? [],
  };
}

export async function getAllExperiences(): Promise<Experience[]> {
  try {
    const data = await client.fetch<SanityExperience[]>(allExperiencesQuery, {}, {
      next: { tags: ["sanity", "experience"] },
    });
    return data ? data.map(toExperience) : [];
  } catch (error) {
    console.warn("Failed to fetch experiences from Sanity:", error);
    return [];
  }
}
