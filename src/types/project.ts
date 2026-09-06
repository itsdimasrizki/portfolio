import type { SanityImageSource } from "@sanity/image-url";
import type { Localized } from "@/i18n/locale";
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
  // `| string` dipertahankan dengan sengaja: dokumen yang belum dimigrasi
  // masih berisi string, dan pickLocalized menerima keduanya.
  description: Localized | string;
  images?: string[];
  year: string;
  category?: (Localized | string)[];
  technologies?: SanityTechnology[];
  status?: ProjectStatus;
  github?: string;
  liveDemo?: string;
  order?: number;
}
