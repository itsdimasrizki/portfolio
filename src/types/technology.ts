import { ComponentType } from "react";

export interface SanityTechnology {
  _id: string;
  name: string;
  category: string;
  iconName: string;
  order?: number;
}

export interface TechnologyItem {
  name: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export interface TechnologyGroup {
  title: string;
  items: TechnologyItem[];
}
