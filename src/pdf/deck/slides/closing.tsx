import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, OrbitalRing, BigType } from "../primitives";
import { colors, type } from "../theme";
import type { ResolvedSettings } from "@/types/siteSettings";

export function ClosingSlide({ settings }: { settings: ResolvedSettings }) {
  const line = [settings.fullName, settings.roles[0], settings.email, settings.portfolioUrl]
    .filter(Boolean)
    .join("  ·  ");
  return (
    <Slide
      tone="obsidian"
      decoration={<OrbitalRing size={460} corner="bl" color={colors.borderContrast} />}
    >
      <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <BigType
          size="hero"
          lines={["any", "questions?"]}
          color={colors.fg}
          accentColor={colors.accent}
          accentLast
        />
        <Text style={{ ...type.body, color: colors.fgSecondary, marginTop: 16 }}>{line}</Text>
      </View>
    </Slide>
  );
}
