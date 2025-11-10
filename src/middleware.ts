import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Các đường public (cho phép vào mà không cần login)
  const publicPaths = ["/auth", "/_next", "/favicon.ico", "/api"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  // ❌ Nếu chưa có token và không phải public -> chuyển về /auth
  if (!token && !isPublic) {
    console.log("🚫 Chưa đăng nhập → /auth");
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // ✅ Nếu có token, kiểm tra role
  if (token) {
    try {
      const { payload }: any = await jwtVerify(token, secretKey);

      // Nếu cố vào admin mà không phải admin
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        console.log("🚫 Không phải admin → /");
        return NextResponse.redirect(new URL("/", req.url));
      }

      // ✅ Token hợp lệ, cho đi tiếp
      return NextResponse.next();
    } catch (err) {
      console.error("❌ Token lỗi hoặc hết hạn:", err);
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

// ✅ Áp dụng middleware cho tất cả trừ static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
