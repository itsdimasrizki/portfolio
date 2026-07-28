import { Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";

import { client } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries/siteSettings.queries";
import type { SanitySettings } from "@/types/siteSettings";
import type { ContactInfo, SocialLink } from "@/types/contact";

export async function getSiteSettings(): Promise<{
  contactInfo: ContactInfo[];
  socialLinks: SocialLink[];
}> {
  let settings: SanitySettings | null = null;
  try {
    settings = await client.fetch<SanitySettings | null>(siteSettingsQuery, {}, {
      next: { tags: ["sanity", "settings"] },
    });
  } catch (error) {
    console.warn("Failed to fetch site settings from Sanity:", error);
  }

  const contactInfo: ContactInfo[] = [
    {
      id: "email",
      label: "Email",
      value: settings?.email ?? "",
      href: `mailto:${settings?.email ?? ""}`,
      icon: Mail,
    },
    {
      id: "phone",
      label: "Phone",
      value: settings?.phone ?? "",
      href: `tel:${(settings?.phone ?? "").replace(/\s/g, "")}`,
      icon: Phone,
    },
    {
      id: "location",
      label: "Location",
      value: settings?.location ?? "",
      href: settings?.locationMapUrl ?? "#",
      icon: MapPin,
    },
  ].filter((item) => item.value);

  const socialLinks: SocialLink[] = [
    {
      id: "github",
      label: "GitHub",
      href: settings?.githubUrl ?? "#",
      icon: FaGithub,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: settings?.linkedinUrl ?? "#",
      icon: FaLinkedinIn,
    },
    {
      id: "twitter",
      label: "X",
      href: settings?.twitterUrl ?? "#",
      icon: FaXTwitter,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: settings?.instagramUrl ?? "#",
      icon: FaInstagram,
    },
  ].filter((item) => item.href && item.href !== "#");

  return { contactInfo, socialLinks };
}
