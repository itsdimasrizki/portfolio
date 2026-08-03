import React from "react";
import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { Certificate } from "@/types/certificate";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography } from "../theme";
import { PageHeader, PageFooter, SectionHeading, pageShellStyles as shell } from "../page-shell";

function formatDate(s: string) {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch { return s; }
}

const S = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47.5%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  thumb: {
    width: "100%",
    height: 100,
    objectFit: "cover",
    backgroundColor: colors.surface,
  },
  noThumb: {
    width: "100%",
    height: 100,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  noThumbText: {
    fontSize: typography.tiny,
    color: colors.muted,
  },
  cardBody: {
    padding: 10,
  },
  title: {
    fontSize: typography.small,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    lineHeight: 1.3,
    marginBottom: 4,
  },
  issuer: {
    fontSize: typography.tiny,
    color: colors.primary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 2,
  },
  date: {
    fontSize: typography.micro,
    color: colors.muted,
    marginBottom: 6,
  },
  credential: {
    fontSize: typography.micro,
    color: colors.primary,
    textDecoration: "underline",
  },
});

type CertificatesPageProps = { certificates: Certificate[]; settings: SanitySettings };

export function CertificatesPage({ certificates, settings }: CertificatesPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={shell.page}>
      <PageHeader section="Certificates" name={fullName} />
      <SectionHeading label="Credentials" title="Certifications" />

      <View style={S.grid}>
        {certificates.map((cert) => (
          <View key={cert.id} style={S.card} wrap={false}>
            {cert.image ? (
              <Image src={cert.image} style={S.thumb} />
            ) : (
              <View style={S.noThumb}>
                <Text style={S.noThumbText}>No Image</Text>
              </View>
            )}
            <View style={S.cardBody}>
              <Text style={S.title}>{cert.title}</Text>
              <Text style={S.issuer}>{cert.issuer}</Text>
              {cert.issuedAt && <Text style={S.date}>{formatDate(cert.issuedAt)}</Text>}
              {cert.credentialUrl && (
                <Link src={cert.credentialUrl} style={S.credential}>
                  View Credential ↗
                </Link>
              )}
            </View>
          </View>
        ))}
      </View>

      <PageFooter name={fullName} />
    </Page>
  );
}
