/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { LayoutDashboard, Package, Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  // ============================
  // 📌 KIỂM TRA TOKEN + ROLE
  // ============================
  useEffect(() => {
    try {
      const cookies = document.cookie.split("; ").reduce((acc: any, c) => {
        const [key, ...v] = c.split("=");
        acc[key] = decodeURIComponent(v.join("="));
        return acc;
      }, {});

      const token = cookies["token"];

      if (!token) {
        router.replace("/auth");
        return;
      }

      const decoded: any = jwtDecode(token);

      if (decoded.role !== "admin") {
        router.replace("/");
        return;
      }

      setVerified(true);
    } catch {
      router.replace("/auth");
    }
  }, [router]);

  if (!verified) return null;

  // ============================
  // 📌 ADMIN LAYOUT CHÍNH
  // ============================
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar cố định */}
      <aside className="w-64 bg-[#0B0B0C] text-white flex flex-col p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-10 tracking-tight">
          Admin<span className="text-orange-400">Panel</span>
        </h1>

        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition">
            <LayoutDashboard className="h-4 w-4" />
            Tổng quan
          </Link>

          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition">
            <Package className="h-4 w-4" />
            Quản lý danh mục
          </Link>

          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition">
            <Package className="h-4 w-4" />
            Quản lý sản phẩm
          </Link>

          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition">
            <Users className="h-4 w-4" />
            Quản lý người dùng
          </Link>

          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 transition">
            <Users className="h-4 w-4" />
            Quản lý đơn hàng
          </Link>
        </nav>

        <button
          onClick={() => {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            router.push("/auth");
          }}
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition text-sm"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </aside>

      {/* Phần nội dung bên phải */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
