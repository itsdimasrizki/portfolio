import type { SanityImageSource } from "@sanity/image-url";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  image: string;
  credentialUrl?: string;
}

export interface SanityCertificate {
  _id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  image?: SanityImageSource;
  credentialUrl?: string;
  order?: number;
}
