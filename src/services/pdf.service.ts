import QRCode from "qrcode";
import { promises as fs } from "node:fs";
import path from "node:path";

import { getResolvedSettings } from "./settings.service";
import { getPageContent } from "./pageContent.service";
import { getAllExperiences } from "./experience.service";
import { getAllProjects } from "./project.service";
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
      color: { dark: "#090b0e", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
  } catch {
    return "";
  }
}

function normalizeSanityImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "cdn.sanity.io" && parsed.pathname.startsWith("/images/")) {
      // @react-pdf/renderer supports PNG and JPEG natively (not WebP).
      if (!parsed.searchParams.has("fm")) {
        parsed.searchParams.set("fm", "png");
      }
      if (!parsed.searchParams.has("w")) {
        parsed.searchParams.set("w", "1000");
      }
      return parsed.toString();
    }
  } catch {
    // Ignore malformed URL and fall through.
  }
  return url;
}

function supportedMime(contentType: string): "image/png" | "image/jpeg" | null {
  const mime = contentType.split(";")[0]?.trim().toLowerCase();
  if (mime === "image/png") return "image/png";
  if (mime === "image/jpeg" || mime === "image/jpg") return "image/jpeg";
  return null;
}

async function fetchAsDataUrl(url?: string): Promise<string | undefined> {
  if (!url) return undefined;
  const targetUrl = normalizeSanityImageUrl(url);
  try {
    const res = await fetch(targetUrl, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const mime = supportedMime(res.headers.get("content-type") ?? "");
    if (!mime) throw new Error(`unsupported image format (${res.headers.get("content-type")})`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error(`too large (${buffer.byteLength}b)`);
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.warn("[deck] skipping image", targetUrl, error instanceof Error ? error.message : error);
    return undefined;
  }
}

async function readLocalImage(publicRelativePath: string): Promise<string | undefined> {
  try {
    const clean = publicRelativePath.replace(/^\/+/, "");
    const file = path.join(process.cwd(), "public", clean);
    const ext = path.extname(file).toLowerCase();
    const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : null;
    if (!mime) return undefined;
    const buffer = await fs.readFile(file);
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return undefined;
  }
}

async function resolvePortraitDataUrl(
  url?: string,
  fallbackLocalPath?: string
): Promise<string | undefined> {
  if (url) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const remote = await fetchAsDataUrl(url);
      if (remote) return remote;
    } else if (url.startsWith("/")) {
      const local = await readLocalImage(url);
      if (local) return local;
    }
  }
  if (fallbackLocalPath) {
    return readLocalImage(fallbackLocalPath);
  }
  return undefined;
}

export async function getPortfolioPdfData(
  locale: Locale
): Promise<PortfolioPdfData> {
  const [settings, content, experiences, projects, certificates, technologies, skills] =
    await Promise.all([
      getResolvedSettings(locale),
      getPageContent(locale),
      getAllExperiences(locale),
      getAllProjects(locale),
      getAllCertificates(locale),
      getTechnologies(),
      getSkills(locale),
    ]);

  const qrCodeDataUrl = await generateQrCode(
    settings.portfolioUrl ?? "https://dimasrizki.dev"
  );

  const [profileImage, aboutImage, projectImageEntries, certificateImageEntries] =
    await Promise.all([
      resolvePortraitDataUrl(
        settings.heroPortrait?.url,
        "/images/profile/profile.jpeg"
      ),
      resolvePortraitDataUrl(
        settings.aboutPortrait?.url,
        "/images/profile/profile.jpeg"
      ),
      Promise.all(
        projects.map(async (project) =>
          [project.id, await fetchAsDataUrl(project.images?.[0])] as const
        )
      ),
      Promise.all(
        certificates.map(async (certificate) =>
          [certificate.id, await fetchAsDataUrl(certificate.image)] as const
        )
      ),
    ]);

  return {
    settings,
    intro: content.deckIntro,
    experiences,
    projects,
    certificates,
    technologies,
    skills,
    qrCodeDataUrl,
    profileImage,
    aboutImage: aboutImage ?? profileImage,
    projectImages: Object.fromEntries(projectImageEntries),
    certificateImages: Object.fromEntries(certificateImageEntries),
  };
}
