import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader } from "../primitives";
import { colors, type } from "../theme";
import { stagger, heightFor, truncate, pad2 } from "../layout";
import type { Skill } from "@/types/skill";

const WIDTH = 158;
const GUTTER = 18;
const BASE = 350;

export function ProcessSlide({ skills, pageIndex }: { skills: Skill[]; pageIndex: number }) {
  const heroIndex = pageIndex % Math.max(1, skills.length);

  return (
    <Slide tone="obsidian">
      <SlideHeader eyebrow={pageIndex === 0 ? "how i work" : "how i work (cont.)"} />
      <View style={{ flexDirection: "row" }}>
        {skills.map((skill, i) => {
          const hero = i === heroIndex;
          return (
            <View
              key={`${skill.title}-${i}`}
              style={{
                width: WIDTH,
                height: heightFor(i, BASE),
                marginTop: Math.max(0, stagger(i)),
                marginRight: i < skills.length - 1 ? GUTTER : 0,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: hero ? colors.accentBorder : colors.border,
                borderRadius: 10,
                padding: 14,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  borderWidth: 1,
                  borderColor: hero ? colors.accentBorder : colors.border,
                  backgroundColor: hero ? colors.accentSoft : colors.secondary,
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    ...type.micro,
                    color: hero ? colors.accent : colors.accentSecondary,
                  }}
                >
                  {pad2(pageIndex * 5 + i + 1)}
                </Text>
              </View>
              <Text style={{ ...type.h3, color: colors.fg }}>
                {truncate(skill.title, 24)}
              </Text>
              <Text style={{ ...type.small, color: colors.fgSecondary, marginTop: 10 }}>
                {truncate(skill.description, 125)}
              </Text>
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
