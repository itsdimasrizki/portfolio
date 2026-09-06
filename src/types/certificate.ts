import type { SanityImageSource } from "@sanity/image-url";

import type { Localized } from "@/i18n/locale";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  image: string;
  pdfUrl?: string;
  credentialUrl?: string;
}

export interface SanityCertificate {
  _id: string;
  title: Localized | string;
  issuer: string;
  issuedAt: string;
  thumbnail?: SanityImageSource;
  pdfFile?: {
    asset: {
      url: string;
    };
  };
  credentialUrl?: string;
  order?: number;
}
