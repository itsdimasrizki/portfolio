import type { Metadata } from "next";

import { CertificatesList } from "@/components/sections/certificates/certificates-list";

export const metadata: Metadata = {
  title: "Certificates | Dimas Rizki",
  description:
    "Professional certifications earned by Dimas Rizki as a Fullstack Software Engineer.",
};

export default function CertificatesPage() {
  return (
    <main>
      <CertificatesList />
    </main>
  );
}
