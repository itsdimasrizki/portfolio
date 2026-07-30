import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
import {
  allCertificatesQuery,
  featuredCertificatesQuery,
} from "@/sanity/queries/certificate.queries";
import type { Certificate, SanityCertificate } from "@/types/certificate";

function toCertificate(raw: SanityCertificate): Certificate {
  return {
    id: raw._id,
    title: raw.title,
    issuer: raw.issuer,
    issuedAt: raw.issuedAt,
    image: raw.thumbnail ? urlFor(raw.thumbnail).width(800).url() : "",
    pdfUrl: raw.pdfFile?.asset?.url,
    credentialUrl: raw.credentialUrl,
  };
}

export async function getAllCertificates(): Promise<Certificate[]> {
  try {
    const data = await client.fetch<SanityCertificate[]>(allCertificatesQuery, {}, {
      next: { tags: ["sanity", "certificate"] },
    });
    return data ? data.map(toCertificate) : [];
  } catch (error) {
    console.warn("Failed to fetch certificates from Sanity:", error);
    return [];
  }
}

export async function getFeaturedCertificates(): Promise<Certificate[]> {
  try {
    const data = await client.fetch<(SanityCertificate | null)[]>(
      featuredCertificatesQuery,
      {},
      { next: { tags: ["sanity", "certificate", "siteSettings"] } }
    );
    const validData = data ? data.filter((item): item is SanityCertificate => item !== null) : [];
    if (validData.length > 0) {
      return validData.map(toCertificate);
    }
    const all = await getAllCertificates();
    return all.slice(0, 3);
  } catch (error) {
    console.warn("Failed to fetch featured certificates from Sanity:", error);
    return [];
  }
}
