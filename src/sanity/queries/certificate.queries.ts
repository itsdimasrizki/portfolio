import { groq } from "next-sanity";

export const allCertificatesQuery = groq`
  *[_type == "certificate"] | order(order asc) {
    _id,
    title,
    issuer,
    issuedAt,
    image,
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
    image,
    credentialUrl,
    order
  }
`;
