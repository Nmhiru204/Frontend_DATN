import Image from "next/image";
import Container from "@/components/Container";

type Post = { id: string; title: string; excerpt: string; date: string; image: string; };

const posts: Post[] = [
  { id: "1", title: "Seiko & Steel back ở đáy đồng hồ", excerpt: "Ý nghĩa của ký hiệu này là gì? Cùng khám phá ngay trong bài viết.", date: "7 giờ trước", image: "/img/1.webp" },
  { id: "2", title: "Đồng hồ lặn đạt tiêu chuẩn 6 điểm cần nhớ", excerpt: "Đáp ứng tối đa cho dân lặn chuyên nghiệp và người dùng phổ thông.", date: "Hôm nay", image: "/img/1.webp" },
  { id: "3", title: "Quartz hay Automatic: chọn sao cho đúng?", excerpt: "So sánh ưu/nhược điểm từng dòng máy để bạn dễ quyết định.", date: "Hôm qua", image: "/img/1.webp" },
];

export default function NewsPage() {
  return (
    <Container className="py-10">
      <h1 className="mb-6 text-center text-2xl font-bold">TIN TỨC ~ SỰ KIỆN</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        {/* Main list */}
        <section className="space-y-6">
          {posts.map((p) => (
            <article key={p.id} className="card grid gap-4 p-4 sm:grid-cols-[160px_1fr]">
              <div className="overflow-hidden rounded-xl bg-gray-100">
                <Image src={p.image} alt={p.title} width={320} height={200} className="h-40 w-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-semibold hover:underline">{p.title}</h3>
                <div className="mt-1 text-xs text-gray-500">{p.date}</div>
                <p className="mt-2 text-sm text-gray-700">{p.excerpt}</p>
                <a href="#" className="mt-3 inline-block text-sm text-[hsl(var(--mw-accent))] hover:underline">Xem chi tiết →</a>
              </div>
            </article>
          ))}

          {/* Featured big posts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <article key={i} className="card overflow-hidden">
                <Image src="/img/1.webp" alt="feature" width={1200} height={600} className="h-60 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Cơ chế Annual Calendar trên đồng hồ là gì?</h3>
                  <p className="mt-2 text-sm text-gray-700">Khám phá cơ chế lịch nâng cao, giúp đồng hồ hiển thị ngày chính xác quanh năm.</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="card p-4">
            <div className="mb-3 text-base font-semibold">Bài viết mới</div>
            <ul className="space-y-3 text-sm">
              {posts.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Image src={p.image} alt={p.title} width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
                  <div>
                    <div className="line-clamp-2 font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card overflow-hidden">
            <Image src="/img/1.webp" alt="promo" width={400} height={300} className="h-40 w-full object-cover" />
          </div>
        </aside>
      </div>
    </Container>
  );
}
