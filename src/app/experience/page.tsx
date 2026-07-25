import type { Metadata } from "next";

import { ExperienceTimeline } from "@/components/sections/experience/experience-timeline";
import { CTA } from "@/components/sections/cta";
import { getAllExperiences } from "@/services/experience.service";

export const metadata: Metadata = {
  title: "Experience | Dimas Rizki",
  description:
    "The companies and teams Dimas Rizki has worked with as a Fullstack Software Engineer.",
};

export default async function ExperiencePage() {
  const experiences = await getAllExperiences();

  return (
    <main>
      <ExperienceTimeline experiences={experiences} />
      <CTA />
    </main>
  );
}
