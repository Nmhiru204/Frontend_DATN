/* eslint-disable @next/next/no-html-link-for-pages */
export default function ForbiddenPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-gray-700 text-lg mb-2">Bạn không có quyền truy cập vào trang này.</p>
      <a href="/" className="text-blue-600 hover:underline">Quay về trang chủ</a>
    </div>
  );
}
