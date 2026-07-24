import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { ContactInfo } from "./contact-info";
import { ContactForm } from "./contact-form";

export function ContactContent() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactInfo />
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
