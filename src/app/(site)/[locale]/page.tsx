import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/projects";
import { ExperiencePreview } from "@/components/sections/experience";
import { FeaturedCertificates } from "@/components/sections/certificates";
import { CTA } from "@/components/sections/cta";

import { getFeaturedProjects } from "@/services/project.service";
import { getAllExperiences } from "@/services/experience.service";
import { getFeaturedCertificates } from "@/services/certificate.service";
import { getSiteSettings } from "@/services/settings.service";

export const revalidate = 0;

export default async function Home() {
  const [featuredProjects, experiences, featuredCertificates, { cvUrl }] =
    await Promise.all([
      getFeaturedProjects(),
      getAllExperiences(),
      getFeaturedCertificates(),
      getSiteSettings(),
    ]);

  return (
    <main>
      <Hero cvUrl={cvUrl} />
      <FeaturedProjects projects={featuredProjects} />
      <ExperiencePreview experiences={experiences} />
      <FeaturedCertificates certificates={featuredCertificates} />
      <CTA cvUrl={cvUrl} />
    </main>
  );
}
