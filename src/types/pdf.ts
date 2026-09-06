import type { ResolvedSettings } from "./siteSettings";
import type { Experience } from "./experience";
import type { Project } from "./project";
import type { Certificate } from "./certificate";
import type { TechnologyGroup } from "./technology";
import type { Skill } from "./skill";

export interface PortfolioPdfData {
  settings: ResolvedSettings;
  experiences: Experience[];
  featuredProjects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
  skills: Skill[];
  qrCodeDataUrl: string;
  /** Foto profil sebagai data URL; undefined bila file tidak terbaca. */
  profileImage?: string;
  /** Gambar pertama tiap proyek sebagai data URL, dikunci project.id. */
  projectImages: Record<string, string | undefined>;
}
