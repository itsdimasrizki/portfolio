import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader } from "../primitives";
import { colors, type } from "../theme";
import { pad2 } from "../layout";

const WIDTH = 158;
const GUTTER = 18;
const HEIGHTS = [408, 372, 390, 352, 408];
const OFFSETS = [0, 24, 8, 36, 0];

export function ContentsSlide({ entries }: { entries: { label: string; page?: number }[] }) {
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="contents" />
      <View style={{ flexDirection: "row" }}>
        {entries.slice(0, 5).map((entry, i) => {
          const last = i === 4;
          const fg = last ? colors.bone : colors.ink;
          return (
            <View
              key={entry.label}
              style={{
                width: WIDTH,
                height: HEIGHTS[i],
                marginTop: OFFSETS[i],
                marginRight: i < 4 ? GUTTER : 0,
                backgroundColor: last ? colors.blue : colors.paper,
                padding: 16,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ ...type.num, color: last ? colors.bone : i % 2 === 0 ? colors.blue : colors.orange }}>
                  {pad2(i + 1)}
                </Text>
                <Text style={{ ...type.h3, color: fg, marginTop: 6 }}>{entry.label}</Text>
              </View>
              {entry.page !== undefined && (
                <Text style={{ ...type.micro, color: last ? colors.mutedOn : colors.muted }}>
                  p. {pad2(entry.page)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
