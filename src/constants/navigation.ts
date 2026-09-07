import type { MessageKey } from "@/i18n/dictionary";

export interface NavLink {
  labelKey: MessageKey;
  href: string;
}

export const navLinks: NavLink[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.projects", href: "/projects" },
  { labelKey: "nav.experience", href: "/experience" },
  { labelKey: "nav.certificates", href: "/certificates" },
  { labelKey: "nav.contact", href: "/contact" },
];
