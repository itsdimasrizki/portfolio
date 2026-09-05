import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType } from "../primitives";
import { colors, type } from "../theme";
import type { SanitySettings } from "@/types/siteSettings";

export function ClosingSlide({ settings }: { settings: SanitySettings }) {
  const line = [settings.fullName, settings.role, settings.email, settings.portfolioUrl]
    .filter(Boolean)
    .join("  ·  ");
  return (
    <Slide tone="bone" decoration={<BleedCircle size={430} color={colors.lilac} corner="bl" />}>
      <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <BigType size="hero" lines={["any", "questions?"]} color={colors.ink} />
        <Text style={{ ...type.body, color: colors.muted, marginTop: 16 }}>{line}</Text>
      </View>
    </Slide>
  );
}
