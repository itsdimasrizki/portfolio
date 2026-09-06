import type { Localized } from "@/i18n/locale";

export interface SanitySettings {
  cvUrl?: string;
  fullName?: string;
  role?: Localized | string;
  bio?: Localized | string;
  portfolioUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  locationMapUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
}

/**
 * Settings setelah service memilih bahasanya. Komponen tampilan dan PDF
 * memakai tipe ini: field prosa sudah berupa string biasa, bukan objek.
 */
export type ResolvedSettings = Omit<SanitySettings, "role" | "bio"> & {
  role?: string;
  bio?: string;
};
