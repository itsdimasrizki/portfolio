import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { ContactInfo as ContactInfoType, SocialLink } from "@/types/contact";

import { ContactInfo } from "./contact-info";
import { ContactForm } from "./contact-form";

type Props = {
  contactInfo: ContactInfoType[];
  socialLinks: SocialLink[];
};

export function ContactContent({ contactInfo, socialLinks }: Props) {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ContactInfo contactInfo={contactInfo} socialLinks={socialLinks} />
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
