import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_job_hub_jwt_key_2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin/jobs and its subroutes
  if (pathname.startsWith("/admin/jobs")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, secretKey);
      if (!payload || payload.isAdmin !== true) {
        throw new Error("Invalid payload");
      }
    } catch {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect /admin to /admin/jobs if authenticated, or /admin/login if not
  if (pathname === "/admin") {
    const token = req.cookies.get("admin_token")?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secretKey);
        if (payload && payload.isAdmin === true) {
          return NextResponse.redirect(new URL("/admin/jobs", req.url));
        }
      } catch {}
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/jobs/:path*"],
};
