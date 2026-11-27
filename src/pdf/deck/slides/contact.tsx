/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { Slide, OrbitalRing, BigType, SlideHeader } from "../primitives";
import { colors, type } from "../theme";
import { truncate } from "../layout";
import type { ResolvedSettings } from "@/types/siteSettings";

type ItemDraft = { key: string; value?: string; href?: string };
type Item = ItemDraft & { value: string };

export function ContactSlide({
  settings,
  qrCodeDataUrl,
}: {
  settings: ResolvedSettings;
  qrCodeDataUrl: string;
}) {
  const drafts: ItemDraft[] = [
    { key: "email", value: settings.email, href: settings.email && `mailto:${settings.email}` },
    {
      key: "phone",
      value: settings.phone,
      href: settings.phone && `tel:${settings.phone.replace(/[^+\d]/g, "")}`,
    },
    { key: "github", value: settings.githubUrl, href: settings.githubUrl },
    { key: "linkedin", value: settings.linkedinUrl, href: settings.linkedinUrl },
  ];
  const items = drafts.filter((item): item is Item => Boolean(item.value));

  return (
    <Slide
      tone="obsidian"
      decoration={<OrbitalRing size={440} corner="tr" color={colors.borderContrast} />}
    >
      <SlideHeader eyebrow="05 — contact" />

      <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <BigType
          size="hero"
          lines={["let's build", "something."]}
          color={colors.fg}
          accentColor={colors.accent}
          accentLast
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 18,
            padding: 18,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", width: 710 }}>
            {items.map((item) => {
              const cell = (
                <View style={{ width: 172, paddingRight: 12 }}>
                  <Text style={{ ...type.micro, color: colors.fgMuted, textTransform: "uppercase" }}>
                    {item.key}
                  </Text>
                  <Text style={{ ...type.small, fontWeight: 700, color: colors.fg, marginTop: 5 }}>
                    {truncate(item.value.replace(/^https?:\/\//, ""), 24)}
                  </Text>
                </View>
              );
              return item.href ? (
                <Link key={item.key} src={item.href} style={{ textDecoration: "none" }}>
                  {cell}
                </Link>
              ) : (
                <View key={item.key}>{cell}</View>
              );
            })}
          </View>
          {qrCodeDataUrl && (
            <View style={{ backgroundColor: colors.white, borderRadius: 8, padding: 6 }}>
              <Image src={qrCodeDataUrl} style={{ width: 72, height: 72 }} />
            </View>
          )}
        </View>
      </View>
    </Slide>
  );
}
