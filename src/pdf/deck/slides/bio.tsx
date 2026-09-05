import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import { Slide, SlideHeader, BigType, PhotoFrame, PixelRule } from "../primitives";
import { colors, type } from "../theme";
import { splitParagraphs, truncate } from "../layout";
import type { SanitySettings } from "@/types/siteSettings";

const FOCUS = ["clean architecture", "intuitive experiences", "efficient backends"];

type FactDraft = { key: string; value?: string; href?: string };
type Fact = FactDraft & { value: string };

function bareUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function BioSlide({ settings, photo }: { settings: SanitySettings; photo?: string }) {
  const first = (settings.fullName ?? "").split(" ")[0]?.toLowerCase() || "me";
  const paragraphs = splitParagraphs(settings.bio ?? "", 2);
  // `label` yang dicetak, `href` yang diklik. URL mentah dicukur protokol dan
  // garis miring akhirnya dulu supaya muat di kartu 180pt tanpa terpotong.
  const drafts: FactDraft[] = [
    { key: "location", value: settings.location },
    { key: "role", value: settings.role },
    { key: "email", value: settings.email, href: settings.email && `mailto:${settings.email}` },
    { key: "portfolio", value: settings.portfolioUrl && bareUrl(settings.portfolioUrl),
      href: settings.portfolioUrl },
  ];
  const facts = drafts.filter((fact): fact is Fact => Boolean(fact.value));

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow="01 — profile" />
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 372, marginRight: 36 }}>
          <PhotoFrame src={photo} width={372} height={252} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
            {facts.map((fact, i) => {
              const highlight = fact.key === "portfolio";
              const card = (
                <View
                  style={{
                    width: 180, height: 62, padding: 10,
                    marginRight: i % 2 === 0 ? 12 : 0, marginBottom: 12,
                    backgroundColor: highlight ? colors.blue : colors.paper,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ ...type.micro, color: highlight ? colors.mutedOn : colors.muted }}>
                    {fact.key}
                  </Text>
                  <Text style={{
                    ...type.small, fontWeight: 500, marginTop: 4,
                    color: highlight ? colors.bone : colors.ink,
                  }}>
                    {truncate(fact.value, 32)}
                  </Text>
                </View>
              );
              return fact.href
                ? <Link key={fact.key} src={fact.href} style={{ textDecoration: "none" }}>{card}</Link>
                : <View key={fact.key}>{card}</View>;
            })}
          </View>
        </View>

        <View style={{ width: 456 }}>
          <BigType
            size="h1"
            lines={[`hi, i'm ${first} —`, "i turn ideas into", "reliable software."]}
            color={colors.ink}
            accentColor={colors.blue}
            accentLast
          />
          {paragraphs.map((paragraph, i) => (
            <Text key={i} style={{ ...type.body, color: colors.ink, marginTop: 14 }}>
              {paragraph}
            </Text>
          ))}
          <View style={{ marginTop: 18 }}>
            <PixelRule width={456} color={colors.orange} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            {FOCUS.map((item) => (
              <Text key={item} style={{ ...type.micro, color: colors.muted, marginRight: 22 }}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Slide>
  );
}
