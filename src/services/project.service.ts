import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
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
    image: raw.image ? urlFor(raw.image).width(800).url() : "",
    year: raw.year,
    category: raw.category,
    technologies: raw.technologies ?? [],
    status: raw.status,
    github: raw.github,
    liveDemo: raw.liveDemo,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch<SanityProject[]>(allProjectsQuery);
    return data ? data.map(toProject) : [];
  } catch (error) {
    console.warn("Failed to fetch projects from Sanity:", error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch<SanityProject[]>(featuredProjectsQuery);
    return data ? data.map(toProject) : [];
  } catch (error) {
    console.warn("Failed to fetch featured projects from Sanity:", error);
    return [];
  }
}
