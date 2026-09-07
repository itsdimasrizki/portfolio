import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, BigType, ChipRow, PixelBar } from "../primitives";
import { colors, type } from "../theme";
import { truncate } from "../layout";
import type { TechnologyGroup } from "@/types/technology";

const OFFSETS = [0, 12, 0, 10, 0];

export function StackSlide({ technologies }: { technologies: TechnologyGroup[] }) {
  const names = technologies.flatMap((group) => group.items.map((item) => item.name));
  const groups = [...technologies].sort((a, b) => b.items.length - a.items.length).slice(0, 5);
  const max = Math.max(1, ...groups.map((group) => group.items.length));

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="02 — tools" />
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 440, marginRight: 24 }}>
          <BigType size="h1" lines={["the tools", "i reach for"]} color={colors.ink} />
          <View style={{ marginTop: 24 }}>
            <ChipRow labels={names} max={24} />
          </View>
          <Text style={{ ...type.nano, color: colors.muted, marginTop: 14 }}>
            bar length = tools per group, not proficiency
          </Text>
        </View>

        <View style={{ width: 400 }}>
          {groups.map((group, i) => (
            <View
              key={group.title}
              style={{
                width: 388, marginLeft: OFFSETS[i], marginBottom: 12,
                backgroundColor: colors.paper, padding: 16,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                <Text style={{ ...type.h3, color: colors.ink }}>{truncate(group.title, 26)}</Text>
                <Text style={{ ...type.micro, color: colors.muted }}>
                  {group.items.length} tools
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <PixelBar
                  value={group.items.length / max}
                  width={356}
                  fill={i % 2 === 0 ? colors.blue : colors.orange}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </Slide>
  );
}
