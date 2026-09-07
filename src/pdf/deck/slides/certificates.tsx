import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, bgOn, fgOn, mutedOn, type Tone } from "../primitives";
import { colors, type } from "../theme";
import { truncate, formatDate } from "../layout";
import type { Certificate } from "@/types/certificate";

const HEIGHTS = [190, 172, 182, 172, 190, 178];

export function CertificatesSlide({
  certificates, pageIndex, overflow,
}: { certificates: Certificate[]; pageIndex: number; overflow: number }) {
  const showOverflow = overflow > 0;
  const cards = showOverflow ? certificates.slice(0, 5) : certificates;

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow={pageIndex === 0 ? "credentials" : "credentials (cont.)"} />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cards.map((certificate, i) => {
          const tone: Tone = i === 1 ? "blue" : i === 5 ? "ink" : "paper";
          const issued = formatDate(certificate.issuedAt);
          return (
            <View
              key={certificate.id}
              style={{
                width: 272, height: HEIGHTS[i], padding: 16, marginBottom: 16,
                marginRight: i % 3 === 2 ? 0 : 24,
                backgroundColor: bgOn(tone),
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ ...type.small, color: tone === "paper" ? (i % 2 === 0 ? colors.blue : colors.orange) : mutedOn(tone) }}>
                  {truncate(certificate.issuer, 28)}
                </Text>
                <Text style={{ ...type.h3, color: fgOn(tone), marginTop: 8 }}>
                  {truncate(certificate.title, 48)}
                </Text>
              </View>
              {issued && (
                <Text style={{ ...type.micro, color: mutedOn(tone) }}>{issued}</Text>
              )}
            </View>
          );
        })}
        {showOverflow && (
          <View style={{
            width: 272, height: HEIGHTS[5], padding: 16, marginBottom: 16,
            backgroundColor: colors.ink, justifyContent: "flex-end",
          }}>
            <Text style={{ ...type.num, color: colors.bone }}>+{overflow}</Text>
            <Text style={{ ...type.small, color: colors.mutedOn, marginTop: 6 }}>
              more credentials
            </Text>
          </View>
        )}
      </View>
    </Slide>
  );
}
