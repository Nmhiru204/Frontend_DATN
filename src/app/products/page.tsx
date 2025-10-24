/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import { ChevronDown, Filter, ShoppingCart } from "lucide-react"
import { useCart } from "@/store/cart"   // ✅ dùng store giỏ hàng

// ===== Kiểu dữ liệu từ BE =====
type ApiBrand = { _id: string; TenTH: string }
type ApiCategory = { _id: string; TenLoai: string }
type ApiProduct = {
  _id: string
  TenDH: string
  Gia: number
  SoLuong: number
  ThuongHieu: ApiBrand | string
  MaLoai: ApiCategory | string
  images?: string[]
}
type ApiCategoryItem = { _id: string; TenLoai: string }

// ===== Kiểu dữ liệu dùng cho ProductCard =====
export type UiProduct = {
  _id: string
  slug: string
  name: string
  price: number
  quantity: number
  brand?: string
  category?: string
  image?: string
  raw: ApiProduct
}

const PRICE_RANGES = [
  { id: "all", label: "Tất cả giá", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "under-500k", label: "Dưới 500K", min: 0, max: 500_000 },
  { id: "500k-1m", label: "500K - 1M", min: 500_000, max: 1_000_000 },
  { id: "1m-2m", label: "1M - 2M", min: 1_000_000, max: 2_000_000 },
  { id: "over-2m", label: "Trên 2M", min: 2_000_000, max: Number.POSITIVE_INFINITY },
]

const ITEMS_PER_PAGE = 8

// ===== Helpers =====
function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function adaptProduct(p: ApiProduct): UiProduct {
  const brand = typeof p.ThuongHieu === "string" ? undefined : p.ThuongHieu?.TenTH
  const category = typeof p.MaLoai === "string" ? undefined : p.MaLoai?.TenLoai
  const slug = `${slugify(p.TenDH)}-${p._id.slice(-6)}`
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
  }
}

// ======= Fallback fetch với nhiều endpoint + timeout =======
async function tryFetchJson(urls: string[]) {
  const errors: string[] = []

  for (const url of urls) {
    try {
      const controller = new AbortController()
      const to = setTimeout(() => controller.abort(), 3000)

      const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
        signal: controller.signal,
      })
      clearTimeout(to)

      if (!res.ok) {
        errors.push(`${url} → HTTP ${res.status}`)
        continue
      }
      return await res.json()
    } catch (e: any) {
      errors.push(`${url} → ${e?.name || "Error"}: ${e?.message || e}`)
    }
  }

  throw new Error(
    `Không gọi được API sau khi thử nhiều endpoint:\n` + errors.map((s) => "- " + s).join("\n")
  )
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allProducts, setAllProducts] = useState<UiProduct[]>([])
  const [allCategories, setAllCategories] = useState<ApiCategoryItem[]>([])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)

  // ✅ lấy addItem từ store (đây là hàm thật)
  const addItem = useCart((s) => s.addItem)

  // ===== Xây danh sách endpoint thử lần lượt =====
  const candidates = (() => {
    const baseFromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "")
    const list = new Set<string>()

    if (baseFromEnv) {
      list.add(`${baseFromEnv}/products`)
      list.add(`${baseFromEnv}/categories`)
    }

    if (typeof window !== "undefined") {
      const origin = window.location.origin // http://localhost:3000
      const guess5000 = origin.replace(":3000", ":5000")
      list.add(`${guess5000}/products`)
      list.add(`${guess5000}/categories`)
    }

    list.add(`http://localhost:5000/products`)
    list.add(`http://localhost:5000/categories`)

    list.add(`/api/products`)
    list.add(`/api/categories`)

    const arr = Array.from(list)
    const products = arr.filter((u) => /\/products$/.test(u))
    const categories = arr.filter((u) => /\/categories$/.test(u))
    return { products, categories }
  })()

  // ===== Fetch danh mục + sản phẩm từ BE =====
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)

        const [jsonProducts, jsonCategories] = await Promise.all([
          tryFetchJson(candidates.products),
          tryFetchJson(candidates.categories),
        ])

        if (!jsonProducts?.success || !Array.isArray(jsonProducts?.data))
          throw new Error("Payload sản phẩm không hợp lệ")

        if (!jsonCategories?.success || !Array.isArray(jsonCategories?.data))
          throw new Error("Payload danh mục không hợp lệ")

        setAllProducts(jsonProducts.data.map((p: ApiProduct) => adaptProduct(p)))
        setAllCategories(jsonCategories.data)
      } catch (e: any) {
        console.error("Fetch error detail:", e?.message || e)
        setError(e?.message || "Failed to fetch")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ===== Lọc / sắp xếp =====
  const filteredProducts = useMemo(() => {
    let list = [...allProducts]
    if (selectedCategory !== "all") list = list.filter((p) => p.category === selectedCategory)
    const price = PRICE_RANGES.find((r) => r.id === selectedPriceRange)
    if (price) list = list.filter((p) => p.price >= price.min && p.price <= price.max)
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price)
    return list
  }, [allProducts, selectedCategory, selectedPriceRange, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filteredProducts.slice(start, start + ITEMS_PER_PAGE)

  return (
    <Container className="py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar: Danh mục + Lọc giá */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Danh mục từ BE */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-100">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Filter className="h-5 w-5 text-blue-600" /> Danh mục
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={selectedCategory === "all"}
                    onChange={() => { setSelectedCategory("all"); setCurrentPage(1) }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Tất cả sản phẩm</span>
                </label>

                {allCategories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.TenLoai}
                      onChange={() => { setSelectedCategory(cat.TenLoai); setCurrentPage(1) }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{cat.TenLoai}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lọc giá */}
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 border border-purple-100">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="text-purple-600">💰</span> Lọc giá
              </h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((r) => (
                  <label key={r.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === r.id}
                      onChange={() => { setSelectedPriceRange(r.id); setCurrentPage(1) }}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main: Danh sách sản phẩm */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tất cả sản phẩm</h1>
              <p className="mt-1 text-sm text-gray-600">{filteredProducts.length} sản phẩm</p>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border border-gray-300 px-4 py-2 pr-8 rounded-lg"
              >
                <option value="popular">Phổ biến</option>
                <option value="price-low">Giá thấp → cao</option>
                <option value="price-high">Giá cao → thấp</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-600" />
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center text-red-600 whitespace-pre-wrap py-8">{error}</div>
          ) : paginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map((p) => (
                <div key={p._id} className="group">
                  <ProductCard product={p as any} />
                  {/* <button
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-semibold hover:bg-blue-700 transition"
                    onClick={() =>
                      addItem(
                        {
                          id: p._id,
                          name: p.name,
                          price: p.price,
                          image: p.image,
                          brand: p.brand,
                          category: p.category,
                        },
                        1
                      )
                    }
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Thêm vào giỏ
                  </button> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">Không tìm thấy sản phẩm</div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
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
  )
}
