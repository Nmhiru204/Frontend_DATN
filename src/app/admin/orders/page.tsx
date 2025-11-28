/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal chi tiết
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // =========================
  // 🟢 Lấy danh sách đơn hàng
  // =========================
  const fetchOrders = async () => {
    try {
      const token = Cookies.get("token");

      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
        setFilteredOrders(json.data);
      }
    } catch (err) {
      console.error("❌ Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // 🔄 Lọc trạng thái
  // ===============================
  const applyFilter = (status: string) => {
    setStatusFilter(status);

    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === status));
    }
  };

  // ===============================
  // 🔄 Đổi trạng thái đơn
  // ===============================
  const updateStatus = async (orderId: string, newStatus: string) => {
    const ok = confirm(`Xác nhận chuyển trạng thái thành: ${newStatus}?`);
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const json = await res.json();
      if (json.success) {
        alert("✔ Cập nhật thành công!");
        fetchOrders();
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái:", err);
    }
  };

  // ===============================
  // 🔍 Modal xem chi tiết đơn
  // ===============================
  const openDetail = (order: any) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedOrder(null);
  };

  // Badge trạng thái đẹp
  const badge = (status: string) => {
    const base = "px-2 py-1 text-xs rounded-lg";

    const map: any = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      canceled: "bg-red-100 text-red-700",
    };

    return <span className={`${base} ${map[status]}`}>{textStatus(status)}</span>;
  };

  const textStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Hoàn thành";
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // UI
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Quản lý đơn hàng
      </h2>

      {/* ========================== */}
      {/* 📌 TABS LỌC TRẠNG THÁI     */}
      {/* ========================== */}
      <div className="flex gap-3 mb-6">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Chờ duyệt" },
          { key: "confirmed", label: "Đã xác nhận" },
          { key: "shipped", label: "Đang giao" },
          { key: "delivered", label: "Hoàn thành" },
          { key: "canceled", label: "Đã hủy" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => applyFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition 
              ${
                statusFilter === tab.key
                  ? "bg-orange-500 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">⏳ Đang tải...</p>}

      {!loading && filteredOrders.length === 0 && (
        <p className="text-gray-500">Không có đơn hàng nào.</p>
      )}

      {!loading && filteredOrders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-xl border">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-700">
                <th className="p-3 text-center w-10">#</th>
                <th className="p-3 ">Khách hàng</th>
                <th className="p-3 text-center w-28">Tổng tiền</th>
                <th className="p-3 text-center w-28">Thanh toán</th>
                <th className="p-3 text-center w-36">Trạng thái</th>
                <th className="p-3 text-center w-40">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((o: any, index: number) => (
                <tr
                  key={o._id}
                  className="border-t hover:bg-gray-50 transition text-sm h-14"
                >
                  <td className="text-center">{index + 1}</td>

                  <td className="p-3 font-medium">
                    {o.idUser?.firstName} {o.idUser?.lastName}
                    <div className="text-xs text-gray-500">{o.idUser?.email}</div>
                  </td>

                  <td className="text-center font-semibold text-orange-600">
                    {o.TotalPrice.toLocaleString()}₫
                  </td>

                  <td className="text-center">
                    {o.paymentMethod === "cod" ? "COD" : "Online"}
                  </td>

                  <td className="text-center">{badge(o.status)}</td>

                  <td className="p-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openDetail(o)}
                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                      >
                        Chi tiết
                      </button>

                      {o.status !== "delivered" && o.status !== "canceled" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              o._id,
                              o.status === "pending"
                                ? "confirmed"
                                : o.status === "confirmed"
                                ? "shipped"
                                : "delivered"
                            )
                          }
                          className="px-3 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow"
                        >
                          Tiến trình →
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal chi tiết */}
      {detailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h3>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Khách:</strong> {selectedOrder.idUser?.firstName}{" "}
                {selectedOrder.idUser?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.idUser?.email}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedOrder.address}
              </p>

              <h4 className="font-semibold mt-4 mb-2">Sản phẩm:</h4>

              <div className="border rounded-lg p-3 bg-gray-50">
                {selectedOrder.products.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between py-1 border-b last:border-b-0 text-sm"
                  >
                    <span>{p.name}</span>
                    <span>
                      {p.quantity} × {p.price.toLocaleString()}₫
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-right text-lg font-bold text-orange-600 mt-4">
                Tổng: {selectedOrder.TotalPrice.toLocaleString()}₫
              </p>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={closeDetail}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
