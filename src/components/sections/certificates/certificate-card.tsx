import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";

import { Certificate } from "@/types/certificate";
import { BlurImage } from "@/components/motion/blur-image";

type Props = {
  certificate: Certificate;
};

export function CertificateCard({ certificate }: Props) {
  return (
    <article className="group/card flex flex-col justify-between overflow-hidden rounded-none border border-border bg-card transition-colors duration-200 hover:border-foreground/40 shadow-xs">
      <div>
        <div className="relative aspect-video overflow-hidden border-b border-border bg-muted/40">
          {certificate.image ? (
            <BlurImage
              src={certificate.image}
              alt={certificate.title}
              fill
              className="object-cover grayscale contrast-105 transition-all duration-500 group-hover/card:grayscale-0 group-hover/card:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-border p-4 text-center">
              <div className="border border-border bg-card p-2 text-primary">
                <FileText className="size-6" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                [VERIFIED_CREDENTIAL]
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {certificate.issuer}
          </div>

          <h3 className="font-display text-lg font-bold tracking-tight text-foreground line-clamp-2">
            {certificate.title}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/10 p-4 font-mono text-xs">
        <span className="text-muted-foreground">
          {certificate.issuedAt}
        </span>

        <div className="flex items-center gap-3">
          {certificate.pdfUrl && (
            <Link
              href={certificate.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase text-primary transition-colors hover:underline underline-offset-4"
            >
              PDF
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
          {!certificate.pdfUrl && certificate.credentialUrl && (
            <Link
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase text-primary transition-colors hover:underline underline-offset-4"
            >
              Verify
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
