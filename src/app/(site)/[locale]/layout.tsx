import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import localFont from "next/font/local";

import "../../globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ParticleCanvas } from "@/components/effects/particle-canvas";
import { FluidCursor } from "@/components/effects/fluid-cursor";
import { getSiteSettings } from "@/services/settings.service";
import { getMessages } from "@/i18n/dictionary";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/i18n/locale";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    {
      path: "../../../../public/fonts/SpaceGrotesk-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/SpaceGrotesk-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/SpaceGrotesk-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

const silkscreen = localFont({
  src: "../../../../public/fonts/Silkscreen-Regular.ttf",
  weight: "400",
  variable: "--font-silkscreen",
  display: "swap",
});

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

  const { cvUrl, socialLinks, contactInfo } = await getSiteSettings(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${spaceGrotesk.variable} ${silkscreen.variable} font-sans antialiased bg-background text-foreground`}
      >
        <MotionProvider>
          <ParticleCanvas />
          <FluidCursor />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar cvUrl={cvUrl} locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer
              locale={locale}
              socialLinks={socialLinks}
              contactInfo={contactInfo}
            />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
