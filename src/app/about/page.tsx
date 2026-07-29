import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";
import { TechStack } from "@/components/sections/about/tech-stack";
import { Skills } from "@/components/sections/about/skills";

import { getTechnologies } from "@/services/technology.service";
import { getSkills } from "@/services/skill.service";

export const revalidate = 0;

export default async function AboutPage() {
  const [technologies, skills] = await Promise.all([
    getTechnologies(),
    getSkills(),
  ]);

  return (
    <main>
      <AboutHero />
      <AboutStory />
      <TechStack technologies={technologies} />
      <Skills skills={skills} />
    </main>
  );
}
