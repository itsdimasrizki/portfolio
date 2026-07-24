import { ComponentType } from "react";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

export interface ContactInfo {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: IconComponent;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: IconComponent;
}
