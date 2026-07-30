import type { Metadata } from "next";

import { ExperienceTimeline } from "@/components/sections/experience/experience-timeline";
import { CTA } from "@/components/sections/cta";
import { getAllExperiences } from "@/services/experience.service";
import { getSiteSettings } from "@/services/settings.service";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Experience | Dimas Rizki",
  description:
    "The companies and teams Dimas Rizki has worked with as a Fullstack Software Engineer.",
};

export default async function ExperiencePage() {
  const [experiences, { cvUrl }] = await Promise.all([
    getAllExperiences(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <ExperienceTimeline experiences={experiences} />
      <CTA cvUrl={cvUrl} />
    </main>
  );
}
