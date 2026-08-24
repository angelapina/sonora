import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAccount = pathname.startsWith("/cuenta");
  const isAdmin = pathname.startsWith("/admin");

  if (!req.auth && (isDashboard || isAccount || isAdmin)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isDashboard && role !== "MUSICIAN" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/cuenta/:path*", "/admin/:path*"],
};
