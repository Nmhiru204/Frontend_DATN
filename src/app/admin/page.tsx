export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-3">🔐 Admin Dashboard</h1>
      <p className="text-gray-600">Xin chào, bạn đang đăng nhập bằng tài khoản Admin.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">👥 Quản lý người dùng</h2>
          <p className="text-sm text-gray-500 mt-1">Xem danh sách và vai trò</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">📦 Quản lý sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-1">Thêm / sửa / xóa sản phẩm</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">⚙️ Cài đặt hệ thống</h2>
          <p className="text-sm text-gray-500 mt-1">Tùy chỉnh trang quản trị</p>
        </div>
      </div>
    </div>
  );
}
