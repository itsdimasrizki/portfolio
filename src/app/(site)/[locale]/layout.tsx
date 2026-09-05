import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";

import "../../globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getSiteSettings } from "@/services/settings.service";
import { getMessages } from "@/i18n/dictionary";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/i18n/locale";

const geistSans = Geist({ subsets: ["latin"] });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    title: messages["meta.home.title"],
    description: messages["meta.home.description"],
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Segmen bahasa yang tidak dikenal (mis. /jv/about) harus 404, bukan
  // diam-diam menampilkan bahasa default.
  if (!isLocale(locale)) notFound();

  const { cvUrl } = await getSiteSettings();

  return (
    <html lang={locale}>
      <body className={`${geistSans.className} antialiased`}>
        <MotionProvider>
          <Navbar cvUrl={cvUrl} />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
