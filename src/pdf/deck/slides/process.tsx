import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader, fgOn, type Tone } from "../primitives";
import { colors, type } from "../theme";
import { stagger, heightFor, accentFor, truncate, pad2 } from "../layout";
import type { Skill } from "@/types/skill";

const WIDTH = 158;
const GUTTER = 18;
const BASE = 300;

export function ProcessSlide({ skills, pageIndex }: { skills: Skill[]; pageIndex: number }) {
  const heroIndex = pageIndex % 5;
  const heroTone: Tone = accentFor(pageIndex);

  return (
    <Slide tone="bone">
      <SlideHeader eyebrow={pageIndex === 0 ? "how i work" : "how i work (cont.)"} />
      <View style={{ flexDirection: "row" }}>
        {skills.map((skill, i) => {
          const hero = i === heroIndex;
          const tone: Tone = hero ? heroTone : "paper";
          return (
            <View
              key={skill.title}
              style={{
                width: WIDTH,
                height: heightFor(i, BASE),
                marginTop: Math.max(0, stagger(i)),
                marginRight: i < skills.length - 1 ? GUTTER : 0,
                backgroundColor: tone === "paper" ? colors.paper
                  : tone === "blue" ? colors.blue
                  : tone === "orange" ? colors.orange : colors.ink,
                padding: 16,
              }}
            >
              <Text style={{ ...type.num, color: hero ? fgOn(tone) : i % 2 === 0 ? colors.blue : colors.orange }}>
                {pad2(pageIndex * 5 + i + 1)}
              </Text>
              <Text style={{ ...type.h3, color: fgOn(tone), marginTop: 6 }}>
                {truncate(skill.title, 24)}
              </Text>
              <Text style={{ ...type.small, color: hero ? fgOn(tone) : colors.ink, marginTop: 10 }}>
                {truncate(skill.description, 120)}
              </Text>
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
