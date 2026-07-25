import { groq } from "next-sanity";

export const allTechnologiesQuery = groq`
  *[_type == "technology"] | order(order asc) {
    _id,
    name,
    category,
    iconName,
    order
  }
`;
