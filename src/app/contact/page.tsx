import type { Metadata } from "next";

import { ContactHero } from "@/components/sections/contact/contact-hero";
import { ContactContent } from "@/components/sections/contact/contact-content";
import { getSiteSettings } from "@/services/settings.service";

export const metadata: Metadata = {
  title: "Contact | Dimas Rizki",
  description:
    "Get in touch with Dimas Rizki for freelance projects, collaborations, or full-time opportunities.",
};

export default async function ContactPage() {
  const { contactInfo, socialLinks } = await getSiteSettings();

  return (
    <main>
      <ContactHero />
      <ContactContent contactInfo={contactInfo} socialLinks={socialLinks} />
    </main>
  );
}
