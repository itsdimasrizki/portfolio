import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
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
