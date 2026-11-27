import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader } from "../primitives";
import { colors, type } from "../theme";
import { pad2 } from "../layout";

const WIDTH = 158;
const GUTTER = 18;
const HEIGHTS = [378, 354, 366, 344, 378];
const OFFSETS = [0, 20, 8, 28, 0];

export function ContentsSlide({ entries }: { entries: { label: string; page?: number }[] }) {
  return (
    <Slide tone="obsidian">
      <SlideHeader eyebrow="contents" />
      <View style={{ flexDirection: "row" }}>
        {entries.slice(0, 5).map((entry, i) => {
          const last = i === 4;
          return (
            <View
              key={entry.label}
              style={{
                width: WIDTH,
                height: HEIGHTS[i],
                marginTop: OFFSETS[i],
                marginRight: i < 4 ? GUTTER : 0,
                backgroundColor: last ? colors.accent : colors.card,
                borderWidth: 1,
                borderColor: last ? colors.accent : colors.border,
                borderRadius: 10,
                padding: 16,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    ...type.num,
                    color: last ? colors.bg : i % 2 === 0 ? colors.accent : colors.accentSecondary,
                  }}
                >
                  {pad2(i + 1)}
                </Text>
                <Text
                  style={{
                    ...type.h3,
                    color: last ? colors.bg : colors.fg,
                    marginTop: 8,
                    textTransform: "capitalize",
                  }}
                >
                  {entry.label}
                </Text>
              </View>
              {entry.page !== undefined && (
                <View style={{ borderTopWidth: 1, borderColor: last ? "#d9b043" : colors.border, paddingTop: 10 }}>
                  <Text style={{ ...type.micro, color: last ? "#4a3c16" : colors.fgMuted }}>
                    p. {pad2(entry.page)}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
