import { groq } from "next-sanity";

export const allSkillsQuery = groq`
  *[_type == "skill"] | order(order asc) {
    _id,
    title,
    description,
    iconName,
    order
  }
`;
