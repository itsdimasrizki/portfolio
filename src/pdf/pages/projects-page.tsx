import React from "react";
import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { Project } from "@/types/project";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography } from "../theme";
import { PageHeader, PageFooter, SectionHeading, pageShellStyles as shell } from "../page-shell";

function truncateUrl(url: string, max = 44) {
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

const S = StyleSheet.create({
  card: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 14,
  },
  thumbnail: {
    width: "100%",
    height: 130,
    objectFit: "cover",
    backgroundColor: colors.surface,
  },
  noThumb: {
    width: "100%",
    height: 130,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  noThumbText: {
    fontSize: typography.tiny,
    color: colors.muted,
  },
  cardBody: {
    padding: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: typography.h3,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    flex: 1,
  },
  badge: {
    fontSize: typography.micro,
    color: colors.primary,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
  desc: {
    fontSize: typography.small,
    color: colors.body,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: typography.micro,
    color: colors.secondary,
  },
  linkRow: {
    flexDirection: "row",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 7,
  },
  linkGroup: { flexDirection: "row", alignItems: "center", gap: 4 },
  linkLabel: {
    fontSize: typography.micro,
    color: colors.muted,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
  linkHref: {
    fontSize: typography.micro,
    color: colors.primary,
    textDecoration: "underline",
  },
});

type ProjectsPageProps = { projects: Project[]; settings: SanitySettings };

export function ProjectsPage({ projects, settings }: ProjectsPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={shell.page}>
      <PageHeader section="Projects" name={fullName} />
      <SectionHeading label="Portfolio Highlights" title="Featured Projects" />

      {projects.map((p) => (
        <View key={p.id} style={S.card} wrap={false}>
          {p.images?.[0] ? (
            <Image src={p.images[0]} style={S.thumbnail} />
          ) : (
            <View style={S.noThumb}>
              <Text style={S.noThumbText}>No preview available</Text>
            </View>
          )}

          <View style={S.cardBody}>
            <View style={S.titleRow}>
              <Text style={S.title}>{p.title}</Text>
              {p.status && <Text style={S.badge}>{p.status}</Text>}
            </View>

            {p.description ? <Text style={S.desc}>{p.description}</Text> : null}

            {p.technologies?.length > 0 && (
              <View style={S.tagRow}>
                {p.technologies.map((t) => (
                  <View key={t} style={S.tag}>
                    <Text style={S.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {(p.github || p.liveDemo) && (
              <View style={S.linkRow}>
                {p.github && (
                  <View style={S.linkGroup}>
                    <Text style={S.linkLabel}>GitHub →</Text>
                    <Link src={p.github} style={S.linkHref}>
                      {truncateUrl(p.github)}
                    </Link>
                  </View>
                )}
                {p.liveDemo && (
                  <View style={S.linkGroup}>
                    <Text style={S.linkLabel}>Live →</Text>
                    <Link src={p.liveDemo} style={S.linkHref}>
                      {truncateUrl(p.liveDemo)}
                    </Link>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      ))}

      <PageFooter name={fullName} />
    </Page>
  );
}
