import type { Metadata } from "next";

import { ContactHero } from "@/components/sections/contact/contact-hero";
import { ContactContent } from "@/components/sections/contact/contact-content";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
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
    title: messages["meta.contact.title"],
    description: messages["meta.contact.description"],
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const { contactInfo, socialLinks } = await getSiteSettings();

  return (
    <main>
      <ContactHero locale={typedLocale} />
      <ContactContent
        contactInfo={contactInfo}
        socialLinks={socialLinks}
        locale={typedLocale}
      />
    </main>
  );
}
