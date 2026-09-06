import { groq } from "next-sanity";

export const pageContentQuery = groq`
  *[_type == "pageContent"][0] {
    heroBadge,
    heroHeadline,
    heroHighlight,
    heroDescription,
    storyEyebrow,
    storyTitle,
    storyParagraphs,
    statLabels
  }
`;
