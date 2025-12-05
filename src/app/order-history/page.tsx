/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
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
        console.log(data);
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

  // const handleXemChiTiet = (id) => {
  //   api.get(`api/orders/${id}`)
  //   .then((response) => {
  //     setOrderDetails(response.data);
  //     console.log(response.data);
  //     setIsPopUpOpen(true);
  //   })
  //   .catch((error) => {
  //     console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
  //   });
  // }
  const handleXemChiTiet = (id: string) => {
  const selectedOrder = orders.find((o) => o._id === id);
  if (selectedOrder) {
    setOrderDetails(selectedOrder);
    setIsPopUpOpen(true);
  }
};

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
              <div className="flex justify-between">
                <div className="text-gray-600 mb-4">
                  Tổng tiền:{" "}
                  <b className="text-lg text-orange-600">
                    {(order.TotalPrice || 0).toLocaleString("vi-VN")}₫
                  </b>
                </div>
                <button
  onClick={() => handleXemChiTiet(order._id)}
  className="px-4 py-0 h-10 text-sm font-medium text-white bg-blue-600 rounded-lg shadow 
             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 
             focus:ring-offset-1 transition duration-200"
>
  Xem chi tiết
</button>

              </div>
              {isPopUpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-none" onClick={() => setIsPopUpOpen(false)}>
          <div className="bg-white p-6 rounded shadow-lg w-[500px]"  onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>

            {/* Danh sách sản phẩm */}
            <ul className="space-y-3">
              {orderDetails.products.map((p) => (
                <li key={p._id} className="border-b pb-2">
                  <p className="font-semibold">{p.name}</p>
                  <p>Số lượng: {p.quantity}</p>
                  <p>Giá: {p.price.toLocaleString()} VND</p>
                  <p>
                    Tổng: {(p.price * p.quantity).toLocaleString()} VND
                  </p>
                </li>
              ))}
            </ul>

            {/* Phương thức thanh toán */}
            <div className="mt-4">
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {orderDetails.paymentMethod}
              </p>
              <p> <strong> Trạng thái đơn hàng: </strong> {textStatus(order.status)}</p>
              <p>
                <strong>Địa chỉ giao hàng:</strong> {orderDetails.address}
              </p>
            </div>

            <button
              onClick={() => setIsPopUpOpen(false)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

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
