import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";

type CTAProps = {
  cvUrl?: string | null;
  locale: Locale;
};

export function CTA({ cvUrl, locale }: CTAProps) {
  const messages = getMessages(locale);

  return (
    <Section>
      <Container>
        <Reveal>
          <div className="border border-border bg-card px-8 py-14 text-center lg:px-16 rounded-none shadow-xs">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-primary" />
              <span>{messages["section.contact.eyebrow"] || "CONNECT"}</span>
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl text-foreground">
              {messages["section.contact.title"]}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {messages["section.contact.description"]}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-none px-6 font-mono text-xs uppercase tracking-wider">
                <Link href={localeHref(locale, "/contact")}>
                  {messages["cta.letsConnect"] || "Get in Touch"}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-none border-border px-6 font-mono text-xs uppercase tracking-wider">
                <a
                  href={cvUrl ?? "/resume.pdf"}
                  download
                  target={cvUrl ? "_blank" : undefined}
                  rel={cvUrl ? "noopener noreferrer" : undefined}
                >
                  {messages["cta.downloadCv"]}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
