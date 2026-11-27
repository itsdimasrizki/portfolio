import type { ResolvedSettings } from "./siteSettings";
import type { Experience } from "./experience";
import type { Project } from "./project";
import type { Certificate } from "./certificate";
import type { TechnologyGroup } from "./technology";
import type { Skill } from "./skill";

export interface PortfolioPdfData {
  settings: ResolvedSettings;
  /** Perkenalan cover apa adanya dari Sanity; cover yang memecahnya jadi baris. */
  intro: string;
  experiences: Experience[];
  projects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
  skills: Skill[];
  qrCodeDataUrl: string;
  /** Foto hero / profil utama sebagai data URL; undefined bila file tidak terbaca. */
  profileImage?: string;
  /** Foto portrait bagian About sebagai data URL; jatuh ke profileImage bila tidak ada. */
  aboutImage?: string;
  /** Gambar pertama tiap proyek sebagai data URL, dikunci project.id. */
  projectImages: Record<string, string | undefined>;
  /** Thumbnail tiap sertifikat sebagai data URL, dikunci certificate.id. */
  certificateImages: Record<string, string | undefined>;
}
