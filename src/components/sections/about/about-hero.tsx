import { Container } from "@/components/layout/container";

export function AboutHero() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
           <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              About Me
        </p>

          {/* Avatar */}
          <div>Avatar</div>

          {/* Heading */}
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.04em] leading-tight md:text-6xl">
            Building scalable digital products with clean architecture and
            meaningful user experiences.
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            I'm Dimas Rizki, a Fullstack Software Engineer based in Indonesia
            who enjoys building modern web applications with a strong focus on
            performance, scalability, and user experience.
          </p>

          {/* CTA */}
          <div className="mt-10 flex gap-4">
            <button>Download CV</button>
            <button>Contact Me</button>
          </div>

          {/* Quick Info */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border px-4 py-2">
                <span>📍 Indonesia</span>
                <span>💼 Open to Work</span>
                <span>🚀 Fullstack Engineer</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}