import { Certificate } from "@/types/certificate";
import { CertificateCard } from "./certificate-card";

type CertificateGridProps = {
  certificates: Certificate[];
};

export function CertificateGrid({ certificates }: CertificateGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {certificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} />
      ))}
    </div>
  );
}
