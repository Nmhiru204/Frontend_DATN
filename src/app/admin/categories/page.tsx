/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories");
      const json = await res.json();

      if (json.success) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("❌ Lỗi load danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🟢 THÊM HOẶC SỬA DANH MỤC
  const handleSaveCategory = async () => {
    if (!newName.trim()) return alert("Vui lòng nhập tên danh mục!");

    const isEdit = Boolean(editing);

    const url = isEdit
      ? `http://localhost:5000/categories/${editing}`
      : "http://localhost:5000/categories";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TenLoai: newName }),
    });

    const json = await res.json();

    if (json.success) {
      alert(isEdit ? "Cập nhật thành công!" : "Thêm thành công!");
      setNewName("");
      setShowForm(false);
      setEditing(null);
      fetchCategories();
    } else {
      alert("❌ " + json.message);
    }
  };

  // 🟠 XÓA DANH MỤC — chỉ khi KHÔNG CÓ sản phẩm
  const deleteCategory = async (id: string) => {
    if (!confirm("Bạn chắc muốn xóa danh mục này?")) return;

    const check = await fetch(`http://localhost:5000/products/by-category/${id}`);

    const data = await check.json();

    if (data.count > 0) {
      return alert("❌ Không thể xóa! Danh mục đang chứa sản phẩm.");
    }

    const res = await fetch(`http://localhost:5000/categories/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (json.success) {
      alert("Xóa thành công!");
      fetchCategories();
    } else {
      alert("❌ Xóa thất bại!");
    }
  };
  // 🟡 ẨN DANH MỤC
  const toggleHide = async (id: string) => {
  const res = await fetch(`http://localhost:5000/categories/hide/${id}`, {
    method: "PATCH",
  });

  const json = await res.json();

  if (json.success) {
    alert(json.message);
    fetchCategories();
  } else {
    alert("Lỗi khi cập nhật trạng thái!");
  }
};

  return (
    <div>
      {/* ======================= HEADER ======================= */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Quản lý danh mục</h2>

        <button
          onClick={() => {
            setEditing(null);
            setNewName("");
            setShowForm(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
        >
          + Thêm danh mục
        </button>
      </div>

      {/* ======================= INLINE FORM ======================= */}
      {showForm && (
        <div className="bg-white shadow rounded-xl p-5 mb-6">
          <h3 className="font-semibold mb-3">
            {editing ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
          </h3>

          <input
            className="w-full border rounded-lg px-3 py-2 mb-3 outline-none focus:ring focus:ring-gray-300"
            placeholder="Nhập tên danh mục..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg text-sm hover:bg-gray-400"
            >
              Hủy
            </button>

            <button
              onClick={handleSaveCategory}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {/* ======================= LIST ======================= */}
      {loading ? (
        <p>Đang tải danh mục...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">Chưa có danh mục nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left text-sm text-gray-700">
                <th className="p-3 w-16">#</th>
                <th className="p-3">Tên danh mục</th>
                <th className="p-3 w-40 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{cat.TenLoai}</td>

                  <td className="p-3 flex items-center justify-center gap-2">
                    {/* Sửa */}
                    <button
                      onClick={() => {
                        setEditing(cat._id);
                        setNewName(cat.TenLoai);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Sửa
                    </button>

                    {/* Xóa */}
                    {/* <button
                      onClick={() => deleteCategory(cat._id)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Xóa
                    </button> */}

                    {/* Ẩn */}
                    <button
  onClick={() => toggleHide(cat._id)}
  className={`px-3 py-1 text-xs rounded-lg text-white ${
    cat.isHidden ? "bg-gray-500 hover:bg-gray-600" : "bg-yellow-600 hover:bg-yellow-700"
  }`}
>
  {cat.isHidden ? "Hiển thị" : "Ẩn"}
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
