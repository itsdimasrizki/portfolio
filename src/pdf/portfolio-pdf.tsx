import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import type { PortfolioPdfData } from "@/types/pdf";
import { colors, SLIDE, type } from "./deck/theme";

export function PortfolioPdf({ data }: { data: PortfolioPdfData }) {
  const name = data.settings.fullName ?? "Portfolio";
  return (
    <Document title={`${name} — Portfolio Deck`} author={name}>
      <Page size={[SLIDE.w, SLIDE.h]} style={{ backgroundColor: colors.bone, padding: SLIDE.mx }}>
        <Text style={{ ...type.micro, color: colors.blue }}>font check — silkscreen pixel</Text>
        <Text style={{ ...type.hero, color: colors.ink }}>Grotesk</Text>
        <Text style={{ ...type.body, color: colors.ink }}>
          Space Grotesk regular 400 — the quick brown fox jumps over the lazy dog.
        </Text>
        <View style={{ flexDirection: "row", marginTop: 16 }}>
          {[colors.blue, colors.orange, colors.ink, colors.peach, colors.mauve].map((c) => (
            <View key={c} style={{ width: 60, height: 40, backgroundColor: c, marginRight: 8 }} />
          ))}
        </View>
      </Page>
    </Document>
  );
}
