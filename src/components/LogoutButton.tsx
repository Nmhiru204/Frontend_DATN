"use client";

import Cookies from "js-cookie";

export default function LogoutButton() {
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("role");
    alert("👋 Bạn đã đăng xuất!");
    window.location.href = "/auth";
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 transition"
    >
      Đăng xuất
    </button>
  );
}
