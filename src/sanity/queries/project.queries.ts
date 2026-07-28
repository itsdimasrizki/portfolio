import { groq } from "next-sanity";

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    description,
    image,
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
  *[_type == "project"] | order(order asc)[0...3] {
    _id,
    title,
    description,
    image,
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
