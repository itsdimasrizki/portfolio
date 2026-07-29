import type { SanityImageSource } from "@sanity/image-url";
import type { SanityTechnology } from "./technology";

export type ProjectStatus = "completed" | "ongoing";

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  year: string;
  categories: string[];
  technologies: string[];
  status?: ProjectStatus;
  github?: string;
  liveDemo?: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  year: string;
  category?: string[];
  technologies?: SanityTechnology[];
  status?: ProjectStatus;
  github?: string;
  liveDemo?: string;
  order?: number;
}
