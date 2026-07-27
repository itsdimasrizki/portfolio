import { client } from "@/sanity/client";
import { allTechnologiesQuery } from "@/sanity/queries/technology.queries";
import type { SanityTechnology, TechnologyGroup } from "@/types/technology";

const CATEGORY_ORDER = ["Frontend", "Backend", "Database", "Tools"];

export async function getTechnologies(): Promise<TechnologyGroup[]> {
  try {
    const data = await client.fetch<SanityTechnology[]>(allTechnologiesQuery);

    if (!data || !Array.isArray(data)) return [];

    const grouped = data.reduce<Record<string, TechnologyGroup>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { title: item.category, items: [] };
      }

      acc[item.category].items.push({ name: item.name, iconName: item.iconName });

      return acc;
    }, {});

    return CATEGORY_ORDER.filter((cat) => grouped[cat]).map(
      (cat) => grouped[cat]
    );
  } catch (error) {
    console.warn("Failed to fetch technologies from Sanity:", error);
    return [];
  }
}
