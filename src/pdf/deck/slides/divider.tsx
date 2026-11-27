import React from "react";
import { View, Text } from "@react-pdf/renderer";
import {
  Slide,
  OrbitalRing,
  BigType,
  SlideNumber,
  fgOn,
  mutedOn,
  type Corner,
  type Tone,
} from "../primitives";
import { colors, type } from "../theme";

export function DividerSlide({
  eyebrow,
  lines,
  subline,
  tone,
  corner,
}: {
  eyebrow: string;
  lines: string[];
  subline?: string;
  tone: Extract<Tone, "obsidian" | "subtle" | "elevated" | "card">;
  corner: Corner;
}) {
  const fg = fgOn(tone);
  return (
    <Slide
      tone={tone}
      decoration={<OrbitalRing size={460} corner={corner} color={colors.borderContrast} />}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 6, height: 6, backgroundColor: colors.accent, marginRight: 8 }} />
          <Text style={{ ...type.micro, color: colors.fgSecondary, textTransform: "uppercase" }}>
            {eyebrow}
          </Text>
        </View>
        <SlideNumber tone={tone} />
      </View>

      <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <BigType
          size="hero"
          lines={lines}
          color={fg}
          accentColor={colors.accent}
          accentLast
        />
        {subline && (
          <View style={{ borderTopWidth: 1, borderColor: colors.border, paddingTop: 14, marginTop: 8 }}>
            <Text style={{ ...type.body, color: mutedOn(tone), maxWidth: 560 }}>{subline}</Text>
          </View>
        )}
      </View>
    </Slide>
  );
}
