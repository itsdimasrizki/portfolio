import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/projects";
import { ExperiencePreview } from "@/components/sections/experience";
import { FeaturedCertificates } from "@/components/sections/certificates";
import { CTA } from "@/components/sections/cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <ExperiencePreview />
      <FeaturedCertificates />
      <CTA />
    </main>
  );
}