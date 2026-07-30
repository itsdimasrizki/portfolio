import { client } from "@/sanity/client";
import {
  allProjectsQuery,
  featuredProjectsQuery,
} from "@/sanity/queries/project.queries";
import type { Project, SanityProject } from "@/types/project";

function toProject(raw: SanityProject): Project {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description,
    images: raw.images ?? [],
    year: raw.year,
    categories: raw.category ?? [],
    technologies: raw.technologies?.map((t) => t.name) ?? [],
    status: raw.status,
    github: raw.github,
    liveDemo: raw.liveDemo,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch<SanityProject[]>(allProjectsQuery, {}, {
      next: { tags: ["sanity", "project"] },
    });
    return data ? data.map(toProject) : [];
  } catch (error) {
    console.warn("Failed to fetch projects from Sanity:", error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch<(SanityProject | null)[]>(featuredProjectsQuery, {}, {
      next: { tags: ["sanity", "project", "siteSettings"] },
    });
    const validData = data ? data.filter((item): item is SanityProject => item !== null) : [];
    if (validData.length > 0) {
      return validData.map(toProject);
    }
    const all = await getAllProjects();
    return all.slice(0, 3);
  } catch (error) {
    console.warn("Failed to fetch featured projects from Sanity:", error);
    return [];
  }
}
