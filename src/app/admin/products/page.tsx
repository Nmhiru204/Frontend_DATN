/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form fields
  const [form, setForm] = useState({
    TenDH: "",
    Gia: "",
    SoLuong: "",
    ThuongHieu: "",
    MaLoai: "",
  });

  // Ảnh upload (dùng chung cho thêm / sửa)
  const [images, setImages] = useState<FileList | null>(null);

  // ============================
  // FETCH DATA
  // ============================
  const loadAll = async () => {
    try {
      const [pRes, cRes, bRes] = await Promise.all([
        fetch("http://localhost:5000/products"),
        fetch("http://localhost:5000/categories"),
        fetch("http://localhost:5000/brands"),
      ]);

      const pJson = await pRes.json();
      const cJson = await cRes.json();
      const bJson = await bRes.json();

      if (pJson.success) setProducts(pJson.data);
      if (cJson.success) setCategories(cJson.data);
      if (bJson.success) setBrands(bJson.data);
    } catch (err) {
      console.error("❌ Lỗi load dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ============================
  // HANDLE DELETE  (GIỮ LẠI — CHỈ COMMENT NÚT)
  // ============================
  const deleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (json.success) {
      alert("Xóa thành công!");
      loadAll();
    } else {
      alert("Xóa thất bại!");
    }
  };

  // ============================
  // HANDLE ADD PRODUCT (có upload ảnh)
  // ============================
  const handleAddProduct = async () => {
    try {
      if (!form.TenDH || !form.Gia || !form.SoLuong || !form.MaLoai || !form.ThuongHieu) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      const fd = new FormData();
      fd.append("TenDH", form.TenDH);
      fd.append("Gia", form.Gia.toString());
      fd.append("SoLuong", form.SoLuong.toString());
      fd.append("ThuongHieu", form.ThuongHieu);
      fd.append("MaLoai", form.MaLoai);

      if (images && images.length > 0) {
        Array.from(images)
          .slice(0, 5)
          .forEach((file) => fd.append("image", file));
      }

      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();

      if (json.success) {
        alert("Thêm sản phẩm thành công!");
        setShowAddModal(false);
        setForm({
          TenDH: "",
          Gia: "",
          SoLuong: "",
          ThuongHieu: "",
          MaLoai: "",
        });
        setImages(null);
        loadAll();
      } else {
        alert(json.message || "Thêm thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi server");
    }
  };

  // ============================
  // HANDLE EDIT PRODUCT
  // ============================
  const openEdit = (product: any) => {
    setEditingProduct(product);
    setForm({
      TenDH: product.TenDH,
      Gia: product.Gia,
      SoLuong: product.SoLuong,
      ThuongHieu: product.ThuongHieu?._id || "",
      MaLoai: product.MaLoai?._id || "",
    });
    setImages(null);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      if (!editingProduct) return;

      const fd = new FormData();
      fd.append("TenDH", form.TenDH);
      fd.append("Gia", form.Gia.toString());
      fd.append("SoLuong", form.SoLuong.toString());
      fd.append("ThuongHieu", form.ThuongHieu);
      fd.append("MaLoai", form.MaLoai);

      if (images && images.length > 0) {
        Array.from(images)
          .slice(0, 5)
          .forEach((file) => fd.append("image", file));
      }

      const res = await fetch(
        `http://localhost:5000/products/${editingProduct._id}`,
        {
          method: "PUT",
          body: fd,
        }
      );

      const json = await res.json();

      if (json.success) {
        alert("Cập nhật thành công!");
        setShowEditModal(false);
        setEditingProduct(null);
        setImages(null);
        loadAll();
      } else {
        alert(json.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi server");
    }
  };

  // ============================
  // 🟡 ẨN / HIỆN SẢN PHẨM
  // ============================
  const toggleHide = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/products/hide/${id}`, {
        method: "PATCH",
      });

      const json = await res.json();

      if (json.success) {
        alert(json.message);
        loadAll();
      } else {
        alert(json.message || "Lỗi khi cập nhật trạng thái!");
      }
    } catch (err) {
      console.error("❌ Lỗi toggle sản phẩm:", err);
      alert("Lỗi khi cập nhật trạng thái sản phẩm!");
    }
  };

  // ============================
  // UI RENDER
  // ============================
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Quản lý sản phẩm</h2>

        <button
          onClick={() => {
            setShowAddModal(true);
            setImages(null);
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Loading */}
      {loading && <p>⏳ Đang tải sản phẩm...</p>}

      {/* Table */}
      {!loading && (
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="p-3">#</th>
              <th className="p-3">Hình</th>
              <th className="p-3">Tên SP</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Thương hiệu</th>
              <th className="p-3">Giá</th>
              <th className="p-3">SL</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={p._id} className="border-t hover:bg-gray-50 text-sm">
                <td className="p-3">{i + 1}</td>

                <td className="p-3">
                  <img
                    src={p.images?.[0] || "/noimg.png"}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>

                <td className="p-3 font-medium">
                  {p.TenDH}
                  {p.isHidden && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                      Đã ẩn
                    </span>
                  )}
                </td>

                <td className="p-3">{p.MaLoai?.TenLoai}</td>

                <td className="p-3">{p.ThuongHieu?.TenTH}</td>

                <td className="p-3">{p.Gia.toLocaleString()} đ</td>

                <td className="p-3">{p.SoLuong}</td>

                <td className="p-3 text-center flex justify-center gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                    onClick={() => openEdit(p)}
                  >
                    Sửa
                  </button>

                  {/* 🔴 NÚT XÓA GIỮ LẠI NHƯNG COMMENT – KHI CẦN BẬT LÊN LẠI
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                  >
                    Xóa
                  </button>
                  */}

                  {/* 🟡 NÚT ẨN / HIỂN */}
                  <button
                    onClick={() => toggleHide(p._id)}
                    className={`px-3 py-1 text-xs rounded-lg text-white ${
                      p.isHidden
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                  >
                    {p.isHidden ? "Hiển thị" : "Ẩn"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =========================== */}
      {/* MODAL THÊM SẢN PHẨM */}
      {/* =========================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Thêm sản phẩm
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowAddModal(false);
                  setImages(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Tên đồng hồ
                </label>
                <input
                  placeholder="Nhập tên sản phẩm"
                  className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.TenDH}
                  onChange={(e) =>
                    setForm({ ...form, TenDH: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <input
                    placeholder="Giá"
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="number"
                    value={form.Gia}
                    onChange={(e) =>
                      setForm({ ...form, Gia: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Số lượng
                  </label>
                  <input
                    placeholder="Số lượng"
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="number"
                    value={form.SoLuong}
                    onChange={(e) =>
                      setForm({ ...form, SoLuong: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Danh mục
                  </label>
                  <select
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={form.MaLoai}
                    onChange={(e) =>
                      setForm({ ...form, MaLoai: e.target.value })
                    }
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.TenLoai}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Thương hiệu
                  </label>
                  <select
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={form.ThuongHieu}
                    onChange={(e) =>
                      setForm({ ...form, ThuongHieu: e.target.value })
                    }
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.TenTH}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Hình ảnh sản phẩm
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="block w-full text-sm text-gray-700
                    file:mr-4 file:py-2 file:px-3
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-black file:text-white
                    hover:file:bg-gray-800"
                  onChange={(e) => setImages(e.target.files)}
                />
                <p className="text-xs text-gray-500">
                  Chọn tối đa 5 ảnh. Ảnh đầu tiên sẽ là ảnh chính.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setImages(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================== */}
      {/* MODAL SỬA SẢN PHẨM */}
      {/* =========================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Sửa sản phẩm: {editingProduct?.TenDH}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowEditModal(false);
                  setImages(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Tên đồng hồ
                </label>
                <input
                  placeholder="Nhập tên sản phẩm"
                  className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.TenDH}
                  onChange={(e) =>
                    setForm({ ...form, TenDH: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <input
                    placeholder="Giá"
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="number"
                    value={form.Gia}
                    onChange={(e) =>
                      setForm({ ...form, Gia: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Số lượng
                  </label>
                  <input
                    placeholder="Số lượng"
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="number"
                    value={form.SoLuong}
                    onChange={(e) =>
                      setForm({ ...form, SoLuong: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Danh mục
                  </label>
                  <select
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={form.MaLoai}
                    onChange={(e) =>
                      setForm({ ...form, MaLoai: e.target.value })
                    }
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.TenLoai}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Thương hiệu
                  </label>
                  <select
                    className="input w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={form.ThuongHieu}
                    onChange={(e) =>
                      setForm({ ...form, ThuongHieu: e.target.value })
                    }
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.TenTH}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Hình ảnh sản phẩm (nếu chọn sẽ thay toàn bộ ảnh cũ)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="block w-full text-sm text-gray-700
                    file:mr-4 file:py-2 file:px-3
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-black file:text-white
                    hover:file:bg-gray-800"
                  onChange={(e) => setImages(e.target.files)}
                />
                <p className="text-xs text-gray-500">
                  Bỏ trống nếu muốn giữ nguyên ảnh cũ.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setImages(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
