import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "cvUrl": cvFile.asset->url,
    fullName,
    role,
    bio,
    portfolioUrl,
    email,
    phone,
    location,
    locationMapUrl,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    instagramUrl
  }
`;
