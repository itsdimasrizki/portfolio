import type { SanitySettings } from "./siteSettings";
import type { Experience } from "./experience";
import type { Project } from "./project";
import type { Certificate } from "./certificate";
import type { TechnologyGroup } from "./technology";
import type { Skill } from "./skill";

export interface PortfolioPdfData {
  settings: SanitySettings;
  experiences: Experience[];
  featuredProjects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
  skills: Skill[];
  qrCodeDataUrl: string;
}
