/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Search, ShoppingCart, User, Heart, Menu, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import Cookies from "js-cookie";

export default function Navbar() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const totalQty = useCart((s) => s.totalQty());

  const [user, setUser] = useState<any>(null); // ⭐ chứa thông tin user
  const [menuOpen, setMenuOpen] = useState(false);

  // ⭐ Fetch user info
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // Logout
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("role");
    alert("👋 Bạn đã đăng xuất!");
    router.push("/auth");
  };

  // Search
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = q.trim();
    router.push(keyword ? `/products?q=${encodeURIComponent(keyword)}` : "/products");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <Container className="flex h-20 items-center justify-between gap-6">

        {/* LEFT — Logo + Menu */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-black tracking-tight flex items-center">
            Magic <span className="ml-1 text-[#f97316]">Watches</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-700">
            <Link className="hover:text-black transition" href="/products">Sản phẩm</Link>
            <Link className="hover:text-black transition" href="/new">Tin Tức</Link>
            <Link className="hover:text-black transition" href="/about">Giới Thiệu</Link>

            {user?.role === "admin" && (
              <Link href="/admin" className="font-semibold text-[#f97316] hover:text-[#ea580c]">
                Trang quản trị
              </Link>
            )}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <form onSubmit={onSubmit} className="hidden md:block">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm đồng hồ..."
                className="w-80 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 pl-11 text-sm focus:border-black focus:ring-2 focus:ring-black/10"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
          </form>

          {/* Wishlist */}
          <Link href="/wishlist" className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100">
            <Heart className="h-5 w-5 text-gray-800" />
          </Link>

          {/* USER MENU */}
          {!user ? (
            <Link href="/auth" className="p-2 rounded-xl hover:bg-gray-100 transition">
              <User className="h-5 w-5 text-gray-800" />
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
              >
                {user.firstName} {user.lastName}
                <ChevronDown className="h-4 w-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border">
                  <Link
                    href="/order-history"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    📦 Lịch sử đơn hàng
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    👤 Tài khoản của tôi
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition">
            <ShoppingCart className="h-5 w-5 text-gray-800" />
            {totalQty > 0 && (
              <span className="absolute -right-1 -top-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-black text-white text-[10px] font-semibold px-1">
                {totalQty}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </Container>
    </header>
  );
}
