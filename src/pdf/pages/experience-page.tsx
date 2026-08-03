import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Experience } from "@/types/experience";
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
    marginBottom: 24,
  },
  // Timeline
  timeline: {
    gap: 0,
  },
  item: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 22,
  },
  // Left: dot + line
  timelineLeft: {
    width: 16,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 1.5,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  // Right: content
  timelineRight: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  position: {
    fontSize: typography.h4,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    flex: 1,
  },
  dateRange: {
    fontSize: typography.tiny,
    color: colors.muted,
    marginLeft: 8,
  },
  company: {
    fontSize: typography.body,
    color: colors.primary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 2,
  },
  location: {
    fontSize: typography.tiny,
    color: colors.muted,
    marginBottom: 6,
  },
  description: {
    fontSize: typography.small,
    color: colors.foreground,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  // Tech tags
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: typography.tiny,
    color: colors.secondary,
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

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.toLowerCase() === "present") return "Present";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

type ExperiencePageProps = {
  experiences: Experience[];
  settings: SanitySettings;
};

export function ExperiencePage({ experiences, settings }: ExperiencePageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>Experience</Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>Work Experience</Text>

      <View style={styles.timeline}>
        {experiences.map((exp, idx) => (
          <View key={exp.id} style={styles.item} wrap={false}>
            {/* Timeline line */}
            <View style={styles.timelineLeft}>
              <View style={styles.dot} />
              {idx < experiences.length - 1 && <View style={styles.line} />}
            </View>

            {/* Content */}
            <View style={styles.timelineRight}>
              <View style={styles.itemHeader}>
                <Text style={styles.position}>{exp.position}</Text>
                <Text style={styles.dateRange}>
                  {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                </Text>
              </View>

              <Text style={styles.company}>{exp.company}</Text>

              {exp.location ? (
                <Text style={styles.location}>📍 {exp.location}</Text>
              ) : null}

              {exp.description ? (
                <Text style={styles.description}>{exp.description}</Text>
              ) : null}

              {exp.technologies && exp.technologies.length > 0 && (
                <View style={styles.tagRow}>
                  {exp.technologies.map((tech) => (
                    <View key={tech} style={styles.tag}>
                      <Text style={styles.tagText}>{tech}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

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
