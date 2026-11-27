import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { Slide, SlideHeader } from "../primitives";
import { colors, type } from "../theme";
import { truncate, yearRange } from "../layout";
import type { Experience } from "@/types/experience";

export function ExperienceSlide({
  experiences,
  pageIndex,
}: {
  experiences: Experience[];
  pageIndex: number;
}) {
  return (
    <Slide tone="elevated">
      <SlideHeader
        tone="elevated"
        eyebrow={pageIndex === 0 ? "work history" : "work history (cont.)"}
      />
      <View>
        {experiences.map((experience, i) => {
          const hero = pageIndex === 0 && i === 0;
          const range =
            yearRange(experience.startDate, experience.endDate) ??
            [experience.startDate, experience.endDate].filter(Boolean).join(" — ");
          const techs = (experience.technologies ?? []).slice(0, 6);

          return (
            <View
              key={experience.id}
              style={{
                width: 864,
                marginBottom: i < experiences.length - 1 ? 12 : 0,
                padding: 15,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: hero ? colors.accentBorder : colors.border,
                borderRadius: 10,
              }}
            >
              {/* Top row: Position + Date Range */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                <Text style={{ ...type.h3, color: colors.fg }}>
                  {truncate(experience.position, 56)}
                </Text>
                {range && (
                  <Text style={{ ...type.micro, color: colors.fgMuted }}>
                    {range}
                  </Text>
                )}
              </View>

              {/* Company / Location */}
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Text style={{ ...type.small, fontWeight: 700, color: colors.accent }}>
                  {truncate(experience.company, 48)}
                </Text>
                {experience.location && (
                  <Text style={{ ...type.small, color: colors.fgSecondary }}>
                    {`  /  ${truncate(experience.location, 36)}`}
                  </Text>
                )}
              </View>

              {/* Description */}
              <Text style={{ ...type.small, color: colors.fgSecondary, marginTop: 8 }}>
                {truncate(experience.description, 195)}
              </Text>

              {/* Tech stack pills */}
              {techs.length > 0 && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                  {techs.map((tech) => (
                    <View
                      key={tech}
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.secondary,
                        borderRadius: 999,
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        marginRight: 5,
                      }}
                    >
                      <Text style={{ ...type.micro, fontSize: 7.5, color: colors.fgSecondary }}>
                        {tech}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
