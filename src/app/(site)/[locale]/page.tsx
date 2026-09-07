import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/projects";
import { ExperiencePreview } from "@/components/sections/experience";
import { FeaturedCertificates } from "@/components/sections/certificates";
import { CTA } from "@/components/sections/cta";

import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import { getFeaturedProjects } from "@/services/project.service";
import { getAllExperiences } from "@/services/experience.service";
import { getFeaturedCertificates } from "@/services/certificate.service";
import { getResolvedSettings } from "@/services/settings.service";
import { getPageContent } from "@/services/pageContent.service";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  return {
    title: messages["meta.home.title"],
    description: messages["meta.home.description"],
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const [featuredProjects, experiences, featuredCertificates, settings, content] =
    await Promise.all([
      getFeaturedProjects(typedLocale),
      getAllExperiences(typedLocale),
      getFeaturedCertificates(typedLocale),
      getResolvedSettings(typedLocale),
      getPageContent(typedLocale),
    ]);

  const cvUrl = settings.cvUrl ?? null;

  return (
    <main>
      <Hero
        content={content}
        settings={settings}
        cvUrl={cvUrl}
        locale={typedLocale}
      />
      <FeaturedProjects projects={featuredProjects} locale={typedLocale} />
      <ExperiencePreview experiences={experiences} locale={typedLocale} />
      <FeaturedCertificates
        certificates={featuredCertificates}
        locale={typedLocale}
      />
      <CTA cvUrl={cvUrl} locale={typedLocale} />
    </main>
  );
}
