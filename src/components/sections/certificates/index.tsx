import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import type { Certificate } from "@/types/certificate";

import { CertificateGrid } from "./certificate-grid";

type Props = {
  certificates: Certificate[];
  locale: Locale;
};

export function FeaturedCertificates({ certificates, locale }: Props) {
  const messages = getMessages(locale);

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow={messages["section.featuredCertificates.eyebrow"]}
            title={messages["section.featuredCertificates.title"]}
            description={messages["section.featuredCertificates.description"]}
            action={
              <Button asChild variant="ghost">
                <Link href={localeHref(locale, "/certificates")}>
                  {messages["cta.viewAll"]}
                </Link>
              </Button>
            }
          />
        </Reveal>

        <div className="mt-12">
          <CertificateGrid certificates={certificates} />
        </div>
      </Container>
    </Section>
  );
}
