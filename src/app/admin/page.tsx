"use client";

import { LayoutDashboard, Package, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/auth");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <aside className="w-64 bg-black text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-8 tracking-tight">
          Admin<span className="text-gray-400">Panel</span>
        </h1>

        <nav className="flex flex-col gap-3 text-sm">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-800 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            Tổng quan
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-800 transition"
          >
            <Package className="h-4 w-4" />
            Quản lý sản phẩm
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-800 transition"
          >
            <Users className="h-4 w-4" />
            Quản lý người dùng
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-6">Bảng điều khiển</h2>
        <p>Xin chào, Admin!</p>
      </main>
    </div>
  );
}
