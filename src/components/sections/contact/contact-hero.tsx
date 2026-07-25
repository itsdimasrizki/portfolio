import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";

export function ContactHero() {
  return (
    <Section className="pb-0">
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            eyebrow="Contact"
            title="Let's build something together."
            description="Have a project in mind or just want to say hello? Send me a message and I'll get back to you as soon as I can."
          />
        </Reveal>
      </Container>
    </Section>
  );
}

