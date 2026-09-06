import type { Localized } from "@/i18n/locale";
import type { SanityTechnology } from "./technology";

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies?: string[];
}

export interface SanityExperience {
  _id: string;
  company: string;
  position: Localized | string;
  location: string;
  startDate: string;
  endDate: string;
  description: Localized | string;
  technologies?: SanityTechnology[];
  order?: number;
}
