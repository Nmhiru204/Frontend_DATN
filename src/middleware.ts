/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // =======================================
  // 1️⃣ Cho phép đi qua TẤT CẢ public path
  // =======================================
  const publicPaths = [
    "/auth",
    "/",
    "/products",
    "/category",
    "/news",
    "/about",
    "/cart",
    "/order-history",
    "/payment-success",

    // API
    "/api",
    "/api/",

    // Static files
    "/_next",
    "/favicon.ico",
    "/img",
  ];

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // =======================================
  // 2️⃣ Chỉ chặn đường dẫn /admin/*
  // =======================================
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next(); // Không phải admin → cho đi qua
  }

  // =======================================
  // 3️⃣ YÊU CẦU TOKEN CHO ADMIN
  // =======================================
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("🚫 Không có token cookie → chuyển đến /auth");
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // =======================================
  // 4️⃣ Xác thực JWT
  // =======================================
  try {
    const { payload }: any = await jwtVerify(token, secretKey);

    if (payload.role !== "admin") {
      console.log("🚫 Token đúng nhưng KHÔNG PHẢI ADMIN → chuyển về /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log("❌ Token lỗi hoặc hết hạn → chuyển /auth");
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*", // Chỉ middleware ADMIN
  ],
};
