import React from "react";
import { Document } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { CoverSlide } from "./deck/slides/cover";
import { ContentsSlide } from "./deck/slides/contents";
import { DividerSlide } from "./deck/slides/divider";
import { ClosingSlide } from "./deck/slides/closing";

export function PortfolioPdf({ data }: { data: PortfolioPdfData }) {
  const { settings, technologies } = data;
  const name = settings.fullName ?? "Portfolio";
  const techNames = technologies.flatMap((group) => group.items.map((item) => item.name));

  return (
    <Document
      title={`${name} — Portfolio Deck`}
      author={name}
      subject={`${settings.role ?? "Software Engineer"} portfolio deck`}
      creator="Portfolio Deck Generator"
    >
      <CoverSlide settings={settings} technologies={techNames} />
      <ContentsSlide
        entries={[
          { label: "profile" }, { label: "work" }, { label: "experience" },
          { label: "credentials" }, { label: "contact" },
        ]}
      />
      <DividerSlide eyebrow="section 01" lines={["the", "profile"]} tone="bone" corner="bl"
        subline="Who is behind the work, and how they think about building it." />
      <DividerSlide eyebrow="section 02" lines={["selected", "work"]} tone="blue" corner="tr"
        subline="What the problem was, what was decided, and what came out of it." />
      <DividerSlide eyebrow="section 03" lines={["where i've", "worked"]} tone="ink" corner="tl"
        subline="Teaching, research labs, student organisations, and industry programmes." />
      <DividerSlide eyebrow="section 04" lines={["credentials"]} tone="orange" corner="br"
        subline="Scheduled proof of learning — not a substitute for experience." />
      <ClosingSlide settings={data.settings} />
    </Document>
  );
}
