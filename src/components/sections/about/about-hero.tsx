import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <Section>
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Eyebrow */}
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            About Me
          </p>

          {/* Avatar */}
          <div className="mt-8">
            <Image
              src="/images/profile/profile.jpeg"
              alt="Dimas Rizki"
              width={160}
              height={160}
              className="rounded-full border object-cover shadow-sm"
            />
          </div>

          {/* Heading */}
          <h1 className="mt-10 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Building scalable digital products with clean architecture and
            meaningful user experiences.
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            I&apos;m Dimas Rizki, a Fullstack Software Engineer based in Indonesia
            who enjoys building modern web applications with a strong focus on
            performance, scalability, and user experience.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg">
              Download CV
            </Button>

            <Button
              size="lg"
              variant="outline"
            >
              Let&apos;s Connect
            </Button>
          </div>

          {/* Quick Info */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <div className="rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground">
              📍 Indonesia
            </div>

            <div className="rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground">
              💼 Open to Work
            </div>

            <div className="rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground">
              🚀 Fullstack Engineer
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}