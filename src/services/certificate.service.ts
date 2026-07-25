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
    image: raw.image ? urlFor(raw.image).width(800).url() : "",
    credentialUrl: raw.credentialUrl,
  };
}

export async function getAllCertificates(): Promise<Certificate[]> {
  try {
    const data = await client.fetch<SanityCertificate[]>(allCertificatesQuery);
    return data ? data.map(toCertificate) : [];
  } catch (error) {
    console.warn("Failed to fetch certificates from Sanity:", error);
    return [];
  }
}

export async function getFeaturedCertificates(): Promise<Certificate[]> {
  try {
    const data = await client.fetch<SanityCertificate[]>(
      featuredCertificatesQuery
    );
    return data ? data.map(toCertificate) : [];
  } catch (error) {
    console.warn("Failed to fetch featured certificates from Sanity:", error);
    return [];
  }
}
