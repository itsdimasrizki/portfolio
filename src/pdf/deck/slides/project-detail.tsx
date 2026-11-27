/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { Slide, SlideHeader, Chip, ChipRow } from "../primitives";
import { colors, type } from "../theme";
import { truncate, pad2 } from "../layout";
import type { Project } from "@/types/project";

function shortUrl(url: string): string {
  return truncate(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), 26);
}

function titleFontSize(title: string): number {
  if (title.length > 36) return 24;
  if (title.length > 24) return 28;
  return 32;
}

function getStatusBadge(project: Project): {
  label: string;
  bg: string;
  fg: string;
  border: string;
} {
  if (project.status === "ongoing") {
    return {
      label: "WIP",
      bg: colors.accentSoft,
      fg: colors.accent,
      border: colors.accentBorder,
    };
  }
  if (project.liveDemo) {
    return {
      label: "LIVE",
      bg: colors.accentSoft,
      fg: colors.accent,
      border: colors.accentBorder,
    };
  }
  return {
    label: project.status ? project.status.toUpperCase() : "PROJECT",
    bg: colors.secondary,
    fg: colors.fgSecondary,
    border: colors.borderContrast,
  };
}

export function ProjectDetailSlide({
  project,
  index,
  total,
  image,
}: {
  project: Project;
  index: number;
  total: number;
  image?: string;
}) {
  const status = getStatusBadge(project);
  const hasLiveDemo = Boolean(
    project.liveDemo && project.liveDemo.trim() !== "" && project.liveDemo !== "#"
  );
  const hasGitHub = Boolean(
    project.github && project.github.trim() !== "" && project.github !== "#"
  );

  return (
    <Slide tone="obsidian">
      <SlideHeader eyebrow={`selected work — project ${pad2(index + 1)} / ${pad2(total)}`} />

      {/* Outer card matching web ProjectSlider */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 26,
          height: 404,
        }}
      >
        {/* Left: Meta, Title, Description, Tech Chips, Actions */}
        <View style={{ width: 404, justifyContent: "space-between", paddingRight: 12 }}>
          <View>
            {/* Status pill + Categories + Year */}
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: status.border,
                  backgroundColor: status.bg,
                  borderRadius: 999,
                  paddingHorizontal: 9,
                  paddingVertical: 3,
                  marginRight: 8,
                }}
              >
                <Text style={{ ...type.micro, fontSize: 7.5, color: status.fg }}>
                  {status.label}
                </Text>
              </View>
              {project.categories.slice(0, 2).map((cat) => (
                <View
                  key={cat}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.secondary,
                    borderRadius: 4,
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    marginRight: 6,
                  }}
                >
                  <Text style={{ ...type.micro, fontSize: 7.5, color: colors.fgSecondary }}>
                    {cat}
                  </Text>
                </View>
              ))}
              {project.year && (
                <Text style={{ ...type.small, color: colors.fgMuted, marginLeft: "auto" }}>
                  {project.year}
                </Text>
              )}
            </View>

            {/* Title */}
            <Text
              style={{
                ...type.h2,
                fontSize: titleFontSize(project.title),
                lineHeight: 1.12,
                color: colors.fg,
              }}
            >
              {project.title}
            </Text>

            {/* Description */}
            <Text style={{ ...type.body, color: colors.fgSecondary, marginTop: 12 }}>
              {truncate(project.description, 320)}
            </Text>

            {/* Tech chips */}
            {project.technologies.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <ChipRow labels={project.technologies} max={8} />
              </View>
            )}
          </View>

          {/* Action buttons matching web ProjectSlider */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {hasLiveDemo && (
              <Link src={project.liveDemo!} style={{ textDecoration: "none" }}>
                <Chip label={`Live Demo · ${shortUrl(project.liveDemo!)}`} variant="solid" />
              </Link>
            )}
            {hasGitHub && (
              <Link src={project.github!} style={{ textDecoration: "none" }}>
                <Chip label={`GitHub · ${shortUrl(project.github!)}`} variant="dark" />
              </Link>
            )}
            {!hasLiveDemo && !hasGitHub && (
              <Chip label="Internal / Research System" variant="outline" />
            )}
          </View>
        </View>

        {/* Right: Image Preview Container */}
        <View
          style={{
            width: 386,
            height: 350,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surfaceSubtle,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {image ? (
            <Image src={image} style={{ width: 386, height: 350, objectFit: "cover" }} />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={{ ...type.display, color: colors.borderContrast }}>
                {project.title.slice(0, 2).toUpperCase()}
              </Text>
              <Text style={{ ...type.micro, color: colors.fgMuted, marginTop: 8 }}>
                [NO VISUAL ARCHIVE]
              </Text>
            </View>
          )}
        </View>
      </View>
    </Slide>
  );
}
