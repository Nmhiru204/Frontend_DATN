"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";

type Tab = "login" | "register";

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <Container className="py-12">
      <div className="mx-auto w-full max-w-md card p-6">
        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-gray-100 p-1 text-sm">
          <button
            onClick={() => setTab("login")}
            className={`rounded-xl px-4 py-2 font-medium ${
              tab === "login" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setTab("register")}
            className={`rounded-xl px-4 py-2 font-medium ${
              tab === "register" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Forms */}
        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </Container>
  );
}

function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Đăng nhập thành công!");
        console.log("Token:", data.token);
        // ví dụ: chuyển hướng tới trang chủ
        window.location.href = "/";
      } else {
        alert(data.message || "❌ Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      alert("⚠️ Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          placeholder="••••••••"
        />
      </div>
      <button
        className="btn-primary w-full disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`🎉 Tạo tài khoản thành công!`);
const buttons = document.querySelectorAll("button[role='tabs'], .grid > button");
(buttons?.[0] as HTMLButtonElement | undefined)?.click?.(); // click vào tab "Đăng nhập"

      } else {
        alert(data.message || "❌ Chưa tạo tài khoản thành công!");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert("⚠️ Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Họ</label>
          <input
            name="firstName"
            required
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tên</label>
          <input
            name="lastName"
            required
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
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
          className="w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          placeholder="Tối thiểu 6 ký tự"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>

      <p className="mt-2 text-center text-sm text-gray-600">
        Đã có tài khoản?{" "}
        <a
          id="switch-to-register"
          href="#login"
          onClick={(e) => {
            e.preventDefault();
            const buttons = document.querySelectorAll("button[role='tab'], .grid > button");
            (buttons?.[0] as HTMLButtonElement | undefined)?.click?.();
          }}
          className="font-medium text-black hover:underline"
        >
          Đăng nhập
        </a>
      </p>
    </form>
  );
}

