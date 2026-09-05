import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, fgOn, mutedOn, type Tone } from "../primitives";
import { colors, type } from "../theme";
import { truncate, yearRange } from "../layout";
import type { Experience } from "@/types/experience";

const INDENT = [0, 26, 0, 26];

export function ExperienceSlide({
  experiences, pageIndex,
}: { experiences: Experience[]; pageIndex: number }) {
  return (
    <Slide tone="bone">
      <SlideHeader eyebrow={pageIndex === 0 ? "work history" : "work history (cont.)"} />
      {experiences.map((experience, i) => {
        const hero = pageIndex === 0 && i === 0;
        const tone: Tone = hero ? "blue" : "paper";
        const range = yearRange(experience.startDate, experience.endDate);
        const indent = INDENT[i % 4];
        // Lebar eksplisit, bukan flexGrow: flexShrink default yoga adalah 0,
        // jadi kolom teks tidak pernah menyusut dan deskripsi panjang meluber
        // keluar kartu. 864 - indent - 28 (padding kartu) - 190 (kolom kiri).
        const bodyWidth = 646 - indent;
        return (
          <View
            key={experience.id}
            style={{
              width: 864 - indent, marginLeft: indent,
              height: 84, marginBottom: 12, padding: 14, flexDirection: "row",
              backgroundColor: hero ? colors.blue : colors.paper,
            }}
          >
            <View style={{ width: 190 }}>
              {range && (
                <Text style={{ ...type.h2, fontSize: 24, color: fgOn(tone) }}>{range}</Text>
              )}
              <Text style={{ ...type.micro, color: mutedOn(tone), marginTop: 4 }}>
                {truncate(experience.position, 34)}
              </Text>
            </View>
            <View style={{ width: bodyWidth, paddingLeft: 16 }}>
              <Text style={{ ...type.h3, color: fgOn(tone) }}>
                {truncate(experience.company, 46)}
              </Text>
              <Text style={{ ...type.small, color: fgOn(tone), marginTop: 6 }}>
                {truncate(experience.description, 150)}
              </Text>
            </View>
          </View>
        );
      })}
    </Slide>
  );
}
