import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function AboutStory() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            My Story
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Building software with purpose, not just features.
          </h2>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
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
    </Section>
  );
}