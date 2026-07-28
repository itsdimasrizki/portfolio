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
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies?: SanityTechnology[];
  order?: number;
}
