import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
import {
  allCertificatesQuery,
  featuredCertificatesQuery,
} from "@/sanity/queries/certificate.queries";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { Certificate, SanityCertificate } from "@/types/certificate";

function toCertificate(raw: SanityCertificate, locale: Locale): Certificate {
  return {
    id: raw._id,
    title: pickLocalized(raw.title, locale),
    issuer: raw.issuer,
    issuedAt: raw.issuedAt,
    image: raw.thumbnail ? urlFor(raw.thumbnail).width(800).url() : "",
    pdfUrl: raw.pdfFile?.asset?.url,
    credentialUrl: raw.credentialUrl,
  };
}

export async function getAllCertificates(locale: Locale): Promise<Certificate[]> {
  try {
    const data = await client.fetch<SanityCertificate[]>(allCertificatesQuery, {}, {
      next: { tags: ["sanity", "certificate"] },
    });
    return data ? data.map((raw) => toCertificate(raw, locale)) : [];
  } catch (error) {
    console.warn("Failed to fetch certificates from Sanity:", error);
    return [];
  }
}

export async function getFeaturedCertificates(locale: Locale): Promise<Certificate[]> {
  try {
    const data = await client.fetch<(SanityCertificate | null)[]>(
      featuredCertificatesQuery,
      {},
      { next: { tags: ["sanity", "certificate", "siteSettings"] } }
    );
    const validData = data ? data.filter((item): item is SanityCertificate => item !== null) : [];
    if (validData.length > 0) {
      return validData.map((raw) => toCertificate(raw, locale));
    }
    const all = await getAllCertificates(locale);
    return all.slice(0, 3);
  } catch (error) {
    console.warn("Failed to fetch featured certificates from Sanity:", error);
    return [];
  }
}
