import QRCode from "qrcode";
import { promises as fs } from "node:fs";
import path from "node:path";

import { getResolvedSettings } from "./settings.service";
import { getAllExperiences } from "./experience.service";
import { getFeaturedProjects } from "./project.service";
import { getAllCertificates } from "./certificate.service";
import { getTechnologies } from "./technology.service";
import { getSkills } from "./skill.service";
import type { Locale } from "@/i18n/locale";
import type { PortfolioPdfData } from "@/types/pdf";

const IMAGE_TIMEOUT_MS = 6000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

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

async function fetchAsDataUrl(url?: string): Promise<string | undefined> {
  if (!url) return undefined;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error(`not an image (${contentType})`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error(`too large (${buffer.byteLength}b)`);
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.warn("[deck] skipping image", url, error instanceof Error ? error.message : error);
    return undefined;
  }
}

async function readProfileImage(): Promise<string | undefined> {
  try {
    const file = path.join(process.cwd(), "public", "images", "profile", "profile.jpeg");
    const buffer = await fs.readFile(file);
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.warn("[deck] profile image unavailable:", error instanceof Error ? error.message : error);
    return undefined;
  }
}

export async function getPortfolioPdfData(
  locale: Locale
): Promise<PortfolioPdfData> {
  const [settings, experiences, featuredProjects, certificates, technologies, skills] =
    await Promise.all([
      getResolvedSettings(locale),
      getAllExperiences(locale),
      getFeaturedProjects(locale),
      getAllCertificates(locale),
      getTechnologies(),
      getSkills(locale),
    ]);

  const qrCodeDataUrl = await generateQrCode(
    settings.portfolioUrl ?? "https://dimasrizki.dev"
  );

  const [profileImage, projectImageEntries] = await Promise.all([
    readProfileImage(),
    Promise.all(
      featuredProjects.map(async (project) =>
        [project.id, await fetchAsDataUrl(project.images?.[0])] as const
      )
    ),
  ]);
  const projectImages = Object.fromEntries(projectImageEntries);

  return {
    settings,
    experiences,
    featuredProjects,
    certificates,
    technologies,
    skills,
    qrCodeDataUrl,
    profileImage,
    projectImages,
  };
}
