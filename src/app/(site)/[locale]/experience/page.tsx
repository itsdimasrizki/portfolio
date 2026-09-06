import type { Metadata } from "next";

import { ExperienceTimeline } from "@/components/sections/experience/experience-timeline";
import { CTA } from "@/components/sections/cta";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import { getAllExperiences } from "@/services/experience.service";
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
    title: messages["meta.experience.title"],
    description: messages["meta.experience.description"],
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const [experiences, { cvUrl }] = await Promise.all([
    getAllExperiences(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <ExperienceTimeline experiences={experiences} locale={typedLocale} />
      <CTA cvUrl={cvUrl} locale={typedLocale} />
    </main>
  );
}
