import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { TechnologyGroup } from "@/types/technology";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography } from "../theme";
import { PageHeader, PageFooter, SectionHeading, pageShellStyles as shell } from "../page-shell";

const S = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },
  groupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  groupTitle: {
    fontSize: typography.h4,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
  },
  groupLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    paddingLeft: 13,
  },
  pill: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: typography.small,
    color: colors.foreground,
  },
});

type TechnologiesPageProps = { technologies: TechnologyGroup[]; settings: SanitySettings };

export function TechnologiesPage({ technologies, settings }: TechnologiesPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={shell.page}>
      <PageHeader section="Tech Stack" name={fullName} />
      <SectionHeading label="Tools & Technologies" title="Tech Stack" />

      {technologies.map((group) => (
        <View key={group.title} style={S.group} wrap={false}>
          <View style={S.groupHeader}>
            <View style={S.groupDot} />
            <Text style={S.groupTitle}>{group.title}</Text>
            <View style={S.groupLine} />
          </View>
          <View style={S.pills}>
            {group.items.map((item) => (
              <View key={item.name} style={S.pill}>
                <Text style={S.pillText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <PageFooter name={fullName} />
    </Page>
  );
}
