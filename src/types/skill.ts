import type { Localized } from "@/i18n/locale";

export interface SanitySkill {
  _id: string;
  title: Localized | string;
  description: Localized | string;
  iconName: string;
  order?: number;
}

export interface Skill {
  title: string;
  description: string;
  iconName: string;
}
