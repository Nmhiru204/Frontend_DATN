"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      // 🔍 Lấy token từ cookie
      const cookies = document.cookie.split("; ").reduce((acc: any, c) => {
        const [key, ...v] = c.split("=");
        acc[key] = decodeURIComponent(v.join("="));
        return acc;
      }, {});

      const token = cookies["token"];

      if (!token) {
        alert("⚠️ Chưa đăng nhập!");
        router.replace("/auth");
        return;
      }

      // 🧩 Giải mã token để lấy role
      const decoded: any = jwtDecode(token);
      const role = decoded.role;

      if (role === "admin") {
        setVerified(true);
      } else {
        alert("🚫 Bạn không có quyền truy cập trang này!");
        router.replace("/");
      }
    } catch (err) {
      console.error("❌ Lỗi xác thực:", err);
      router.replace("/auth");
    }
  }, [router]);

  if (!verified) return null;

  return <>{children}</>;
}