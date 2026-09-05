import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { Slide, BleedCircle, BigType, SlideNumber } from "../primitives";
import { colors, type } from "../theme";
import { truncate } from "../layout";
import type { SanitySettings } from "@/types/siteSettings";

type ItemDraft = { key: string; value?: string; href?: string };
type Item = ItemDraft & { value: string };

export function ContactSlide({
  settings, qrCodeDataUrl,
}: { settings: SanitySettings; qrCodeDataUrl: string }) {
  const drafts: ItemDraft[] = [
    { key: "email", value: settings.email, href: settings.email && `mailto:${settings.email}` },
    { key: "phone", value: settings.phone, href: settings.phone && `tel:${settings.phone.replace(/[^+\d]/g, "")}` },
    { key: "github", value: settings.githubUrl, href: settings.githubUrl },
    { key: "linkedin", value: settings.linkedinUrl, href: settings.linkedinUrl },
  ];
  const items = drafts.filter((item): item is Item => Boolean(item.value));

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
            {items.map((item) => {
              const cell = (
                <View style={{ width: 190 }}>
                  <Text style={{ ...type.micro, color: colors.mutedOn }}>{item.key}</Text>
                  <Text style={{ ...type.small, fontWeight: 700, color: colors.bone, marginTop: 5 }}>
                    {truncate(item.value.replace(/^https?:\/\//, ""), 26)}
                  </Text>
                </View>
              );
              return item.href
                ? <Link key={item.key} src={item.href} style={{ textDecoration: "none" }}>{cell}</Link>
                : <View key={item.key}>{cell}</View>;
            })}
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
