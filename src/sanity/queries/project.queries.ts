import { groq } from "next-sanity";

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order desc) {
    _id,
    title,
    description,
    "images": images[].asset->url,
    year,
    category,
    "technologies": technologies[]-> {
      _id,
      name,
      category,
      iconName,
      order
    },
    status,
    github,
    liveDemo,
    order
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "siteSettings"][0].featuredProjects[]-> {
    _id,
    title,
    description,
    "images": images[].asset->url,
    year,
    category,
    "technologies": technologies[]-> {
      _id,
      name,
      category,
      iconName,
      order
    },
    status,
    github,
    liveDemo,
    order
  }
`;
