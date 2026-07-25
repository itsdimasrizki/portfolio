import { groq } from "next-sanity";

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    description,
    image,
    year,
    category,
    technologies,
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
    technologies,
    status,
    github,
    liveDemo,
    order
  }
`;
