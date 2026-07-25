import { ComponentType } from "react";

export interface SanitySkill {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  order?: number;
}

export interface Skill {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}
