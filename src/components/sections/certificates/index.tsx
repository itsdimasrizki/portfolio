import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import type { Certificate } from "@/types/certificate";

import { CertificateGrid } from "./certificate-grid";

type Props = {
  certificates: Certificate[];
};

export function FeaturedCertificates({ certificates }: Props) {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow="Certificates"
            title="Featured Certificates"
            description="Professional certifications and continuous learning."
            action={
              <Button asChild variant="ghost">
                <Link href="/certificates">View all</Link>
              </Button>
            }
          />
        </Reveal>

        <div className="mt-12">
          <CertificateGrid certificates={certificates} />
        </div>
      </Container>
    </Section>
  );
}
