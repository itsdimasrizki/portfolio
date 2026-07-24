import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CTA() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="rounded-2xl border border-border bg-card px-8 py-16 text-center lg:px-16 transition-all duration-300 hover:border-foreground/20 hover:shadow-xs">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
              Let&apos;s Work Together
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Have an idea worth building?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              I&apos;m currently available for freelance projects, internships,
              and full-time opportunities. Let&apos;s build something meaningful
              together.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <a href="/resume.pdf" download>
                  Download CV
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}