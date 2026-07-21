import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

import { certificates } from "@/constants/certificates";

import { CertificateCard } from "./certificate-card";

export function FeaturedCertificates() {
  return (
    <Section>
      <Container>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Featured Certificates
            </h2>

            <p className="mt-2 text-muted-foreground">
              Professional certifications and continuous learning.
            </p>
          </div>

          <Button asChild variant="ghost">
            <Link href="/certificates">
              View all
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}