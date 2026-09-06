import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType, ChipRow, PhotoFrame } from "../primitives";
import { colors, type } from "../theme";
import type { ResolvedSettings } from "@/types/siteSettings";

const NAV = ["profile", "work", "experience", "credentials", "contact"];

export function CoverSlide({
  settings, technologies, photo,
}: { settings: ResolvedSettings; technologies: string[]; photo?: string }) {
  const name = (settings.fullName ?? "portfolio").toLowerCase();
  const role = (settings.role ?? "").toLowerCase();
  const place = (settings.location ?? "").toLowerCase();

  return (
    <Slide tone="bone" decoration={<BleedCircle size={520} color={colors.peach} corner="bl" />}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={{ ...type.body, fontWeight: 700, color: colors.ink }}>{name}</Text>
        <Text style={{ ...type.small, color: colors.muted }}>
          {role}   ·   {place}   ·   <Text style={{ color: colors.blue }}>portfolio 2026</Text>
        </Text>
      </View>
      <View style={{ height: 1, backgroundColor: colors.ink, marginTop: 10 }} />

      <View style={{ flexDirection: "row", marginTop: 30, flexGrow: 1 }}>
        <View style={{ width: 500, paddingRight: 28 }}>
          <BigType
            size="display"
            lines={["modern,", "scalable,", "maintainable", "web apps."]}
            color={colors.ink}
            accentColor={colors.blue}
            accentLast
          />
          <View style={{ marginTop: 24 }}>
            <ChipRow labels={technologies} max={6} />
          </View>
        </View>
        <View style={{ width: 336 }}>
          <PhotoFrame src={photo} width={336} height={292} caption="fig. 01 — the maker" />
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: colors.ink, marginBottom: 10 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {NAV.map((word) => (
          <Text key={word} style={{ ...type.micro, color: colors.muted }}>{word}</Text>
        ))}
      </View>
    </Slide>
  );
}
