"use client";

import Container from "@/components/Container";
import Image from "next/image";
import { useCart } from "@/store/cart";

export default function CartPage() {
  const { items, inc, dec, remove, totalPrice, totalQty, clear } = {
    items: useCart((s) => s.items),
    inc: useCart((s) => s.inc),
    dec: useCart((s) => s.dec),
    remove: useCart((s) => s.remove),
    totalPrice: useCart((s) => s.totalPrice),
    totalQty: useCart((s) => s.totalQty),
    clear: useCart((s) => s.clear),
  };

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Danh sách sản phẩm */}
        <div className="space-y-4 lg:col-span-2">
          {items.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">
              Giỏ hàng trống. Hãy thêm vài sản phẩm nhé!
            </div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="card flex items-center gap-4 p-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={it.image || "/img/placeholder.webp"}
                    alt={it.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">
                    {it.brand && `${it.brand} • `}{it.category || ""}
                  </div>
                </div>

                {/* Nút - / + trắng–đen */}
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Giảm số lượng"
                    className="h-8 w-8 rounded-full border border-gray-300 text-gray-700 hover:bg-black hover:text-white transition"
                    onClick={() => dec(it.id)}
                  >
                    −
                  </button>
                  <div className="w-10 text-center">{it.qty}</div>
                  <button
                    aria-label="Tăng số lượng"
                    className="h-8 w-8 rounded-full border border-gray-300 text-gray-700 hover:bg-black hover:text-white transition"
                    onClick={() => inc(it.id)}
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right font-semibold">
                  {(it.price * it.qty).toLocaleString("vi-VN")}₫
                </div>

                <button
                  className="ml-2 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 transition"
                  onClick={() => remove(it.id)}
                >
                  Xóa
                </button>
              </div>
            ))
          )}
        </div>

        {/* Tóm tắt đơn hàng */}
        <aside className="card h-fit p-5">
          <div className="mb-3 text-lg font-semibold">Tóm tắt đơn hàng</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Số lượng</span><span>{totalQty()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{totalPrice().toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between">
              <span>Vận chuyển</span><span>Miễn phí</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Tổng</span>
              <span>{totalPrice().toLocaleString("vi-VN")}₫</span>
            </div>
          </div>

          <button className="mt-4 w-full rounded-lg bg-black px-4 py-2 font-semibold text-white hover:opacity-90 transition">
            Đặt hàng
          </button>
          {items.length > 0 && (
            <button
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition"
              onClick={clear}
            >
              Xóa giỏ hàng
            </button>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Bằng cách đặt hàng, bạn đồng ý với điều khoản & chính sách của chúng tôi.
          </p>
        </aside>
      </div>
    </Container>
  );
}
