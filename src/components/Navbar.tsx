"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Search, ShoppingCart, User, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";

export default function Navbar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  // lấy tổng số lượng từ store (động)
  const totalQty = useCart((s) => s.totalQty());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = q.trim();
    router.push(keyword ? `/products?q=${encodeURIComponent(keyword)}` : "/products");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo + main nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-black tracking-tight">
            Magic<span className="text-[hsl(var(--mw-accent))]">Watches</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-gray-700 md:flex">
            <Link className="hover:text-black" href="/products">Sản phẩm</Link>
            <Link className="hover:text-black" href="/new">Tin Tức</Link>
            <Link className="hover:text-black" href="/about">Giới Thiệu</Link>
          </nav>
        </div>

        {/* Search + actions */}
        <div className="flex items-center gap-3">
          <form onSubmit={onSubmit} className="hidden md:block">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm đồng hồ..."
                className="w-80 rounded-2xl border border-gray-300 bg-white px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </form>

          <Link href="/wishlist" className="hidden rounded-xl p-2 hover:bg-gray-100 sm:inline-flex">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/auth" className="rounded-xl p-2 hover:bg-gray-100">
            <User className="h-5 w-5" />
          </Link>

          <Link href="/cart" className="relative rounded-xl p-2 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5" />
            {totalQty > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {totalQty}
              </span>
            )}
          </Link>
        </div>
      </Container>
    </header>
  );
}
