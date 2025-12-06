/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { ChevronDown, Filter } from "lucide-react";
import { useCart } from "@/store/cart";

// ===== Kiểu dữ liệu từ BE =====
type ApiBrand = { _id: string; TenTH: string };
type ApiCategory = { _id: string; TenLoai: string };
type ApiProduct = {
  [x: string]: any;
  _id: string;
  TenDH: string;
  Gia: number;
  SoLuong: number;
  ThuongHieu: ApiBrand | string;
  MaLoai: ApiCategory | string;
  images?: string[];
};
type ApiCategoryItem = { _id: string; TenLoai: string };

// ===== Kiểu dữ liệu dùng cho ProductCard =====
export type UiProduct = {
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

// ===== Price ranges =====
const PRICE_RANGES = [
  { id: "all", label: "Tất cả giá", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "under-500k", label: "Dưới 500K", min: 0, max: 500_000 },
  { id: "500k-1m", label: "500K - 1M", min: 500_000, max: 1_000_000 },
  { id: "1m-2m", label: "1M - 2M", min: 1_000_000, max: 2_000_000 },
  { id: "over-2m", label: "Trên 2M", min: 2_000_000, max: Number.POSITIVE_INFINITY },
];

const ITEMS_PER_PAGE = 8;

// ===== Detect API base =====
function getApiBase() {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.magicwatchesstore.io.vn";

  // Localhost → tự động chuyển HTTPS → HTTP để tránh lỗi SSL
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return raw.replace("https://", "http://");
  }

  return raw;
}

function slugify(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function adaptProduct(p: ApiProduct): UiProduct {
  return {
    _id: p._id,
    slug: `${slugify(p.TenDH)}-${p._id.slice(-6)}`,
    name: p.TenDH,
    price: p.Gia,
    quantity: p.SoLuong,
    brand: typeof p.ThuongHieu === "object" ? p.ThuongHieu.TenTH : undefined,
    category: typeof p.MaLoai === "object" ? p.MaLoai.TenLoai : undefined,
    image: p.images?.[0],
    raw: p,
  };
}

async function fetchJson(endpoint: string) {
  const base = getApiBase();
  const url = `${base}${endpoint}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ Fetch error:", url, err);
    throw err;
  }
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<UiProduct[]>([]);
  const [allCategories, setAllCategories] = useState<ApiCategoryItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const addItem = useCart((s) => s.addItem);

  // ===== Fetch dữ liệu =====
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [jsonProducts, jsonCategories] = await Promise.all([
          fetchJson("/products"),
          fetchJson("/categories"),
        ]);

        if (!jsonProducts?.success || !Array.isArray(jsonProducts.data))
          throw new Error("Dữ liệu sản phẩm không hợp lệ");

        if (!jsonCategories?.success || !Array.isArray(jsonCategories.data))
          throw new Error("Dữ liệu danh mục không hợp lệ");

        setAllProducts(jsonProducts.data.map(adaptProduct));
        setAllCategories(jsonCategories.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ===== Filter + Sort =====
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Ẩn sản phẩm bị admin ẩn
    list = list.filter((p) => !p.raw.isHidden);

    // Ẩn theo danh mục ẩn
    const hiddenCats = allCategories
      .filter((c: any) => c.isHidden)
      .map((c) => c.TenLoai);
    list = list.filter((p) => !hiddenCats.includes(p.category || ""));

    // Lọc theo danh mục
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Lọc theo giá
    const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
    if (range) {
      list = list.filter(
        (p) => p.price >= range.min && p.price <= range.max
      );
    }

    // Sort giá
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [allProducts, allCategories, selectedCategory, selectedPriceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginated = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container className="py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6">

            {/* Danh mục */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-100">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Filter className="h-5 w-5 text-blue-600" /> Danh mục
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={selectedCategory === "all"}
                  onChange={() => setSelectedCategory("all")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">Tất cả sản phẩm</span>
              </label>

              {allCategories.map((cat) => (
                <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.TenLoai}
                    onChange={() => setSelectedCategory(cat.TenLoai)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{cat.TenLoai}</span>
                </label>
              ))}
            </div>

            {/* Lọc giá */}
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 border border-purple-100">
              <h3 className="mb-4 text-lg font-bold">💰 Lọc giá</h3>

              {PRICE_RANGES.map((r) => (
                <label key={r.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === r.id}
                    onChange={() => setSelectedPriceRange(r.id)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tất cả sản phẩm</h1>
              <p className="text-sm text-gray-600">{filteredProducts.length} sản phẩm</p>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border px-4 py-2 pr-8 rounded-lg"
              >
                <option value="popular">Phổ biến</option>
                <option value="price-low">Giá thấp → cao</option>
                <option value="price-high">Giá cao → thấp</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-600" />
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center text-red-600 whitespace-pre-wrap">{error}</div>
          ) : paginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map((p) => (
                <ProductCard key={p._id} product={p as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">Không tìm thấy sản phẩm</div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
