import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, HairlineRule } from "../primitives";
import { colors, type } from "../theme";
import { truncate, pad2 } from "../layout";
import type { Project } from "@/types/project";

export function ProjectIndexSlide({
  projects,
  startIndex = 0,
  pageIndex = 0,
}: {
  projects: Project[];
  startIndex?: number;
  pageIndex?: number;
}) {
  return (
    <Slide tone="obsidian">
      <SlideHeader eyebrow={pageIndex === 0 ? "index — all projects" : "index — all projects (cont.)"} />
      <View
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: 22,
          paddingVertical: 10,
        }}
      >
        {projects.map((project, i) => (
          <View key={project.id}>
            <View style={{ flexDirection: "row", alignItems: "center", height: 56 }}>
              <Text
                style={{
                  ...type.h2,
                  fontSize: 22,
                  width: 48,
                  color: i % 2 === 0 ? colors.accent : colors.accentSecondary,
                }}
              >
                {pad2(startIndex + i + 1)}
              </Text>
              <Text style={{ ...type.h3, fontSize: 18, flexGrow: 1, color: colors.fg }}>
                {truncate(project.title, 34)}
              </Text>
              <Text style={{ ...type.small, color: colors.fgSecondary, width: 270, textAlign: "right" }}>
                {truncate(project.technologies.join(" · "), 44)}
              </Text>
              <Text style={{ ...type.small, fontWeight: 500, color: colors.fgMuted, width: 54, textAlign: "right" }}>
                {project.year}
              </Text>
            </View>
            {i < projects.length - 1 && <HairlineRule color={colors.border} />}
          </View>
        ))}
      </View>
    </Slide>
  );
}
