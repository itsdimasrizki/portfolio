"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import type { Certificate } from "@/types/certificate";

import { CertificateGrid } from "./certificate-grid";

const ALL = "All";

type Props = {
  certificates: Certificate[];
};

export function CertificatesList({ certificates }: Props) {
  const [activeIssuer, setActiveIssuer] = useState(ALL);

  const issuers = useMemo(() => {
    const unique = Array.from(new Set(certificates.map((c) => c.issuer)));
    return [ALL, ...unique];
  }, [certificates]);

  const filtered = useMemo(() => {
    if (activeIssuer === ALL) return certificates;
    return certificates.filter((c) => c.issuer === activeIssuer);
  }, [activeIssuer, certificates]);

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            eyebrow="Certificates"
            title="Certifications and continuous learning."
            description="Professional certifications I've earned while growing as a Fullstack Software Engineer."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap justify-center gap-2">
          {issuers.map((issuer) => (
            <Button
              key={issuer}
              size="sm"
              variant={activeIssuer === issuer ? "default" : "outline"}
              onClick={() => setActiveIssuer(issuer)}
            >
              {issuer}
            </Button>
          ))}
        </Reveal>

        <div className="mt-12">
          <CertificateGrid key={activeIssuer} certificates={filtered} />
        </div>
      </Container>
    </Section>
  );
}
