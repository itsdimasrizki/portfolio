import React from "react";
import { View, Text } from "@react-pdf/renderer";
import {
  Slide,
  OrbitalRing,
  BigType,
  ChipRow,
  PhotoFrame,
  StatusPill,
} from "../primitives";
import { colors, type } from "../theme";
import { introLines, joinRoles } from "../layout";
import type { ResolvedSettings } from "@/types/siteSettings";

const NAV = ["profile", "work", "experience", "credentials", "contact"];
const FALLBACK_INTRO = ["modern,", "scalable,", "maintainable", "web apps."];
const ROLE_BUDGET = 46;

export function CoverSlide({
  settings,
  technologies,
  photo,
  intro,
}: {
  settings: ResolvedSettings;
  technologies: string[];
  photo?: string;
  intro: string;
}) {
  const name = settings.fullName ?? "Dimas Rizki Ardiansyah";
  const role = joinRoles(settings.roles, ROLE_BUDGET);
  const place = settings.location ?? "";
  const written = introLines(intro);
  const lines = written.lines.length > 0 ? written.lines : FALLBACK_INTRO;

  return (
    <Slide
      tone="obsidian"
      decoration={
        <>
          <OrbitalRing size={540} corner="br" dx={40} dy={20} color={colors.border} />
          <OrbitalRing size={380} corner="tr" dx={-40} dy={-40} color={colors.border} />
        </>
      }
    >
      {/* Top Navbar bar — mirrors web Navbar */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            width: 7, height: 7, borderRadius: 3.5,
            backgroundColor: colors.accent, marginRight: 8,
          }} />
          <Text style={{ ...type.body, fontWeight: 700, color: colors.fg }}>{name}</Text>
        </View>
        <Text style={{ ...type.small, color: colors.fgMuted }}>
          {[role, place].filter(Boolean).map((part) => `${part}  ·  `).join("")}
          <Text style={{ color: colors.accent }}>portfolio 2026</Text>
        </Text>
      </View>
      <View style={{ height: 1, backgroundColor: colors.border, marginTop: 12 }} />

      {/* Hero Split Content — mirrors web HeroContent */}
      <View style={{ flexDirection: "row", marginTop: 26, flexGrow: 1, alignItems: "center" }}>
        <View style={{ width: 508, paddingRight: 28 }}>
          <View style={{ marginBottom: 16 }}>
            <StatusPill
              label={settings.roles[0] ? `Available · ${settings.roles[0]}` : "Open to Work · Freelance & Full-time"}
              dotColor={colors.emerald}
            />
          </View>

          <BigType
            size={written.lines.length > 0 ? written.size : "display"}
            lines={lines}
            color={colors.fg}
            accentColor={colors.accent}
            accentLast
          />

          <View style={{ marginTop: 20 }}>
            <ChipRow labels={technologies} max={7} accentFirst />
          </View>
        </View>

        <View style={{ width: 356, alignItems: "center" }}>
          <PhotoFrame
            src={photo}
            width={328}
            height={286}
            borderless
            caption="Fullstack · AI · IoT — Production-Grade Systems"
          />
        </View>
      </View>

      {/* Bottom Nav Strip */}
      <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 10 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {NAV.map((word) => (
          <Text key={word} style={{ ...type.micro, color: colors.fgMuted, textTransform: "uppercase" }}>
            {word}
          </Text>
        ))}
      </View>
    </Slide>
  );
}
