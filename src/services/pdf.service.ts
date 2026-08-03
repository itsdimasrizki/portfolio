import QRCode from "qrcode";

import { getPdfSettings } from "./settings.service";
import { getAllExperiences } from "./experience.service";
import { getFeaturedProjects } from "./project.service";
import { getAllCertificates } from "./certificate.service";
import { getTechnologies } from "./technology.service";
import { getSkills } from "./skill.service";
import type { PortfolioPdfData } from "@/types/pdf";

async function generateQrCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
      color: { dark: "#1e293b", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
  } catch {
    return "";
  }
}

export async function getPortfolioPdfData(): Promise<PortfolioPdfData> {
  const [settings, experiences, featuredProjects, certificates, technologies, skills] =
    await Promise.all([
      getPdfSettings(),
      getAllExperiences(),
      getFeaturedProjects(),
      getAllCertificates(),
      getTechnologies(),
      getSkills(),
    ]);

  const qrCodeDataUrl = await generateQrCode(
    settings.portfolioUrl ?? "https://dimasrizki.dev"
  );

  return {
    settings,
    experiences,
    featuredProjects,
    certificates,
    technologies,
    skills,
    qrCodeDataUrl,
  };
}
