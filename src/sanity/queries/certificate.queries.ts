import { groq } from "next-sanity";

export const allCertificatesQuery = groq`
  *[_type == "certificate"] | order(order asc) {
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
  *[_type == "certificate"] | order(order asc)[0...3] {
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
