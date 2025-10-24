import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      console.log("🚫 Không có token, chuyển về /auth");
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      console.log("✅ Middleware decoded:", decoded);

      if (decoded.role !== "admin") {
        console.log("🚫 Không phải admin, chuyển /403");
        return NextResponse.redirect(new URL("/403", req.url));
      }
    } catch (err) {
      console.error("❌ Lỗi JWT:", err);
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
