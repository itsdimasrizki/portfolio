import React from "react";
import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { Certificate } from "@/types/certificate";
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
  // 2-column grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    width: "47%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  thumbnail: {
    width: "100%",
    height: 110,
    objectFit: "cover",
    backgroundColor: colors.surface,
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: 110,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    padding: spacing.cardPadSm,
  },
  cardTitle: {
    fontSize: typography.small,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 4,
    lineHeight: 1.3,
  },
  issuer: {
    fontSize: typography.tiny,
    color: colors.primary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 2,
  },
  date: {
    fontSize: typography.tiny,
    color: colors.muted,
    marginBottom: 6,
  },
  credentialLink: {
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

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

type CertificatesPageProps = {
  certificates: Certificate[];
  settings: SanitySettings;
};

export function CertificatesPage({ certificates, settings }: CertificatesPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>Certificates</Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>Certifications</Text>

      <View style={styles.grid}>
        {certificates.map((cert) => (
          <View key={cert.id} style={styles.card} wrap={false}>
            {cert.image ? (
              <Image src={cert.image} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={{ fontSize: typography.tiny, color: colors.muted }}>
                  No Image
                </Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{cert.title}</Text>
              <Text style={styles.issuer}>{cert.issuer}</Text>
              {cert.issuedAt && (
                <Text style={styles.date}>{formatDate(cert.issuedAt)}</Text>
              )}
              {cert.credentialUrl && (
                <Link src={cert.credentialUrl} style={styles.credentialLink}>
                  View Credential
                </Link>
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
