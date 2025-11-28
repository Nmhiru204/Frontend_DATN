"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const orderId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("orderId")
      : null;

  const total =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("total")
      : null;

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4">
      <CheckCircle size={90} className="text-green-600 mb-4" />

      <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>

      <p className="text-gray-600 text-center mb-4">
        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.
      </p>

      {orderId && (
        <div className="mb-2 text-gray-800">
          <strong>Mã đơn hàng:</strong> {orderId}
        </div>
      )}

      {total && (
        <div className="mb-4 text-gray-800">
          <strong>Tổng thanh toán:</strong> {Number(total).toLocaleString("vi-VN")}₫
        </div>
      )}

      <div className="flex items-center gap-4 mt-4">
        <Link
          href="/"
          className="px-5 py-2 rounded-lg bg-black text-white font-medium hover:bg-opacity-80"
        >
          Về trang chủ
        </Link>

        <Link
          href="/orders"
          className="px-5 py-2 rounded-lg border border-gray-400 font-medium hover:bg-gray-100"
        >
          Xem đơn hàng
        </Link>
      </div>
    </div>
  );
}
