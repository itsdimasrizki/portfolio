import type { Metadata } from "next";

import { ExperienceTimeline } from "@/components/sections/experience/experience-timeline";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Experience | Dimas Rizki",
  description:
    "The companies and teams Dimas Rizki has worked with as a Fullstack Software Engineer.",
};

export default function ExperiencePage() {
  return (
    <main>
      <ExperienceTimeline />
      <CTA />
    </main>
  );
}
