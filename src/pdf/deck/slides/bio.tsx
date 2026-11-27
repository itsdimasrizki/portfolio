import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import {
  Slide,
  SlideHeader,
  BigType,
  PhotoFrame,
  HairlineRule,
  Chip,
} from "../primitives";
import { colors, type } from "../theme";
import { splitParagraphs, truncate } from "../layout";
import type { ResolvedSettings } from "@/types/siteSettings";

const FOCUS = ["Clean Architecture", "Production Systems", "Full-stack + AI"];

type FactDraft = { key: string; value?: string; href?: string };
type Fact = FactDraft & { value: string };

function bareUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function BioSlide({ settings, photo }: { settings: ResolvedSettings; photo?: string }) {
  const paragraphs = splitParagraphs(settings.bio ?? "", 2);
  const drafts: FactDraft[] = [
    { key: "location", value: settings.location },
    { key: "role", value: truncate(settings.roles.join(", "), 42) || undefined },
    { key: "email", value: settings.email, href: settings.email && `mailto:${settings.email}` },
    {
      key: "portfolio",
      value: settings.portfolioUrl && bareUrl(settings.portfolioUrl),
      href: settings.portfolioUrl,
    },
  ];
  const facts = drafts.filter((fact): fact is Fact => Boolean(fact.value));

  return (
    <Slide tone="obsidian">
      <SlideHeader eyebrow="01 — profile" />
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 372, marginRight: 36 }}>
          <PhotoFrame src={photo} width={372} height={228} borderless />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 14 }}>
            {facts.map((fact, i) => {
              const highlight = fact.key === "portfolio";
              const card = (
                <View
                  style={{
                    width: 180,
                    height: 60,
                    padding: 10,
                    marginRight: i % 2 === 0 ? 12 : 0,
                    marginBottom: 10,
                    backgroundColor: highlight ? colors.accentSoft : colors.card,
                    borderWidth: 1,
                    borderColor: highlight ? colors.accentBorder : colors.border,
                    borderRadius: 8,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      ...type.micro,
                      color: highlight ? colors.accent : colors.fgMuted,
                      textTransform: "uppercase",
                    }}
                  >
                    {fact.key}
                  </Text>
                  <Text
                    style={{
                      ...type.small,
                      fontWeight: 500,
                      marginTop: 4,
                      color: highlight ? colors.accent : colors.fg,
                    }}
                  >
                    {truncate(fact.value, 30)}
                  </Text>
                </View>
              );
              return fact.href ? (
                <Link key={fact.key} src={fact.href} style={{ textDecoration: "none" }}>
                  {card}
                </Link>
              ) : (
                <View key={fact.key}>{card}</View>
              );
            })}
          </View>
        </View>

        <View style={{ width: 456 }}>
          <BigType
            size="h1"
            lines={["i turn ideas into", "reliable software."]}
            color={colors.fg}
            accentColor={colors.accent}
            accentLast
          />
          {paragraphs.map((paragraph, i) => (
            <Text key={i} style={{ ...type.body, color: colors.fgSecondary, marginTop: 14 }}>
              {paragraph}
            </Text>
          ))}
          <View style={{ marginTop: 20, marginBottom: 14 }}>
            <HairlineRule color={colors.border} />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {FOCUS.map((item) => (
              <Chip key={item} label={item} variant="accent" />
            ))}
          </View>
        </View>
      </View>
    </Slide>
  );
}
