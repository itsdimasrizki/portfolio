import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroContent } from "./hero-content";
import { HeroImage } from "./hero-image";

type HeroProps = {
  cvUrl?: string | null;
};

export function Hero({ cvUrl }: HeroProps) {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <HeroContent cvUrl={cvUrl} />
          <HeroImage />
        </div>
      </Container>
    </Section>
  );
}