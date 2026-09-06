import type { Metadata } from "next";

import { CertificatesList } from "@/components/sections/certificates/certificates-list";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import { getAllCertificates } from "@/services/certificate.service";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  return {
    title: messages["meta.certificates.title"],
    description: messages["meta.certificates.description"],
  };
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const certificates = await getAllCertificates(locale as Locale);

  return (
    <main>
      <CertificatesList certificates={certificates} locale={locale as Locale} />
    </main>
  );
}
