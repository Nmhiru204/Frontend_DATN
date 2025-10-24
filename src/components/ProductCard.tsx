"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";

// Kiểu product khớp với UiProduct bạn dùng
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

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // không cho Link điều hướng khi bấm nút
    addItem(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
      },
      1
    );
  };

  return (
    <Link href={`/product/${product._id}`} className="card group overflow-hidden">
      <div className="relative w-full overflow-hidden bg-gray-100">
        {/* Ảnh sản phẩm */}
        <div className="relative aspect-square">
          <Image
            src={product.image || "/img/placeholder.webp"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        </div>

        {/* Overlay + nút thêm giỏ (hover) */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-black/0 opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:bg-black/15 group-hover:opacity-100">
          <button
            onClick={onAdd}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Thêm vào giỏ
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="line-clamp-2 text-sm font-medium text-gray-900">{product.name}</div>
        {(product.brand || product.category) && (
          <div className="mt-1 text-xs text-gray-500">
            {product.brand}{product.brand && product.category ? " • " : ""}{product.category}
          </div>
        )}
        <div className="mt-2 text-base font-semibold text-black">
          {product.price.toLocaleString("vi-VN")}₫
        </div>
      </div>
    </Link>
  );
}
