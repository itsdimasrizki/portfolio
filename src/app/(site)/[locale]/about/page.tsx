import type { Metadata } from "next";

import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";
import { TechStack } from "@/components/sections/about/tech-stack";
import { Skills } from "@/components/sections/about/skills";

import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import { getTechnologies } from "@/services/technology.service";
import { getSkills } from "@/services/skill.service";
import { getSiteSettings } from "@/services/settings.service";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  return {
    title: messages["meta.about.title"],
    description: messages["meta.about.description"],
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const [technologies, skills, { cvUrl }] = await Promise.all([
    getTechnologies(),
    getSkills(typedLocale),
    getSiteSettings(typedLocale),
  ]);

  return (
    <main>
      <AboutHero cvUrl={cvUrl} locale={typedLocale} />
      <AboutStory />
      <TechStack technologies={technologies} locale={typedLocale} />
      <Skills skills={skills} locale={typedLocale} />
    </main>
  );
}
