import Image from "next/image";
import Link from "next/link";

import { Certificate } from "@/types/certificate";

type Props = {
  certificate: Certificate;
};

export function CertificateCard({ certificate }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border">
      <div className="relative aspect-video">
        <Image
          src={certificate.image}
          alt={certificate.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-2 p-5">
        <h3 className="font-semibold">
          {certificate.title}
        </h3>

        <p className="text-sm text-muted-foreground">
          {certificate.issuer}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {certificate.issuedAt}
          </span>

          <Link
            href={certificate.credentialUrl ?? "#"}
            className="text-sm font-medium"
          >
            View Credential
          </Link>
        </div>
      </div>
    </article>
  );
}