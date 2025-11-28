/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const token = Cookies.get("token");

  // Chuyển trạng thái EN → VI
  const textStatus = (status: string) => {
    switch (status) {
      case "pending": return "Chờ duyệt";
      case "confirmed": return "Đã xác nhận";
      case "shipped": return "Đang giao";
      case "delivered": return "Hoàn thành";
      case "canceled": return "Đã hủy";
      default: return status;
    }
  };

  // Style badge giống admin
  const badgeColor = (status: string) => {
    const map: any = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      canceled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  // Redirect nếu chưa login
  useEffect(() => {
    if (!token) router.push("/auth");
  }, [token, router]);

  // Fetch đơn hàng
  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setError("Không tải được lịch sử đơn hàng");
          return;
        }

        setOrders(data.data || []);
      } catch (err) {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <div className="p-10 text-xl">⏳ Đang tải...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        📦 Lịch sử đơn hàng
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 bg-white rounded-xl shadow border"
            >
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold text-lg">
                  Mã đơn: {order._id.slice(-8)}
                </h2>

                <span
                  className={`px-3 py-1 rounded-xl text-sm font-medium ${badgeColor(order.status)}`}
                >
                  {textStatus(order.status)}
                </span>
              </div>

              <div className="text-gray-600 mb-2">
                Ngày đặt:{" "}
                <b>
                  {format(new Date(order.createdAt), "dd/MM/yyyy - HH:mm", {
                    locale: vi,
                  })}
                </b>
              </div>

              <div className="text-gray-600 mb-4">
                Tổng tiền:{" "}
                <b className="text-lg text-orange-600">
                  {(order.TotalPrice || 0).toLocaleString("vi-VN")}₫
                </b>
              </div>

              <h3 className="font-medium mb-2">Sản phẩm:</h3>

              <ul className="space-y-2">
                {order.products?.map((item: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between text-gray-700"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
