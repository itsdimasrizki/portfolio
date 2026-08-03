import React from "react";
import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { Project } from "@/types/project";
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
  // Project card
  card: {
    marginBottom: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    backgroundColor: colors.surface,
  },
  cardBody: {
    padding: spacing.cardPad,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: typography.h3,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    flex: 1,
  },
  statusBadge: {
    fontSize: typography.tiny,
    color: colors.primary,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
  description: {
    fontSize: typography.small,
    color: colors.foreground,
    lineHeight: 1.55,
    marginBottom: 10,
  },
  // Tech tags
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 10,
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
  // Links row
  linksRow: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 2,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkLabel: {
    fontSize: typography.tiny,
    color: colors.muted,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    letterSpacing: 0.5,
  },
  linkText: {
    fontSize: typography.tiny,
    color: colors.primary,
    textDecoration: "underline",
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

type ProjectsPageProps = {
  projects: Project[];
  settings: SanitySettings;
};

export function ProjectsPage({ projects, settings }: ProjectsPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>Projects</Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>Featured Projects</Text>

      {projects.map((project) => (
        <View key={project.id} style={styles.card} wrap={false}>
          {/* Thumbnail */}
          {project.images?.[0] ? (
            <Image
              src={project.images[0]}
              style={styles.cardImage}
            />
          ) : (
            <View style={[styles.cardImage, { justifyContent: "center", alignItems: "center" }]}>
              <Text style={{ fontSize: typography.small, color: colors.muted }}>
                No Image Available
              </Text>
            </View>
          )}

          <View style={styles.cardBody}>
            {/* Title + Status */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{project.title}</Text>
              {project.status && (
                <Text style={styles.statusBadge}>{project.status}</Text>
              )}
            </View>

            {/* Description */}
            {project.description && (
              <Text style={styles.description}>{project.description}</Text>
            )}

            {/* Tech stack */}
            {project.technologies?.length > 0 && (
              <View style={styles.tagRow}>
                {project.technologies.map((tech) => (
                  <View key={tech} style={styles.tag}>
                    <Text style={styles.tagText}>{tech}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Links */}
            {(project.github || project.liveDemo) && (
              <View style={styles.linksRow}>
                {project.github && (
                  <View style={styles.linkItem}>
                    <Text style={styles.linkLabel}>GitHub:</Text>
                    <Link src={project.github} style={styles.linkText}>
                      {project.github.replace("https://github.com/", "")}
                    </Link>
                  </View>
                )}
                {project.liveDemo && (
                  <View style={styles.linkItem}>
                    <Text style={styles.linkLabel}>Live Demo:</Text>
                    <Link src={project.liveDemo} style={styles.linkText}>
                      {project.liveDemo.replace("https://", "")}
                    </Link>
                  </View>
                )}
              </View>
            )}
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
