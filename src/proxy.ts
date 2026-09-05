import { NextResponse, type NextRequest } from "next/server";

import { isLocale, resolveLocale } from "@/i18n/locale";

const HAS_EXTENSION = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Studio adalah aplikasi tersendiri, /api bukan halaman, dan berkas statis
  // tidak punya versi bahasa. Penjagaan ini digandakan di `matcher` di bawah;
  // keduanya sengaja ada supaya salah satu saja sudah cukup menahan.
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    HAS_EXTENSION.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isLocale(pathname.split("/")[1])) {
    return NextResponse.next();
  }

  const locale = resolveLocale(
    request.cookies.get("NEXT_LOCALE")?.value,
    request.headers.get("accept-language") ?? undefined,
  );

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|studio|.*\\..*).*)"],
};
