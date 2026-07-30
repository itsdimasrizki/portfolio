import { groq } from "next-sanity";

export const allExperiencesQuery = groq`
  *[_type == "experience"] | order(order desc) {
    _id,
    company,
    position,
    location,
    startDate,
    endDate,
    description,
    "technologies": technologies[]-> {
      _id,
      name,
      category,
      iconName,
      order
    },
    order
  }
`;
