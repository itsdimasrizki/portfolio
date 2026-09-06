import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";

import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";

type Props = {
  locale: Locale;
};

export function ContactHero({ locale }: Props) {
  const messages = getMessages(locale);

  return (
    <Section className="pb-0">
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            eyebrow={messages["section.contact.eyebrow"]}
            title={messages["section.contact.title"]}
            description={messages["section.contact.description"]}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
