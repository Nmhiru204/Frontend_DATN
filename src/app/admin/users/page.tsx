/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const router = useRouter();
  const token = Cookies.get("token");

  // Nếu không có token → đẩy về login
  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token]);

  // =============================
  // GET USERS
  // =============================
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (err) {
      console.error("❌ Lỗi load user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // =============================
  // OPEN MODAL EDIT
  // =============================
  const openEdit = (user: any) => {
    setEditingUser({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    setIsOpen(true);
  };

  // =============================
  // SAVE UPDATE (ONLY ROLE)
  // =============================
  const saveUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: editingUser.role,
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        alert("✔ Cập nhật quyền thành công!");
        setIsOpen(false);
        fetchUsers();
      } else {
        alert("❌ Không thể cập nhật quyền!");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
    }
  };

  // =============================
  // BLOCK / UNBLOCK USER
  // =============================
  const toggleBlock = async (user: any) => {
    const newRole = user.role === "blocked" ? "user" : "blocked";

    const ok = confirm(
      newRole === "blocked"
        ? "Bạn có chắc muốn KHÓA tài khoản này?"
        : "Bạn muốn MỞ KHÓA tài khoản này?"
    );
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const json = await res.json();

      if (json.success) {
        alert("✔ Cập nhật trạng thái!");
        fetchUsers();
      }
    } catch (err) {
      console.error("❌ Toggle error:", err);
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Quản lý người dùng
      </h2>

      {loading && <p className="text-gray-600">⏳ Đang tải...</p>}

      {!loading && users.length === 0 && (
        <p className="text-gray-500">Không có tài khoản nào.</p>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-xl border">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-700">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3 text-left">Họ tên</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center w-28">Quyền</th>
                <th className="p-3 text-center w-48">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50 text-sm transition h-14"
                >
                  <td className="p-3 text-center">{i + 1}</td>

                  <td className="p-3 font-medium">
                    {u.firstName} {u.lastName}
                  </td>

                  <td className="p-3">{u.email}</td>

                  <td className="p-3 text-center">
                    {u.role === "admin" ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg">
                        Admin
                      </span>
                    ) : u.role === "blocked" ? (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg">
                        Bị khóa
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">
                        User
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openEdit(u)}
                        className="px-4 py-1.5 text-xs font-medium 
                          bg-[#1a73e8] hover:bg-[#1459b8]
                          text-white rounded-lg shadow-sm transition"
                      >
                        Sửa
                      </button>

                      {u.role !== "admin" && (
                        <button
                          onClick={() => toggleBlock(u)}
                          className={`px-4 py-1.5 text-xs font-medium rounded-lg shadow-sm 
                            text-white transition
                            ${
                              u.role === "blocked"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                          {u.role === "blocked" ? "Mở khóa" : "Khóa"}
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

      {/* MODAL update quyền */}
      {isOpen && editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white p-7 rounded-2xl shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800 text-center">
              Cập nhật quyền người dùng
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-600">Họ tên</label>
                <input
                  disabled
                  value={`${editingUser.firstName} ${editingUser.lastName}`}
                  className="w-full mt-1 border bg-gray-100 text-gray-500 px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  disabled
                  value={editingUser.email}
                  className="w-full mt-1 border bg-gray-100 text-gray-500 px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Quyền</label>
                <select
                  className="w-full mt-1 border px-3 py-2 rounded-lg"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="blocked">Khóa tài khoản</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Hủy
              </button>

              <button
                onClick={saveUpdate}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 
                  text-white rounded-lg shadow"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
