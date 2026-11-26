import { Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";

import { client } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries/siteSettings.queries";
import { getMessages } from "@/i18n/dictionary";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { ResolvedSettings, SanitySettings } from "@/types/siteSettings";
import type { ContactInfo, SocialLink } from "@/types/contact";
import { MOCK_SETTINGS } from "@/lib/mock-data";
import {
  DEFAULT_ABOUT_PORTRAIT,
  DEFAULT_HERO_PORTRAIT,
  resolvePortrait,
} from "@/lib/portraits";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function getSiteSettings(locale: Locale): Promise<{
  cvUrl: string | null;
  contactInfo: ContactInfo[];
  socialLinks: SocialLink[];
}> {
  const messages = getMessages(locale);

  if (USE_MOCK) {
    const s = MOCK_SETTINGS;
    const contactInfo: ContactInfo[] = [
      { id: "email", label: messages["contact.email"], value: s.email ?? "", href: `mailto:${s.email ?? ""}`, icon: Mail },
      { id: "phone", label: messages["contact.phone"], value: s.phone ?? "", href: `tel:${(s.phone ?? "").replace(/\s/g, "")}`, icon: Phone },
      { id: "location", label: messages["contact.location"], value: s.location ?? "", href: s.locationMapUrl ?? "#", icon: MapPin },
    ].filter((item) => item.value);

    const socialLinks: SocialLink[] = [
      { id: "github", label: "GitHub", href: s.githubUrl ?? "#", icon: FaGithub },
      { id: "linkedin", label: "LinkedIn", href: s.linkedinUrl ?? "#", icon: FaLinkedinIn },
      { id: "instagram", label: "Instagram", href: s.instagramUrl ?? "#", icon: FaInstagram },
    ].filter((item) => item.href && item.href !== "#");

    return { cvUrl: s.cvUrl ?? null, contactInfo, socialLinks };
  }

  let settings: SanitySettings | null = null;
  try {
    settings = await client.fetch<SanitySettings | null>(siteSettingsQuery, {}, {
      next: { tags: ["sanity", "settings"] },
    });
  } catch (error) {
    console.warn("Failed to fetch site settings from Sanity:", error);
  }

  const cvUrl = settings?.cvUrl ?? null;

  const contactInfo: ContactInfo[] = [
    {
      id: "email",
      label: messages["contact.email"],
      value: settings?.email ?? "",
      href: `mailto:${settings?.email ?? ""}`,
      icon: Mail,
    },
    {
      id: "phone",
      label: messages["contact.phone"],
      value: settings?.phone ?? "",
      href: `tel:${(settings?.phone ?? "").replace(/\s/g, "")}`,
      icon: Phone,
    },
    {
      id: "location",
      label: messages["contact.location"],
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

  return { cvUrl, contactInfo, socialLinks };
}

const EMPTY_RESOLVED_SETTINGS: ResolvedSettings = {
  roles: [],
  heroPortrait: DEFAULT_HERO_PORTRAIT,
  aboutPortrait: DEFAULT_ABOUT_PORTRAIT,
  scrollSequenceFrames: [],
};

export async function getResolvedSettings(locale: Locale): Promise<ResolvedSettings> {
  if (USE_MOCK) return MOCK_SETTINGS;
  try {
    const settings = await client.fetch<SanitySettings | null>(siteSettingsQuery, {}, {
      next: { tags: ["sanity", "settings"] },
    });
    if (!settings) return EMPTY_RESOLVED_SETTINGS;
    return {
      ...settings,
      roles: (settings.roles ?? [])
        .map((role) => pickLocalized(role, locale))
        .filter((role) => role.trim() !== ""),
      bio: pickLocalized(settings.bio, locale),
      heroPortrait: resolvePortrait(settings.heroPortrait, DEFAULT_HERO_PORTRAIT),
      aboutPortrait: resolvePortrait(settings.aboutPortrait, DEFAULT_ABOUT_PORTRAIT),
      scrollSequenceFrames: (settings.scrollSequenceFrames ?? []).filter(
        (url): url is string => typeof url === "string" && url.trim() !== ""
      ),
    };
  } catch (error) {
    console.warn("Failed to fetch resolved settings from Sanity:", error);
    return EMPTY_RESOLVED_SETTINGS;
  }
}
