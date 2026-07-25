import { groq } from "next-sanity";

export const allExperiencesQuery = groq`
  *[_type == "experience"] | order(order asc) {
    _id,
    company,
    position,
    location,
    startDate,
    endDate,
    description,
    order
  }
`;
