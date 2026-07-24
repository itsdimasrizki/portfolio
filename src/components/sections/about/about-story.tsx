import { Container } from "@/components/layout/container";

export function AboutStory() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-primary text-sm font-medium uppercase tracking-[0.2em]">
            My Story
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Building software with purpose, not just features.
          </h2>

          <div className="text-muted-foreground mt-10 space-y-6 text-lg leading-8">
            <p>
              Write your journey here...
            </p>

            <p>
              Explain how you started programming, what motivates you, and
              what kind of engineer you aim to become.
            </p>

            <p>
              Keep it authentic. Recruiters can tell the difference between
              a genuine story and AI-generated buzzwords.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}