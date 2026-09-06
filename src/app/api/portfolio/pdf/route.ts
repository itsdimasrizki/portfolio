import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/locale";
import { getPortfolioPdfData } from "@/services/pdf.service";
import { PortfolioPdf } from "@/pdf/portfolio-pdf";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    // Nilai lang yang tidak dikenal jatuh ke default, bukan melempar error:
    // tautan yang salah ketik tetap menghasilkan deck.
    const lang = new URL(request.url).searchParams.get("lang") ?? undefined;
    const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

    // 1. Fetch all Sanity data
    const data = await getPortfolioPdfData(locale);

    // 2. Render PDF to buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(PortfolioPdf, { data }) as ReactElement<DocumentProps>
    );

    // 3. Stream PDF to browser
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Dimas-Rizki-Portfolio-Deck-${locale.toUpperCase()}.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
