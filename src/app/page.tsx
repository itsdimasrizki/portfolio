import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/projects";
import { ExperiencePreview } from "@/components/sections/experience";
import { FeaturedCertificates } from "@/components/sections/certificates";
import { CTA } from "@/components/sections/cta";

import { getFeaturedProjects } from "@/services/project.service";
import { getAllExperiences } from "@/services/experience.service";
import { getFeaturedCertificates } from "@/services/certificate.service";

export default async function Home() {
  const [featuredProjects, experiences, featuredCertificates] = await Promise.all([
    getFeaturedProjects(),
    getAllExperiences(),
    getFeaturedCertificates(),
  ]);

  return (
    <main>
      <Hero />
      <FeaturedProjects projects={featuredProjects} />
      <ExperiencePreview experiences={experiences} />
      <FeaturedCertificates certificates={featuredCertificates} />
      <CTA />
    </main>
  );
}
