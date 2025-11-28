"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

type Tab = "login" | "register";

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) window.location.href = "/";
  }, []);

  return (
    <div className="py-14">
      <div
        className="
          w-full max-w-md mx-auto 
          backdrop-blur-xl bg-white/60 
          border border-white/40 
          shadow-xl rounded-3xl 
          p-8
        "
      >
        {/* Tabs */}
        <div className="mb-8 flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all 
              ${
                tab === "login"
                  ? "bg-white shadow-md text-gray-900"
                  : "text-gray-500"
              }
            `}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all 
              ${
                tab === "register"
                  ? "bg-white shadow-md text-gray-900"
                  : "text-gray-500"
              }
            `}
          >
            Đăng ký
          </button>
        </div>

        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

/* ======================================================
   🟢 LOGIN FORM — đã sửa đầy đủ
====================================================== */
function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // 🟢 LƯU TOKEN CHUẨN — FIX HOÀN TOÀN JWT MALFORMED
        Cookies.set("token", data.token, { expires: 7, path: "/" });
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.user?.email ?? "");

        alert("🎉 Đăng nhập thành công!");

        // 🔥 Điều hướng admin chính xác
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.message || "❌ Sai email hoặc mật khẩu!");
      }
    } catch {
      alert("⚠️ Không thể kết nối tới server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="
            w-full rounded-xl border border-gray-300 
            px-4 py-3 bg-white/80
            focus:ring-2 focus:ring-black focus:border-black
            transition-all outline-none
          "
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
        <input
          type="password"
          name="password"
          required
          className="
            w-full rounded-xl border border-gray-300 
            px-4 py-3 bg-white/80
            focus:ring-2 focus:ring-black focus:border-black
            transition-all outline-none
          "
          placeholder="••••••••"
        />
      </div>

      <button
        className="
          w-full py-3 rounded-xl font-medium 
          bg-black text-white 
          hover:bg-gray-800
          transition-all shadow-md 
          disabled:opacity-50
        "
        type="submit"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

/* ======================================================
   🟣 REGISTER FORM — giữ nguyên nhưng chuẩn hoá
====================================================== */
function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Tạo tài khoản thành công! Hãy đăng nhập ngay.");
        window.location.reload();
      } else {
        alert(data.message || "❌ Chưa tạo tài khoản thành công!");
      }
    } catch {
      alert("⚠️ Không thể kết nối tới server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Họ</label>
          <input
            name="firstName"
            required
            className="
              w-full rounded-xl border border-gray-300 
              px-4 py-3 bg-white/80
              focus:ring-2 focus:ring-black focus:border-black
              outline-none transition-all
            "
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tên</label>
          <input
            name="lastName"
            required
            className="
              w-full rounded-xl border border-gray-300 
              px-4 py-3 bg-white/80
              focus:ring-2 focus:ring-black focus:border-black
              outline-none transition-all
            "
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="
            w-full rounded-xl border border-gray-300 
            px-4 py-3 bg-white/80
            focus:ring-2 focus:ring-black focus:border-black
            outline-none transition-all
          "
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
        <input
          type="password"
          name="password"
          minLength={6}
          required
          className="
            w-full rounded-xl border border-gray-300 
            px-4 py-3 bg-white/80
            focus:ring-2 focus:ring-black focus:border-black
            outline-none transition-all
          "
          placeholder="Tối thiểu 6 ký tự"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-3 rounded-xl font-medium 
          bg-black text-white 
          hover:bg-gray-800
          transition-all shadow-md 
          disabled:opacity-50
        "
      >
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Đã có tài khoản?{" "}
        <span
          onClick={() => window.location.reload()}
          className="font-medium text-black hover:underline cursor-pointer"
        >
          Đăng nhập
        </span>
      </p>
    </form>
  );
}
