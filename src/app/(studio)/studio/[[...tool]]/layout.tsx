export const metadata = {
  title: "Portfolio CMS",
};

/**
 * Root layout kedua. Sengaja TIDAK mengimpor globals.css: Sanity Studio
 * membawa gayanya sendiri, dan preflight Tailwind mengganggu tampilannya.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
