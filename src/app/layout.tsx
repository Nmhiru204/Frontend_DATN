import type { Metadata } from "next";
import "@/app/globals.css";
import ClientLayout from "@/components/clientLayout";

export const metadata: Metadata = {
  title: "MagicWatches – Đồng hồ chính hãng",
  description: "Cửa hàng đồng hồ nam, nữ, cặp đôi – chính hãng, giá tốt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      {/* tránh hydration mismatch */}
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
