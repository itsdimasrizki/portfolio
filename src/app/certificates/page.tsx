import type { Metadata } from "next";

import { CertificatesList } from "@/components/sections/certificates/certificates-list";
import { getAllCertificates } from "@/services/certificate.service";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Certificates | Dimas Rizki",
  description:
    "Professional certifications earned by Dimas Rizki as a Fullstack Software Engineer.",
};

export default async function CertificatesPage() {
  const certificates = await getAllCertificates();

  return (
    <main>
      <CertificatesList certificates={certificates} />
    </main>
  );
}
