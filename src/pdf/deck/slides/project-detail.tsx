import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { Slide, SlideNumber, ChipRow, Chip, Dither } from "../primitives";
import { colors, type } from "../theme";
import { truncate, scaleTitle, pad2 } from "../layout";
import type { Project } from "@/types/project";

function shortUrl(url: string): string {
  return truncate(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), 30);
}

export function ProjectDetailSlide({
  project, index, image,
}: { project: Project; index: number; image?: string }) {
  const mirrored = index % 2 === 1;
  const meta = [project.categories[0], project.year, project.status]
    .filter(Boolean)
    .join("  ·  ");

  const text = (
    <View style={{ width: 480, paddingHorizontal: 48, paddingVertical: 40, justifyContent: "space-between" }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text style={{ ...type.h1, fontSize: 32, color: colors.blue, marginRight: 12 }}>
            {pad2(index + 1)}
          </Text>
          <Text style={{ ...type.small, color: colors.muted, marginBottom: 6 }}>{meta}</Text>
        </View>
        <View style={{ height: 1.5, backgroundColor: colors.ink, marginTop: 10, marginBottom: 14 }} />
        <Text style={{ ...type.h1Big, fontSize: scaleTitle(project.title), color: colors.ink }}>
          {project.title}
        </Text>
        <Text style={{ ...type.body, color: colors.ink, marginTop: 12 }}>
          {truncate(project.description, 320)}
        </Text>
        <View style={{ marginTop: 16 }}>
          <ChipRow labels={project.technologies} max={8} />
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {project.github && <Chip label={`github ↗ ${shortUrl(project.github)}`} variant="ink" />}
        {project.liveDemo && <Chip label={`live ↗ ${shortUrl(project.liveDemo)}`} variant="outline" />}
      </View>
    </View>
  );

  const media = (
    <View style={{ width: 480, height: 540, backgroundColor: colors.paper }}>
      {image
        ? <Image src={image} style={{ width: 480, height: 540, objectFit: "cover" }} />
        : <Dither width={480} height={540} />}
      {project.status && (
        <View style={{
          // Sudut bawah, bukan atas: nomor slide duduk di kanan atas, dan pada
          // slide tak-bercermin media menempati sisi itu — badge di atas akan
          // menimpanya.
          position: "absolute", bottom: 40,
          left: mirrored ? 40 : undefined, right: mirrored ? undefined : 40,
          backgroundColor: colors.orange, paddingHorizontal: 10, paddingVertical: 6,
        }}>
          <Text style={{ ...type.micro, color: colors.ink }}>{project.status}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Slide tone="bone" padded={false}>
      <View style={{ flexDirection: "row", width: 960, height: 540 }}>
        {mirrored ? media : text}
        {mirrored ? text : media}
      </View>
      <View style={{ position: "absolute", top: 40, right: 48 }}>
        <SlideNumber />
      </View>
    </Slide>
  );
}
