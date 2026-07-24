import { Container } from "@/components/layout/container";

export function TechStack() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-5xl">
          <p className="text-primary text-sm font-medium uppercase tracking-[0.2em]">
            Tech Stack
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            The technologies I use every day.
          </h2>

          <p className="text-muted-foreground mt-4 max-w-2xl">
            A curated set of tools and technologies I use to build modern,
            scalable, and maintainable applications.
          </p>
        </div>
      </Container>
    </section>
  );
}