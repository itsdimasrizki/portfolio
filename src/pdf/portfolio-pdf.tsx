import React from "react";
import { Document } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { CoverSlide } from "./deck/slides/cover";
import { ContentsSlide } from "./deck/slides/contents";
import { DividerSlide } from "./deck/slides/divider";
import { BioSlide } from "./deck/slides/bio";
import { NumbersSlide } from "./deck/slides/numbers";
import { StackSlide } from "./deck/slides/stack";
import { ProcessSlide } from "./deck/slides/process";
import { ProjectIndexSlide } from "./deck/slides/project-index";
import { ProjectDetailSlide } from "./deck/slides/project-detail";
import { ProjectGridSlide } from "./deck/slides/project-grid";
import { ExperienceSlide } from "./deck/slides/experience";
import { CertificatesSlide } from "./deck/slides/certificates";
import { ClosingSlide } from "./deck/slides/closing";
import { paginate } from "./deck/layout";

export function PortfolioPdf({ data }: { data: PortfolioPdfData }) {
  const { settings, technologies, skills, profileImage, featuredProjects, projectImages,
    experiences, certificates } = data;
  const name = settings.fullName ?? "Portfolio";
  const techNames = technologies.flatMap((group) => group.items.map((item) => item.name));

  return (
    <Document
      title={`${name} — Portfolio Deck`}
      author={name}
      subject={`${settings.role ?? "Software Engineer"} portfolio deck`}
      creator="Portfolio Deck Generator"
    >
      <CoverSlide settings={settings} technologies={techNames} photo={profileImage} />
      <ContentsSlide
        entries={[
          { label: "profile" }, { label: "work" }, { label: "experience" },
          { label: "credentials" }, { label: "contact" },
        ]}
      />
      <DividerSlide eyebrow="section 01" lines={["the", "profile"]} tone="bone" corner="bl"
        subline="Who is behind the work, and how they think about building it." />
      <BioSlide settings={settings} photo={profileImage} />
      <NumbersSlide
        experiences={experiences}
        featuredProjects={featuredProjects}
        certificates={certificates}
        technologies={technologies}
      />
      {technologies.length > 0 && <StackSlide technologies={technologies} />}
      {paginate(skills, 5, 2).map((page, i) => (
        <ProcessSlide key={`process-${i}`} skills={page} pageIndex={i} />
      ))}
      <DividerSlide eyebrow="section 02" lines={["selected", "work"]} tone="blue" corner="tr"
        subline="What the problem was, what was decided, and what came out of it." />
      {featuredProjects.length > 0 && <ProjectIndexSlide projects={featuredProjects} />}
      {featuredProjects.slice(0, 4).map((project, i) => (
        <ProjectDetailSlide key={project.id} project={project} index={i} image={projectImages[project.id]} />
      ))}
      {featuredProjects.length > 4 && (
        <ProjectGridSlide projects={featuredProjects.slice(4, 6)} images={projectImages} startIndex={4} />
      )}
      <DividerSlide eyebrow="section 03" lines={["where i've", "worked"]} tone="ink" corner="tl"
        subline="Teaching, research labs, student organisations, and industry programmes." />
      {paginate(experiences, 4, 2).map((page, i) => (
        <ExperienceSlide key={`exp-${i}`} experiences={page} pageIndex={i} />
      ))}
      <DividerSlide eyebrow="section 04" lines={["credentials"]} tone="orange" corner="br"
        subline="Scheduled proof of learning — not a substitute for experience." />
      {(() => {
        const pages = paginate(certificates, 6, 2);
        const shown = pages.flat().length;
        const overflow = certificates.length - shown;
        return pages.map((page, i) => (
          <CertificatesSlide
            key={`cert-${i}`}
            certificates={page}
            pageIndex={i}
            overflow={i === pages.length - 1 ? Math.max(0, overflow) : 0}
          />
        ));
      })()}
      <ClosingSlide settings={settings} />
    </Document>
  );
}
