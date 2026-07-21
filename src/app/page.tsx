import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero/";
import { FeaturedProjects } from "@/components/sections/projects";
import { ExperiencePreview } from "@/components/sections/experience";

export default function Home() {
  return (
    <>
    <Navbar />

    <main>
      <Hero />
      <FeaturedProjects />
      <ExperiencePreview />

      <Section>
        <Container>
          <h1 className="text-5xl font-bold">
            Hello, I'm Your Name
          </h1>

          <p className="mt-4 max-w-xl text-muted-foreground">
            Full Stack Developer crafting modern web experiences.
          </p>
        </Container>
      </Section>
    </main>
    </>
  );
}
