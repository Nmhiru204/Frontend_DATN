/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Container from "@/components/Container";
import AddToCartButton from "./AddToCartButton";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${base}/products/${params.id}`, { cache: "no-store" });
        if (!res.ok) return notFound();

        const json = await res.json();
        if (!json?.success || !json?.data) return notFound();

        const p = json.data;
        const prod = {
          id: p._id,
          name: p.TenDH,
          price: p.Gia,
          image: p.images?.[0] ?? "/img/placeholder.webp",
          brand: typeof p.ThuongHieu === "object" ? p.ThuongHieu?.TenTH : "",
          category: typeof p.MaLoai === "object" ? p.MaLoai?.TenLoai : "",
          qty: 1,
        };
        setProduct(prod);

        // Lấy sản phẩm liên quan theo danh mục
        const rel = await fetch(`${base}/products`);
        const relJson = await rel.json();
        if (relJson?.success && Array.isArray(relJson.data)) {
          const filtered = relJson.data
            .filter((x: any) => x._id !== p._id && x.MaLoai?._id === p.MaLoai?._id)
            .slice(0, 4);
          setRelated(filtered);
        }
      } catch (err) {
        console.error("Lỗi fetch chi tiết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải sản phẩm...</div>;
  if (!product) return notFound();

  return (
    <Container className="py-12 bg-white">
      {/* Chi tiết sản phẩm */}
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Ảnh */}
        <div className="flex justify-center items-center bg-gray-50 rounded-2xl shadow-md p-6">
          <div className="relative w-[80%] aspect-square overflow-hidden rounded-xl group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>


        {/* Thông tin */}
        <div className="space-y-5">
          <div className="text-sm text-gray-500">
            Trang chủ / Nam / <span className="text-gray-700">{product.name}</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>

          {product.brand && (
            <p className="text-gray-700">
              Thương hiệu: <span className="font-medium">{product.brand}</span>
            </p>
          )}

          <p className="text-sm text-gray-600">
            Mã: <span className="text-gray-800 font-semibold">ORIENT-BAMBINO</span>
          </p>

          <p className="text-3xl font-bold text-orange-600">
            {product.price.toLocaleString("vi-VN")}đ
          </p>

          <ul className="text-gray-700 space-y-1 text-sm">
            <li>• Thép không gỉ</li>
            <li>• Kính cứng</li>
            <li>• Chống nước 50m</li>
            <li>• Kích thước 42mm</li>
          </ul>

          <p className="text-gray-600 text-sm leading-relaxed pt-2">
            Mẫu đồng hồ đa dụng với thiết kế cổ điển, độ bền cao và nhiều tính năng tiện ích cho sử dụng hằng ngày.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <AddToCartButton item={product} />
            <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-800 font-medium hover:bg-gray-50 transition">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Sản phẩm liên quan
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div
                key={item._id}
                className="group border border-gray-200 rounded-lg shadow-sm hover:shadow-md bg-white transition overflow-hidden relative"
              >
                {/* Ảnh */}
                <div className="aspect-square relative bg-gray-50 overflow-hidden">
                  <Image
                    src={item.images?.[0] ?? "/img/placeholder.webp"}
                    alt={item.TenDH}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Nút Thêm giỏ hàng (hover mới hiện) */}
                  <button
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => console.log('Thêm vào giỏ:', item.TenDH)}
                  >
                    <AddToCartButton item={product} />
                  </button>
                </div>

                {/* Thông tin */}
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.TenDH}
                  </p>
                  <p className="text-orange-600 font-semibold text-sm">
                    {item.Gia?.toLocaleString("vi-VN")}đ
                  </p>

                  {/* Nút xem sản phẩm (luôn hiển thị) */}
                  <button
                    onClick={() => (window.location.href = `/product/${item._id}`)}
                    className="w-full text-sm font-medium px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                  >
                    👁 Xem sản phẩm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </Container>
  );
}
