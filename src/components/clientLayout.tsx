"use client";  // 🚀 QUAN TRỌNG: Giúp file này trở thành Client Component

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() as string;
    const isAdmin = pathname.startsWith("/admin");


    return (
        <>
            {/* Chỉ hiện Navbar ngoài admin */}
            {!isAdmin && <Navbar />}

            <main>{children}</main>

            {/* Chỉ hiện Footer ngoài admin */}
            {!isAdmin && <Footer />}
        </>
    );
}
