import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    // 1. Verify Secret token if set in environment
    if (secret) {
      const authHeader = req.headers.get("authorization");
      const urlSecret = req.nextUrl.searchParams.get("secret");
      const customHeaderSecret = req.headers.get("x-sanity-secret");

      const tokenProvided =
        urlSecret ||
        customHeaderSecret ||
        (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

      if (tokenProvided !== secret) {
        // Also support next-sanity parseBody signature verification
        const { isValidSignature } = await parseBody<{ _type?: string }>(req, secret);
        if (!isValidSignature) {
          return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
        }
      }
    }

    // 2. Extract payload to target specific document types if needed
    let body: { _type?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Body might be empty or already parsed
    }

    const docType = body._type;

    if (docType) {
      revalidateTag(docType, "default");
    }
    
    // Revalidate global 'sanity' tag and root layout cache
    revalidateTag("sanity", "default");
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      target: docType ?? "all",
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error revalidating", error: errorMessage }, { status: 500 });
  }
}
