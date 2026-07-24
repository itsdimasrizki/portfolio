import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";
import { TechStack } from "@/components/sections/about/tech-stack";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <TechStack />
    </main>
  );
}