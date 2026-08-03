import React from "react";
import { Document } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";

import { CoverPage } from "./pages/cover-page";
import { AboutPage } from "./pages/about-page";
import { ExperiencePage } from "./pages/experience-page";
import { ProjectsPage } from "./pages/projects-page";
import { CertificatesPage } from "./pages/certificates-page";
import { TechnologiesPage } from "./pages/technologies-page";
import { SkillsPage } from "./pages/skills-page";
import { ContactPage } from "./pages/contact-page";

type PortfolioPdfProps = {
  data: PortfolioPdfData;
};

export function PortfolioPdf({ data }: PortfolioPdfProps) {
  const { settings, experiences, featuredProjects, certificates, technologies, skills, qrCodeDataUrl } = data;

  return (
    <Document
      title={`${settings.fullName ?? "Portfolio"} — Portfolio`}
      author={settings.fullName ?? "Portfolio"}
      subject={`${settings.role ?? "Software Engineer"} Portfolio`}
      keywords="Fullstack, Next.js, React, Laravel, TypeScript, Portfolio"
      creator="Portfolio PDF Generator"
      producer="@react-pdf/renderer"
    >
      {/* 1. Cover */}
      <CoverPage settings={settings} />

      {/* 2. About */}
      <AboutPage settings={settings} />

      {/* 3. Experience */}
      {experiences.length > 0 && (
        <ExperiencePage experiences={experiences} settings={settings} />
      )}

      {/* 4. Featured Projects */}
      {featuredProjects.length > 0 && (
        <ProjectsPage projects={featuredProjects} settings={settings} />
      )}

      {/* 5. Certificates */}
      {certificates.length > 0 && (
        <CertificatesPage certificates={certificates} settings={settings} />
      )}

      {/* 6. Technologies */}
      {technologies.length > 0 && (
        <TechnologiesPage technologies={technologies} settings={settings} />
      )}

      {/* 7. Skills */}
      {skills.length > 0 && (
        <SkillsPage skills={skills} settings={settings} />
      )}

      {/* 8. Contact + QR Code */}
      <ContactPage settings={settings} qrCodeDataUrl={qrCodeDataUrl} />
    </Document>
  );
}
