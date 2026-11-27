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
  projects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
}): Stat[] {
  const { experiences, projects, certificates, technologies } = input;
  const toolCount = technologies.reduce((sum, group) => sum + group.items.length, 0);

  const lead: Stat = experiences.length
    ? {
        value: String(yearsSince(experiences.map((e) => e.startDate))),
        label: "years building for the web",
      }
    : {
        value: String(new Set(projects.flatMap((p) => p.categories)).size),
        label: "domains worked in",
      };

  return [
    lead,
    { value: String(projects.length), label: "projects shipped" },
    { value: String(certificates.length), label: "certifications earned" },
    { value: String(toolCount), label: "tools in daily rotation" },
  ];
}

export function NumbersSlide(props: {
  experiences: Experience[];
  projects: Project[];
  certificates: Certificate[];
  technologies: TechnologyGroup[];
}) {
  const [lead, second, third, fourth] = buildStats(props);
  return (
    <Slide tone="obsidian">
      <SlideHeader eyebrow="by the numbers" />
      <View style={{ flexDirection: "row" }}>
        <StatCard
          value={lead.value}
          label={lead.label}
          tone="card"
          width={400}
          height={360}
          size="stat"
          valueColor={colors.accent}
          accentBorder
        />
        <View style={{ width: 440, marginLeft: 24 }}>
          <View style={{ flexDirection: "row" }}>
            <StatCard
              value={second.value}
              label={second.label}
              tone="elevated"
              width={208}
              height={168}
              valueColor={colors.fg}
            />
            <View style={{ width: 24 }} />
            <StatCard
              value={third.value}
              label={third.label}
              tone="elevated"
              width={208}
              height={168}
              valueColor={colors.accentSecondary}
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <StatCard
              value={fourth.value}
              label={fourth.label}
              tone="subtle"
              width={440}
              height={168}
              valueColor={colors.fg}
            />
          </View>
        </View>
      </View>
    </Slide>
  );
}
