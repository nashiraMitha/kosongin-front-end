import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /* GEMBOK TOTAL JALUR ADMIN */
  // Jika ada yang mencoba akses halaman apa saja yang berawalan /admin (login maupun dashboard)
  if (pathname.startsWith("/admin")) {
    // Tendang paksa balik ke halaman utama user (/)
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Atur matcher agar mengawasi semua halaman di bawah folder admin
  matcher: [
    "/admin/:path*",
  ],
};