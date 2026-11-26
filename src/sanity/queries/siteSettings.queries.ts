import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "cvUrl": cvFile.asset->url,
    fullName,
    roles,
    bio,
    portfolioUrl,
    email,
    phone,
    location,
    locationMapUrl,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    instagramUrl,
    "heroPortrait": heroPortrait.asset->{
      url,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height
    },
    "aboutPortrait": aboutPortrait.asset->{
      url,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height
    },
    "scrollSequenceFrames": scrollSequenceFrames[].asset->url
  }
`;
