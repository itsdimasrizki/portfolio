import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function ContactHero() {
  return (
    <Section className="pb-0">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Let&apos;s build something together.
          </h1>

          <p className="mt-4 text-muted-foreground">
            Have a project in mind or just want to say hello? Send me a message
            and I&apos;ll get back to you as soon as I can.
          </p>
        </div>
      </Container>
    </Section>
  );
}
