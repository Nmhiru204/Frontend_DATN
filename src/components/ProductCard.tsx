"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";

type Props = {
  product: {
    _id: string;
    slug: string;
    name: string;
    price: number;
    brand?: string;
    category?: string;
    image?: string;
  };
};

export default function ProductCard({ product }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [loading, setLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Lấy wishlist từ API backend
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setWishlistIds(data.data);
          setLiked(data.data.includes(product._id));
        }
      } catch (err) {
        console.error("Fetch wishlist error:", err);
      }
    };

    fetchWishlist();
  }, [product._id]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("❗ Bạn cần đăng nhập!");

      const res = await fetch("http://localhost:5000/api/wishlist/toggle", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.action === "added") {
          setLiked(true);
          setWishlistIds((prev) => [...prev, product._id]);
        } else {
          setLiked(false);
          setWishlistIds((prev) => prev.filter((id) => id !== product._id));
        }
      }
    } catch (err) {
      alert("⚠️ Server error!");
    } finally {
      setLoading(false);
    }
  };

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: product._id, name: product.name, price: product.price, image: product.image, brand: product.brand, category: product.category }, 1);
  };

  return (
    <Link href={`/product/${product._id}`} className="card group overflow-hidden">
      <div className="relative w-full overflow-hidden bg-gray-100">
        <div className="relative aspect-square">
          <Image
            src={product.image || "/img/placeholder.webp"}
            alt={product.name}
            fill
            className="object-cover transiton-transform group-hover:scale-105"
          />
        </div>

        {/* ❤️ Nút thích */}
        <button
          onClick={handleToggleWishlist}
          disabled={loading}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow border border-gray-200 hover:border-red-500"
        >
          <Heart className={`h-5 w-5 transition ${liked ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
        </button>

        {/* 🛒 Nút thêm vào giỏ */}
        <button onClick={onAdd} className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition">
          <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
        </button>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-900">{product.name}</p>
        <p className="text-base font-semibold text-black">{product.price.toLocaleString("vi-VN")}₫</p>
      </div>
    </Link>
  );
}
