/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";

// ===== types khớp BE của bạn =====
type ApiBrand = { _id: string; TenTH: string; Logo?: string };
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

// ===== helpers =====
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

function adaptProduct(p: ApiProduct) {
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

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.data ?? null;
  } catch {
    return null;
  }
}

async function getHomeData() {
  const [products, brands] = await Promise.all([
    fetchJson<ApiProduct[]>(`${API_BASE}/products`),
    fetchJson<ApiBrand[]>(`${API_BASE}/brands`),
  ]);

  // fallback mảng rỗng nếu BE chưa có
  const list = Array.isArray(products) ? products : [];
  const brandList = Array.isArray(brands) ? brands : [];

  // chọn 8 sản phẩm đầu làm “bán chạy”, 6 tiếp theo làm “nổi bật”
  const bestSellers = list.slice(0, 8).map(adaptProduct);
  const featured = list.slice(8, 14).map(adaptProduct);

  // lấy 3 brand đầu (nếu muốn khác, thay .slice(0, 3))
  const topBrands = brandList.slice(0, 5);

  return { bestSellers, featured, topBrands };
}

export default async function HomePage() {
  const { bestSellers, featured, topBrands } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white">
        <Container className="flex flex-col items-center gap-6 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Mẫu đẹp hot – Xu hướng 2025
            </h1>
            <p className="text-gray-600">
              Sưu tập đồng hồ bán chạy nhất. Ưu đãi hấp dẫn cho mùa lễ.
            </p>
            <div className="flex gap-3">
              <a className="btn-primary" href="/products">Mua ngay</a>
              <a className="btn-outline" href="#banchay">Khám phá</a>
            </div>
          </div>

          <Image
            src="/img/1.webp"
            alt="Hero watch"
            width={640}
            height={800}
            className="mx-auto h-auto w-full max-w-md rounded-3xl shadow-2xl"
            priority
          />
        </Container>
      </section>

      {/* Best sellers (động) */}
      <section id="banchay" className="mt-10">
        <Container>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Đồng hồ bán chạy</h2>
            <a href="/products" className="text-sm text-gray-600 hover:text-black">
              Xem tất cả
            </a>
          </div>

          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((p) => (
                <ProductCard key={p._id} product={p as any} />
              ))}
            </div>

          ) : (
            <div className="card p-6 text-center text-gray-500">
              Chưa có sản phẩm — vui lòng thêm vào MongoDB.
            </div>
          )}
        </Container>
      </section>

      {/* Banner giữa trang */}
      <section className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-100">
        <Container className="py-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            🎁 Ưu đãi tháng này – Giảm đến 30%
          </h2>
          <p className="mb-6 text-gray-600">
            Đặt mua ngay để nhận ưu đãi độc quyền và quà tặng từ TimeWatch.
          </p>
          <a href="/products" className="btn-primary">Xem khuyến mãi</a>
        </Container>
      </section>

      {/* Featured (động) */}
      <section id="noibat" className="mt-16">
        <Container>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Nổi bật</h2>
            <a href="/products" className="text-sm text-gray-600 hover:text-black">
              Xem tất cả
            </a>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p as any} />
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center text-gray-500">
              Chưa đủ dữ liệu để hiển thị mục này.
            </div>
          )}
        </Container>
      </section>

      {/* Brands (động từ BE) */}
      <section className="mt-14 mb-20">
        <Container>
          <div className="mb-4 text-center text-lg font-semibold">
            Các thương hiệu đồng hồ
          </div>

          {topBrands.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {topBrands.map((b) => (
                <a
                  key={b._id}
                  href={`/products?brand=${encodeURIComponent(b.TenTH)}`}
                  className="group card flex items-center gap-3 p-3 transition hover:shadow-lg"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                    {b.Logo ? (
                      <Image src={b.Logo} alt={b.TenTH} fill className="object-contain p-2" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-500">No Logo</div>
                    )}
                  </div>
                  <div className="text-sm font-semibold group-hover:underline">{b.TenTH}</div>
                </a>
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center text-gray-500">
              Chưa có thương hiệu — thêm data trong collection <b>brands</b>.
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
