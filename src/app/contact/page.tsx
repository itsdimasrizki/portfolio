import type { Metadata } from "next";

import { ContactHero } from "@/components/sections/contact/contact-hero";
import { ContactContent } from "@/components/sections/contact/contact-content";

export const metadata: Metadata = {
  title: "Contact | Dimas Rizki",
  description:
    "Get in touch with Dimas Rizki for freelance projects, collaborations, or full-time opportunities.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactContent />
    </main>
  );
}
