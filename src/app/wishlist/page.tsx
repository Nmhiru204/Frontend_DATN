/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";

// ===== Kiểu dữ liệu từ BE (giống trang products) =====
type ApiBrand = { _id: string; TenTH: string };
type ApiCategory = { _id: string; TenLoai: string };
type ApiProduct = {
  _id: string;
  TenDH: string;
  Gia: number;
  SoLuong: number;
  ThuongHieu: ApiBrand | string;
  MaLoai: ApiCategory | string;
  images?: string[];
};

type UiProduct = {
  _id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
  category?: string;
  image?: string;
  raw: ApiProduct;
};

// ===== Helpers =====
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function adaptProduct(p: ApiProduct): UiProduct {
  const brand = typeof p.ThuongHieu === "string" ? undefined : p.ThuongHieu?.TenTH;
  const category = typeof p.MaLoai === "string" ? undefined : p.MaLoai?.TenLoai;
  const slug = `${slugify(p.TenDH)}-${p._id.slice(-6)}`;

  return {
    _id: p._id,
    slug,
    name: p.TenDH,
    price: p.Gia,
    quantity: p.SoLuong,
    brand,
    category,
    image: p.images?.[0],
    raw: p,
  };
}

export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<UiProduct[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔐 Lấy token từ localStorage
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          console.log("Wishlist: không có token → coi như chưa đăng nhập");
          setProducts([]);
          return;
        }

        // 1) Lấy danh sách id wishlist từ backend
        const res = await fetch(`${API_BASE}/api/wishlist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Wishlist API ${res.status}: ${text}`);
        }

        const json = await res.json();
        // hỗ trợ cả {data: [...]} và {wishlist: [...]}
        const rawIds: any[] = json.data || json.wishlist || [];
        const ids = rawIds.map((x) => String(x));

        console.log("Wishlist IDs from API:", ids);

        if (!ids.length) {
          setProducts([]);
          return;
        }

        // 2) Lấy toàn bộ product rồi lọc theo ids
        const resProd = await fetch(`${API_BASE}/products`, {
          method: "GET",
        });

        if (!resProd.ok) {
          const text = await resProd.text();
          throw new Error(`Products API ${resProd.status}: ${text}`);
        }

        const jsonProd = await resProd.json();
        if (!jsonProd?.success || !Array.isArray(jsonProd.data)) {
          throw new Error("Payload sản phẩm không hợp lệ");
        }

        const all: UiProduct[] = jsonProd.data.map((p: ApiProduct) =>
          adaptProduct(p)
        );

        const idSet = new Set(ids.map(String));
        const filtered = all.filter((p) => idSet.has(String(p._id)));

        console.log("Wishlist products:", filtered);

        setProducts(filtered);
      } catch (err: any) {
        console.error("Wishlist fetch error:", err);
        setError(err?.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold mb-2">Danh sách yêu thích</h1>
      <p className="text-sm text-gray-600 mb-6">
        {products.length} sản phẩm bạn đã đánh dấu ❤️
      </p>

      {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}

      {!loading && error && (
        <p className="text-red-500 whitespace-pre-wrap">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">Bạn chưa thêm sản phẩm nào vào yêu thích.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p as any} />
          ))}
        </div>
      )}
    </Container>
  );
}
