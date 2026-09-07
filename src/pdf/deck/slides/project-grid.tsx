import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { Slide, SlideHeader, Dither } from "../primitives";
import { colors, type } from "../theme";
import { truncate, pad2, stagger } from "../layout";
import type { Project } from "@/types/project";

export function ProjectGridSlide({
  projects, images, startIndex,
}: { projects: Project[]; images: Record<string, string | undefined>; startIndex: number }) {
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="more work" />
      <View style={{ flexDirection: "row" }}>
        {projects.slice(0, 3).map((project, i) => {
          const image = images[project.id];
          return (
            <View
              key={project.id}
              style={{
                width: 272, marginRight: i < 2 ? 24 : 0,
                marginTop: Math.max(0, stagger(i)),
                backgroundColor: colors.paper, padding: 16,
              }}
            >
              <View style={{ width: 240, height: 132, overflow: "hidden", backgroundColor: colors.bone }}>
                {image
                  ? <Image src={image} style={{ width: 240, height: 132, objectFit: "cover" }} />
                  : <Dither width={240} height={132} />}
              </View>
              <Text style={{ ...type.h1, fontSize: 28, color: colors.blue, marginTop: 14 }}>
                {pad2(startIndex + i + 1)}
              </Text>
              <Text style={{ ...type.h3, color: colors.ink, marginTop: 4 }}>
                {truncate(project.title, 26)}
              </Text>
              <Text style={{ ...type.small, color: colors.ink, marginTop: 8 }}>
                {truncate(project.description, 130)}
              </Text>
              <Text style={{ ...type.micro, color: colors.muted, marginTop: 12 }}>
                {truncate(project.technologies.join(" · "), 32)} — {project.year}
              </Text>
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
