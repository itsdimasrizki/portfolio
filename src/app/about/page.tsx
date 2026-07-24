import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";
import { TechStack } from "@/components/sections/about/tech-stack";
import { Skills } from "@/components/sections/about/skills";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <TechStack />
      <Skills />
    </main>
  );
}