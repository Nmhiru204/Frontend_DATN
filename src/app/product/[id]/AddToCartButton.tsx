"use client";

import { useCart } from "@/store/cart";

export default function AddToCartButton({
  item,
}: {
  item: {
    id: string;
    name: string;
    price: number;
    image?: string;
    brand?: string;
    category?: string;
    qty?: number; // nhận từ trang chi tiết (nếu không có sẽ mặc định = 1)
  };
}) {
  const addItem = useCart((s) => s.addItem);

  return (
    <button
      onClick={() => addItem(item, item.qty || 1)}
      className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 font-semibold text-white hover:opacity-90 transition"
    >
      Thêm vào giỏ hàng
    </button>
  );
}
