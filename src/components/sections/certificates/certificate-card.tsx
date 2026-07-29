import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";

import { Certificate } from "@/types/certificate";
import { BlurImage } from "@/components/motion/blur-image";

type Props = {
  certificate: Certificate;
};

export function CertificateCard({ certificate }: Props) {
  return (
    <article className="group/card overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        {certificate.image ? (
          <BlurImage
            src={certificate.image}
            alt={certificate.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-teal-950/20 via-card to-muted p-4 text-center transition-transform duration-500 ease-out group-hover/card:scale-[1.03]">
            <div className="rounded-full bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <FileText className="size-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              PDF Certificate
            </span>
            <p className="line-clamp-1 max-w-[85%] text-xs text-muted-foreground">
              {certificate.title}
            </p>
          </div>
        )}
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

          <div className="flex items-center gap-3">
            {certificate.pdfUrl && (
              <Link
                href={certificate.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View PDF
                <ExternalLink className="size-3.5" />
              </Link>
            )}
            {!certificate.pdfUrl && certificate.credentialUrl && (
              <Link
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View Credential
                <ExternalLink className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}