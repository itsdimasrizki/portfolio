import Link from "next/link";

import { Certificate } from "@/types/certificate";
import { BlurImage } from "@/components/motion/blur-image";

type Props = {
  certificate: Certificate;
};

export function CertificateCard({ certificate }: Props) {
  return (
    <article className="group/card overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <BlurImage
          src={certificate.image}
          alt={certificate.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
        />
      </div>

      <div className="space-y-2 p-6">
        <h3 className="font-semibold tracking-tight transition-colors duration-200">
          {certificate.title}
        </h3>

        <p className="text-sm text-muted-foreground">
          {certificate.issuer}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            {certificate.issuedAt}
          </span>

          <Link
            href={certificate.credentialUrl ?? "#"}
            className="text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          >
            View Credential
          </Link>
        </div>
      </div>
    </article>
  );
}