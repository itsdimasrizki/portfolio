import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getSiteSettings } from "@/services/settings.service";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dimas Rizki | Fullstack Software Engineer",
  description:
    "Portfolio website of Dimas Rizki showcasing projects, experience, and certifications.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { cvUrl } = await getSiteSettings();

  return (
    <html lang="en">
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