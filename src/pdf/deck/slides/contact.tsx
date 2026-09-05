import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType, SlideNumber } from "../primitives";
import { colors, type } from "../theme";
import { truncate } from "../layout";
import type { SanitySettings } from "@/types/siteSettings";

export function ContactSlide({
  settings, qrCodeDataUrl,
}: { settings: SanitySettings; qrCodeDataUrl: string }) {
  const items = [
    { key: "email", value: settings.email },
    { key: "phone", value: settings.phone },
    { key: "github", value: settings.githubUrl },
    { key: "linkedin", value: settings.linkedinUrl },
  ].filter((item): item is { key: string; value: string } => Boolean(item.value));

  return (
    <Slide tone="blue" decoration={<BleedCircle size={440} color={colors.mauve} corner="tr" />}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ ...type.micro, color: colors.bone }}>05 — contact</Text>
        <SlideNumber tone="blue" />
      </View>

      <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <BigType size="hero" lines={["let's build", "something."]} color={colors.bone} />
        <View style={{ height: 1, backgroundColor: colors.bone, marginTop: 22, marginBottom: 14 }} />
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row", flexGrow: 1 }}>
            {items.map((item) => (
              <View key={item.key} style={{ width: 190 }}>
                <Text style={{ ...type.micro, color: colors.mutedOn }}>{item.key}</Text>
                <Text style={{ ...type.small, fontWeight: 700, color: colors.bone, marginTop: 5 }}>
                  {truncate(item.value.replace(/^https?:\/\//, ""), 26)}
                </Text>
              </View>
            ))}
          </View>
          {qrCodeDataUrl && (
            <View style={{ backgroundColor: colors.white, padding: 8 }}>
              <Image src={qrCodeDataUrl} style={{ width: 76, height: 76 }} />
            </View>
          )}
        </View>
      </View>
    </Slide>
  );
}
