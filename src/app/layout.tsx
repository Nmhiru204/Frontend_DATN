import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      {/* ⚡ suppressHydrationWarning tránh mismatch khi load extension */}
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
