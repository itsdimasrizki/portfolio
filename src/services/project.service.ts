import { client } from "@/sanity/client";
import {
  allProjectsQuery,
  featuredProjectsQuery,
} from "@/sanity/queries/project.queries";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { Project, SanityProject } from "@/types/project";

function toProject(raw: SanityProject, locale: Locale): Project {
  return {
    id: raw._id,
    title: raw.title,
    description: pickLocalized(raw.description, locale),
    images: raw.images ?? [],
    year: raw.year,
    categories: (raw.category ?? []).map((item) => pickLocalized(item, locale)),
    technologies: raw.technologies?.map((t) => t.name) ?? [],
    status: raw.status,
    github: raw.github,
    liveDemo: raw.liveDemo,
  };
}

export async function getAllProjects(locale: Locale): Promise<Project[]> {
  try {
    const data = await client.fetch<SanityProject[]>(allProjectsQuery, {}, {
      next: { tags: ["sanity", "project"] },
    });
    return data ? data.map((raw) => toProject(raw, locale)) : [];
  } catch (error) {
    console.warn("Failed to fetch projects from Sanity:", error);
    return [];
  }
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  try {
    const data = await client.fetch<(SanityProject | null)[]>(featuredProjectsQuery, {}, {
      next: { tags: ["sanity", "project", "siteSettings"] },
    });
    const validData = data ? data.filter((item): item is SanityProject => item !== null) : [];
    if (validData.length > 0) {
      return validData.map((raw) => toProject(raw, locale));
    }
    const all = await getAllProjects(locale);
    return all.slice(0, 3);
  } catch (error) {
    console.warn("Failed to fetch featured projects from Sanity:", error);
    return [];
  }
}
