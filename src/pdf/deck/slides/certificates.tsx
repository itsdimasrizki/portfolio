/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { Slide, SlideHeader } from "../primitives";
import { colors, type } from "../theme";
import { truncate, formatDate } from "../layout";
import type { Certificate } from "@/types/certificate";

/**
 * Menampilkan 2–3 sertifikat per halaman agar menyerupai CertificateGrid (2–3 kolom)
 * di web tanpa memotong daftar sertifikat.
 */
export function CertificatesSlide({
  certificates,
  images,
  pageIndex,
  totalPages,
}: {
  certificates: Certificate[];
  images: Record<string, string | undefined>;
  pageIndex: number;
  totalPages: number;
}) {
  const count = certificates.length;
  const twoCol = count <= 2;
  const cardWidth = twoCol ? 420 : 272;
  const imageHeight = twoCol ? 196 : 154;
  const gap = 24;

  const eyebrow =
    totalPages > 1
      ? `credentials — page ${pageIndex + 1} / ${totalPages}`
      : "credentials";

  return (
    <Slide tone="subtle">
      <SlideHeader tone="subtle" eyebrow={eyebrow} />
      <View style={{ flexDirection: "row" }}>
        {certificates.map((certificate, i) => {
          const img = images[certificate.id];
          const issued = formatDate(certificate.issuedAt) ?? certificate.issuedAt;
          const linkHref = certificate.pdfUrl ?? certificate.credentialUrl;
          const linkLabel = certificate.pdfUrl ? "PDF" : certificate.credentialUrl ? "Verify" : undefined;

          return (
            <View
              key={certificate.id}
              style={{
                width: cardWidth,
                height: 384,
                marginRight: i < count - 1 ? gap : 0,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                overflow: "hidden",
                justifyContent: "space-between",
              }}
            >
              {/* Top: Thumbnail + Issuer + Title */}
              <View>
                <View
                  style={{
                    width: cardWidth,
                    height: imageHeight,
                    borderBottomWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.secondary,
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {img ? (
                    <Image
                      src={img}
                      style={{ width: cardWidth, height: imageHeight, objectFit: "cover" }}
                    />
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: colors.accentBorder,
                          backgroundColor: colors.accentSoft,
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ ...type.micro, color: colors.accent }}>CERT</Text>
                      </View>
                      <Text style={{ ...type.micro, color: colors.fgMuted }}>
                        [VERIFIED_CREDENTIAL]
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      ...type.micro,
                      color: colors.fgMuted,
                      textTransform: "uppercase",
                    }}
                  >
                    {truncate(certificate.issuer, twoCol ? 42 : 30)}
                  </Text>
                  <Text
                    style={{
                      ...type.h3,
                      fontSize: twoCol ? 17 : 15,
                      color: colors.fg,
                      marginTop: 8,
                    }}
                  >
                    {truncate(certificate.title, twoCol ? 96 : 74)}
                  </Text>
                </View>
              </View>

              {/* Footer: Issued Date + PDF / Verify Link (matches web CertificateCard) */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTopWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceSubtle,
                  paddingHorizontal: 16,
                  paddingVertical: 11,
                }}
              >
                <Text style={{ ...type.small, color: colors.fgMuted }}>
                  {issued ?? "Verified"}
                </Text>
                {linkHref && linkLabel && (
                  <Link src={linkHref} style={{ textDecoration: "none" }}>
                    <Text style={{ ...type.micro, fontWeight: 700, color: colors.accent }}>
                      {`${linkLabel} ->`}
                    </Text>
                  </Link>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </Slide>
  );
}
