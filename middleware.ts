import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;

  // ── Admin routes: ADMIN only ──────────────────────────────────────────────
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, req.nextUrl.origin)
      );
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    if (nextUrl.pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // ── Protected customer routes ─────────────────────────────────────────────
  const protectedPaths = ["/cart", "/checkout", "/orders", "/profile"];
  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, req.nextUrl.origin)
    );
  }

  // ── Redirect logged-in users away from auth pages ─────────────────────────
  const authPaths = ["/login", "/register"];
  if (isLoggedIn && authPaths.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Skip Next.js internals and static files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts).*)",
  ],
};
