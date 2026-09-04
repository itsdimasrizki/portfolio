import React from "react";
import { Document } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { CoverSlide } from "./deck/slides/cover";

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
    </Document>
  );
}
