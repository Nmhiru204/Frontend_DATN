/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Pie,
  Cell,
  PieChart,
} from "recharts";

export default function AdminDashboard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ============================
  // FETCH DATA
  // ============================
  const fetchAll = async () => {
    try {
      const [catRes, prodRes, orderRes, userRes] = await Promise.all([
        fetch("http://localhost:5000/categories"),
        fetch("http://localhost:5000/products"),
        fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const cats = await catRes.json();
      setCategories(cats.success ? cats.data : []);

      const prods = await prodRes.json();
      setProducts(prods.success ? prods.data : []);

      const ords = await orderRes.json();
      setOrders(ords.success ? ords.data : []);

      const usrs = await userRes.json();
      setUsers(usrs.success ? usrs.data : []);

    } catch (err) {
      console.error("❌ Lỗi tải dashboard:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ============================
  // 1) Sản phẩm theo danh mục
  // ============================
  const getProductCategoryId = (p: any): string | null => {
    if (p.MaLoai && typeof p.MaLoai === "object" && p.MaLoai._id)
      return String(p.MaLoai._id);

    if (typeof p.MaLoai === "string") return p.MaLoai;

    return null;
  };

  const productByCategory = categories.map((cat) => {
    const total = products.filter(
      (p) => getProductCategoryId(p) === String(cat._id)
    ).length;

    return { name: cat.TenLoai, total };
  });

  // ============================
  // 2) Đơn hàng theo tháng
  // ============================
  const orderByMonth = Array.from({ length: 12 }, (_, idx) => idx + 1).map((m) => {
    const total = orders.filter((o) => {
      if (!o.createdAt) return false;
      const d = new Date(o.createdAt);
      return d.getMonth() + 1 === m;
    }).length;

    return { month: `T${m}`, total };
  });

  // ============================
  // 3) USERS STATISTICS
  // ============================

  const totalAdmin = users.filter((u) => u.role === "admin").length;
  const totalUser = users.filter((u) => u.role === "user").length;

  // nếu backend KHÔNG có role "blocked", trả 0
  const totalBlocked = users.filter((u) => u.role === "blocked").length || 0;

  const dataUsers = [
    { name: "Admin", total: totalAdmin },
    { name: "User", total: totalUser },
    { name: "Blocked", total: totalBlocked },
  ];

  const colors = ["#34d399", "#60a5fa", "#f87171"]; // xanh lá, xanh dương, đỏ

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-1 text-gray-800">
          Bảng điều khiển
        </h2>
        <p className="text-gray-500">Xin chào Admin! Chúc một ngày làm việc hiệu quả.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* CHART 1: PRODUCTS */}
        <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100">
          <h3 className="font-semibold mb-4 text-lg text-gray-800">
            Sản phẩm theo danh mục
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={productByCategory}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#f97316" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CHART 2: ORDERS */}
        <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100">
          <h3 className="font-semibold mb-4 text-lg text-gray-800">
            Số lượng đơn theo tháng
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={orderByMonth}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#fb923c"
                strokeWidth={3}
                dot={{ r: 5, fill: "#fb923c" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CHART 3A: USERS BAR */}
        <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 col-span-2">
          <h3 className="font-semibold mb-4 text-lg text-gray-800">Người dùng hệ thống</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dataUsers}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total">
                {dataUsers.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CHART 3B: USERS PIE */}
        <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 col-span-2">
          <h3 className="font-semibold mb-4 text-lg text-gray-800">Tỉ lệ người dùng</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />

              <Pie
                data={dataUsers}
                dataKey="total"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
              >
                {dataUsers.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>

              <Pie
                data={[{ value: 1 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                fill="#fff"
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-3">
            {dataUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: colors[i] }}
                />
                <span>{u.name} ({u.total})</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
