import React from "react";
import type { ReactElement } from "react";
import { Document } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { paginate, chunkCertificates } from "./deck/layout";
import { CoverSlide } from "./deck/slides/cover";
import { ContentsSlide } from "./deck/slides/contents";
import { DividerSlide } from "./deck/slides/divider";
import { BioSlide } from "./deck/slides/bio";
import { NumbersSlide } from "./deck/slides/numbers";
import { StackSlide } from "./deck/slides/stack";
import { ProcessSlide } from "./deck/slides/process";
import { ProjectIndexSlide } from "./deck/slides/project-index";
import { ProjectDetailSlide } from "./deck/slides/project-detail";
import { ExperienceSlide } from "./deck/slides/experience";
import { CertificatesSlide } from "./deck/slides/certificates";
import { ContactSlide } from "./deck/slides/contact";
import { ClosingSlide } from "./deck/slides/closing";

const SECTIONS = ["profile", "work", "experience", "credentials", "contact"] as const;
type Section = (typeof SECTIONS)[number];
type Entry = { section?: Section; node: ReactElement };

export function PortfolioPdf({ data }: { data: PortfolioPdfData }) {
  const {
    settings,
    intro,
    experiences,
    projects,
    certificates,
    technologies,
    skills,
    qrCodeDataUrl,
    profileImage,
    aboutImage,
    projectImages,
    certificateImages,
  } = data;

  const name = settings.fullName ?? "Portfolio";
  const techNames = technologies.flatMap((group) => group.items.map((item) => item.name));
  const rest: Entry[] = [];

  rest.push({
    section: "profile",
    node: (
      <DividerSlide
        key="d-profile"
        eyebrow="section 01"
        lines={["the", "profile."]}
        tone="obsidian"
        corner="bl"
        subline="Who is behind the work, and how they think about building it."
      />
    ),
  });
  rest.push({
    node: <BioSlide key="bio" settings={settings} photo={aboutImage ?? profileImage} />,
  });
  rest.push({
    node: (
      <NumbersSlide
        key="numbers"
        experiences={experiences}
        projects={projects}
        certificates={certificates}
        technologies={technologies}
      />
    ),
  });
  if (technologies.length > 0) {
    rest.push({ node: <StackSlide key="stack" technologies={technologies} /> });
  }
  paginate(skills, 5, 10).forEach((page, i) => {
    rest.push({ node: <ProcessSlide key={`process-${i}`} skills={page} pageIndex={i} /> });
  });

  if (projects.length > 0) {
    rest.push({
      section: "work",
      node: (
        <DividerSlide
          key="d-work"
          eyebrow="section 02"
          lines={["selected", "work."]}
          tone="elevated"
          corner="tr"
          subline="All projects — problem context, architecture decisions, and live outcomes."
        />
      ),
    });
    paginate(projects, 6, 10).forEach((page, i) => {
      rest.push({
        node: (
          <ProjectIndexSlide
            key={`p-index-${i}`}
            projects={page}
            startIndex={i * 6}
            pageIndex={i}
          />
        ),
      });
    });
    projects.forEach((project, i) => {
      rest.push({
        node: (
          <ProjectDetailSlide
            key={project.id}
            project={project}
            index={i}
            total={projects.length}
            image={projectImages[project.id]}
          />
        ),
      });
    });
  }

  if (experiences.length > 0) {
    rest.push({
      section: "experience",
      node: (
        <DividerSlide
          key="d-exp"
          eyebrow="section 03"
          lines={["where i've", "worked."]}
          tone="elevated"
          corner="tl"
          subline="Teaching, research labs, student organisations, and industry programmes."
        />
      ),
    });
    paginate(experiences, 3, 20).forEach((page, i) => {
      rest.push({ node: <ExperienceSlide key={`exp-${i}`} experiences={page} pageIndex={i} /> });
    });
  }

  if (certificates.length > 0) {
    rest.push({
      section: "credentials",
      node: (
        <DividerSlide
          key="d-cred"
          eyebrow="section 04"
          lines={["credentials."]}
          tone="subtle"
          corner="br"
          subline="Verified certifications and technical training across cloud, AI, and engineering."
        />
      ),
    });
    const certPages = chunkCertificates(certificates);
    certPages.forEach((page, i) => {
      rest.push({
        node: (
          <CertificatesSlide
            key={`cert-${i}`}
            certificates={page}
            images={certificateImages}
            pageIndex={i}
            totalPages={certPages.length}
          />
        ),
      });
    });
  }

  rest.push({
    section: "contact",
    node: <ContactSlide key="contact" settings={settings} qrCodeDataUrl={qrCodeDataUrl} />,
  });
  rest.push({ node: <ClosingSlide key="closing" settings={settings} /> });

  // Cover = halaman 1, contents = halaman 2, jadi rest[i] jatuh di halaman i + 3.
  const entries = SECTIONS.map((label) => {
    const at = rest.findIndex((entry) => entry.section === label);
    return { label, page: at === -1 ? undefined : at + 3 };
  });

  return (
    <Document
      title={`${name} — Portfolio Deck`}
      author={name}
      subject={`${settings.roles[0] ?? "Software Engineer"} portfolio deck`}
      keywords="portfolio, deck, fullstack, next.js, react, typescript"
      creator="Portfolio Deck Generator"
    >
      <CoverSlide settings={settings} technologies={techNames} photo={profileImage} intro={intro} />
      <ContentsSlide entries={entries} />
      {rest.map((entry) => entry.node)}
    </Document>
  );
}
