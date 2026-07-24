import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <Section>
      <Container>
        <div className="rounded-3xl border bg-background px-8 py-16 text-center lg:px-16">
          <span className="text-sm font-medium text-teal-700">
            Let&apos;s Work Together
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Have an idea worth building?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
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
              <Link href="/resume.pdf">
                Download CV
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}