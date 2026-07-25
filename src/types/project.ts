import type { SanityImageSource } from "@sanity/image-url";

export type ProjectStatus = "completed" | "ongoing";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
  technologies: string[];
  status?: ProjectStatus;
  github?: string;
  liveDemo?: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  description: string;
  image?: SanityImageSource;
  year: string;
  category: string;
  technologies: string[];
  status?: ProjectStatus;
  github?: string;
  liveDemo?: string;
  order?: number;
}
