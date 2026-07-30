import { groq } from "next-sanity";

export const allCertificatesQuery = groq`
  *[_type == "certificate"] | order(order desc) {
    _id,
    title,
    issuer,
    issuedAt,
    thumbnail,
    "pdfFile": pdfFile {
      asset-> {
        url
      }
    },
    credentialUrl,
    order
  }
`;

export const featuredCertificatesQuery = groq`
  *[_type == "siteSettings"][0].featuredCertificates[]-> {
    _id,
    title,
    issuer,
    issuedAt,
    thumbnail,
    "pdfFile": pdfFile {
      asset-> {
        url
      }
    },
    credentialUrl,
    order
  }
`;
