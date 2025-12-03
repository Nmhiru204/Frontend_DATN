/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    const res = await fetch("http://localhost:5000/api/news");
    const data = await res.json();
    setNews(data);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Xóa bài này?")) return;

    await fetch(`http://localhost:5000/api/news/${id}`, {
      method: "DELETE",
    });

    fetchNews();
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tin tức</h1>

        <Link
          href="/admin/new/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Thêm bài viết
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Ảnh</th>
            <th className="p-3">Tiêu đề</th>
            <th className="p-3">Ngày</th>
            <th className="p-3">Duyệt</th>
            <th className="p-3 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {news.map((item: any) => (
            <tr key={item._id} className="border-t">
              <td className="p-3">
                <img
                  src={item.image}
                  className="w-20 h-14 rounded object-cover"
                />
              </td>

              <td className="p-3">{item.title}</td>

              <td className="p-3">
                {new Date(item.createdAt).toLocaleDateString("vi-VN")}
              </td>

              <td className="p-3">
                {item.isPublished ? (
                  <span className="text-green-600">Đã duyệt</span>
                ) : (
                  <span className="text-red-600">Chưa duyệt</span>
                )}
              </td>

              <td className="p-3 text-right space-x-3">
                <Link
                  href={`/admin/new/edit/${item._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </Link>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
