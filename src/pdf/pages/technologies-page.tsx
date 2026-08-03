import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { TechnologyGroup } from "@/types/technology";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    fontFamily: typography.fontFamily,
    paddingHorizontal: spacing.pageMarginH,
    paddingVertical: spacing.pageMarginV,
  },
  eyebrow: {
    fontSize: typography.tiny,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginBottom: 20,
  },
  heading: {
    fontSize: typography.h1,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 20,
  },
  // Category group
  group: {
    marginBottom: 18,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  groupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  groupTitle: {
    fontSize: typography.h4,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    letterSpacing: 0.3,
  },
  groupLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  // Tech items
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingLeft: 14,
  },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: typography.small,
    color: colors.foreground,
  },
  pageFooter: {
    position: "absolute",
    bottom: 28,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: typography.tiny,
    color: colors.muted,
  },
});

type TechnologiesPageProps = {
  technologies: TechnologyGroup[];
  settings: SanitySettings;
};

export function TechnologiesPage({ technologies, settings }: TechnologiesPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>Technologies</Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>Tech Stack</Text>

      {technologies.map((group) => (
        <View key={group.title} style={styles.group} wrap={false}>
          <View style={styles.groupHeader}>
            <View style={styles.groupDot} />
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupLine} />
          </View>

          <View style={styles.tagRow}>
            {group.items.map((item) => (
              <View key={item.name} style={styles.tag}>
                <Text style={styles.tagText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.pageFooter} fixed>
        <Text style={styles.footerText}>{fullName}</Text>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  );
}
