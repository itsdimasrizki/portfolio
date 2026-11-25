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
import { SvgFilters } from "@/components/effects/svg-filters";
import { AccentColorProvider } from "@/context/accent-color-context";
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var id=localStorage.getItem("portfolio_accent");var p={"gold":["#ffd460","#f6ad55","rgba(255, 212, 96, 0.25)"],"violet":["#8b5cf6","#a78bfa","rgba(139, 92, 246, 0.25)"],"cyan":["#06b6d4","#22d3ee","rgba(6, 182, 212, 0.25)"],"emerald":["#10b981","#34d399","rgba(16, 185, 129, 0.25)"],"orange":["#f97316","#fb923c","rgba(249, 115, 22, 0.25)"],"rose":["#f43f5e","#fb7185","rgba(244, 63, 94, 0.25)"],"red":["#ef4444","#f87171","rgba(239, 68, 68, 0.25)"]};var a=p[id]||p["gold"];var r=document.documentElement;r.style.setProperty("--accent-primary",a[0]);r.style.setProperty("--accent-secondary",a[1]);r.style.setProperty("--accent-glow",a[2]);r.setAttribute("data-accent",id||"gold");}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${spaceGrotesk.variable} ${silkscreen.variable} font-sans antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}
      >
        <AccentColorProvider>
          <MotionProvider>
            <SvgFilters />
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
        </AccentColorProvider>
      </body>
    </html>
  );
}
