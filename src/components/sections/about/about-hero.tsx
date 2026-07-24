import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Eyebrow */}
          <p className="text-primary text-sm font-medium uppercase tracking-[0.2em]">
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
          <h1 className="mt-10 text-5xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
            Building scalable digital products with clean architecture and
            meaningful user experiences.
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
            I'm Dimas Rizki, a Fullstack Software Engineer based in Indonesia
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
              Let's Connect
            </Button>
          </div>

          {/* Quick Info */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <div className="rounded-full border px-4 py-2 text-sm">
              📍 Indonesia
            </div>

            <div className="rounded-full border px-4 py-2 text-sm">
              💼 Open to Work
            </div>

            <div className="rounded-full border px-4 py-2 text-sm">
              🚀 Fullstack Engineer
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}