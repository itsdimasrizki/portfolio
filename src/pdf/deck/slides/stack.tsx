import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, BigType, ChipRow, PixelBar } from "../primitives";
import { colors, type } from "../theme";
import { truncate } from "../layout";
import type { TechnologyGroup } from "@/types/technology";

const OFFSETS = [0, 10, 0, 10, 0];

export function StackSlide({ technologies }: { technologies: TechnologyGroup[] }) {
  const names = technologies.flatMap((group) => group.items.map((item) => item.name));
  const groups = [...technologies].sort((a, b) => b.items.length - a.items.length).slice(0, 5);
  const max = Math.max(1, ...groups.map((group) => group.items.length));

  return (
    <Slide tone="obsidian">
      <SlideHeader eyebrow="02 — tools" />
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 440, marginRight: 24 }}>
          <BigType
            size="h1"
            lines={["the tools", "i reach for"]}
            color={colors.fg}
            accentColor={colors.accent}
            accentLast
          />
          <View style={{ marginTop: 20 }}>
            <ChipRow labels={names} max={24} accentFirst />
          </View>
          <Text style={{ ...type.micro, color: colors.fgMuted, marginTop: 12 }}>
            bar length = tools per group, not proficiency
          </Text>
        </View>

        <View style={{ width: 400 }}>
          {groups.map((group, i) => (
            <View
              key={group.title}
              style={{
                width: 390,
                marginLeft: OFFSETS[i],
                marginBottom: 10,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ ...type.h3, color: colors.fg }}>{truncate(group.title, 26)}</Text>
                <Text style={{ ...type.micro, color: colors.fgMuted }}>
                  {group.items.length} tools
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <PixelBar
                  value={group.items.length / max}
                  width={360}
                  fill={i % 2 === 0 ? colors.accent : colors.accentSecondary}
                  empty={colors.border}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </Slide>
  );
}
