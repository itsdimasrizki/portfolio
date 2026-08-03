import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { getPortfolioPdfData } from "@/services/pdf.service";
import { PortfolioPdf } from "@/pdf/portfolio-pdf";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    // 1. Fetch all Sanity data
    const data = await getPortfolioPdfData();

    // 2. Render PDF to buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(PortfolioPdf, { data }) as ReactElement<DocumentProps>
    );

    // 3. Stream PDF to browser
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Dimas-Rizki-Portfolio.pdf"',
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
