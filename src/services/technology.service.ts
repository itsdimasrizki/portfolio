import { client } from "@/sanity/client";
import { allTechnologiesQuery } from "@/sanity/queries/technology.queries";
import type { SanityTechnology, TechnologyGroup } from "@/types/technology";

const DEFAULT_CATEGORY_ORDER = [
  "Programming Language",
  "Languages",
  "Frontend",
  "Backend",
  "Database",
  "Tools",
];

export async function getTechnologies(): Promise<TechnologyGroup[]> {
  try {
    const data = await client.fetch<SanityTechnology[]>(allTechnologiesQuery, {}, {
      next: { tags: ["sanity", "technology"] },
    });

    if (!data || !Array.isArray(data)) return [];

    const grouped = data.reduce<Record<string, TechnologyGroup>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { title: item.category, items: [] };
      }

      acc[item.category].items.push({ name: item.name, iconName: item.iconName });

      return acc;
    }, {});

    // Sort categories: default categories in order, followed by any custom categories added in Sanity
    const allCategories = Object.keys(grouped);
    const sortedCategories = [
      ...DEFAULT_CATEGORY_ORDER.filter((cat) => allCategories.includes(cat)),
      ...allCategories.filter((cat) => !DEFAULT_CATEGORY_ORDER.includes(cat)),
    ];

    return sortedCategories.map((cat) => grouped[cat]);
  } catch (error) {
    console.warn("Failed to fetch technologies from Sanity:", error);
    return [];
  }
}
