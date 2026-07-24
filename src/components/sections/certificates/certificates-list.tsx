"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";

import { certificates } from "@/constants/certificates";

import { CertificateGrid } from "./certificate-grid";

const ALL = "All";

export function CertificatesList() {
  const [activeIssuer, setActiveIssuer] = useState(ALL);

  const issuers = useMemo(() => {
    const unique = Array.from(new Set(certificates.map((c) => c.issuer)));
    return [ALL, ...unique];
  }, []);

  const filtered = useMemo(() => {
    if (activeIssuer === ALL) return certificates;
    return certificates.filter((c) => c.issuer === activeIssuer);
  }, [activeIssuer]);

  return (
    <Section>
      <Container>
        <SectionHeader
          as="h1"
          eyebrow="Certificates"
          title="Certifications and continuous learning."
          description="Professional certifications I've earned while growing as a Fullstack Software Engineer."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
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
        </div>

        <div className="mt-12">
          <CertificateGrid certificates={filtered} />
        </div>
      </Container>
    </Section>
  );
}
