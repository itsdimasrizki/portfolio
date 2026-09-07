import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { PageContent } from "@/types/pageContent";

export function AboutStory({ content }: { content: PageContent }) {
  return (
    <Section>
      <Container>
        <Reveal className="mx-auto max-w-3xl">
          {content.storyEyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
              {content.storyEyebrow}
            </p>
          )}

          {content.storyTitle && (
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              {content.storyTitle}
            </h2>
          )}

          <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
            {content.storyParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
