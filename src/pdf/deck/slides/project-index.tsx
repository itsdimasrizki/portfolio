import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, PixelRule } from "../primitives";
import { colors, type } from "../theme";
import { truncate, pad2 } from "../layout";
import type { Project } from "@/types/project";

export function ProjectIndexSlide({ projects }: { projects: Project[] }) {
  const rows = projects.slice(0, 6);
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="index — selected work" />
      {rows.map((project, i) => (
        <View key={project.id}>
          <View style={{ flexDirection: "row", alignItems: "center", height: 58 }}>
            <Text style={{ ...type.h1, fontSize: 32, width: 60, color: i % 2 === 0 ? colors.blue : colors.orange }}>
              {pad2(i + 1)}
            </Text>
            <Text style={{ ...type.h2, fontSize: 30, flexGrow: 1, color: colors.ink }}>
              {truncate(project.title, 30)}
            </Text>
            <Text style={{ ...type.small, color: colors.muted, width: 280, textAlign: "right" }}>
              {truncate(project.technologies.join(" · "), 46)}
            </Text>
            <Text style={{ ...type.body, color: colors.ink, width: 56, textAlign: "right" }}>
              {project.year}
            </Text>
          </View>
          {i < rows.length - 1 && <PixelRule width={864} color="#C9C7C0" />}
        </View>
      ))}
    </Slide>
  );
}
