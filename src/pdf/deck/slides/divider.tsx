import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType, SlideNumber, fgOn, type Corner, type Tone } from "../primitives";
import { colors, type } from "../theme";

export function DividerSlide({
  eyebrow, lines, subline, tone, corner,
}: {
  eyebrow: string; lines: string[]; subline?: string;
  tone: Extract<Tone, "bone" | "blue" | "ink" | "orange">; corner: Corner;
}) {
  const fg = fgOn(tone);
  return (
    <Slide
      tone={tone}
      decoration={<BleedCircle size={460} color={tone === "bone" ? colors.peach : colors.mauve} corner={corner} />}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ ...type.micro, color: fg }}>{eyebrow}</Text>
        <SlideNumber tone={tone} />
      </View>
      <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <BigType size="hero" lines={lines} color={fg} />
        {subline && (
          <Text style={{ ...type.body, color: fg, marginTop: 14, maxWidth: 520 }}>{subline}</Text>
        )}
      </View>
    </Slide>
  );
}
