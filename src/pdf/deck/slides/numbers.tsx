import React from "react";
import { View } from "@react-pdf/renderer";
import { Slide, SlideHeader, StatCard } from "../primitives";
import { colors } from "../theme";
import { yearsSince } from "../layout";
import type { Experience } from "@/types/experience";
import type { Project } from "@/types/project";
import type { Certificate } from "@/types/certificate";
import type { TechnologyGroup } from "@/types/technology";

type Stat = { value: string; label: string };

export function buildStats(input: {
  experiences: Experience[];
  featuredProjects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
}): Stat[] {
  const { experiences, featuredProjects, certificates, technologies } = input;
  const toolCount = technologies.reduce((sum, group) => sum + group.items.length, 0);

  const lead: Stat = experiences.length
    ? {
        value: String(yearsSince(experiences.map((e) => e.startDate))),
        label: "years building for the web",
      }
    : {
        value: String(new Set(featuredProjects.flatMap((p) => p.categories)).size),
        label: "domains worked in",
      };

  return [
    lead,
    { value: String(featuredProjects.length), label: "projects shipped" },
    { value: String(certificates.length), label: "certifications earned" },
    { value: String(toolCount), label: "tools in daily rotation" },
  ];
}

export function NumbersSlide(props: {
  experiences: Experience[];
  featuredProjects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
}) {
  const [lead, second, third, fourth] = buildStats(props);
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="by the numbers" />
      <View style={{ flexDirection: "row" }}>
        <StatCard value={lead.value} label={lead.label} tone="blue"
                  width={400} height={360} size="stat" dither />
        <View style={{ width: 440, marginLeft: 24 }}>
          <View style={{ flexDirection: "row" }}>
            <StatCard value={second.value} label={second.label} tone="paper" width={208} height={168} />
            <View style={{ width: 24 }} />
            <StatCard value={third.value} label={third.label} tone="paper"
                      width={208} height={168} valueColor={colors.orange} />
          </View>
          <View style={{ marginTop: 24 }}>
            <StatCard value={fourth.value} label={fourth.label} tone="ink" width={440} height={168} />
          </View>
        </View>
      </View>
    </Slide>
  );
}
