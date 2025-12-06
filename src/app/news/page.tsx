/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Container from "@/components/Container";

// ===============================
// FIX BASE URL (chạy local = http)
// ===============================
function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

  // Nếu đang chạy local → luôn dùng HTTP
  if (typeof window === "undefined") {
    // Server Component
    return url.replace("https://", "http://");
  }

  if (window.location.hostname === "localhost") {
    return url.replace("https://", "http://");
  }

  return url;
}

function getImageUrl(path: string) {
  if (!path) return "/placeholder.webp";
  if (path.startsWith("http")) return path;

  return `${getBaseUrl()}${path}`;
}

export default async function NewsPage() {
  const API = `${getBaseUrl()}/api/news/published`;

  let posts: any[] = [];

  try {
    const res = await fetch(API, {
      cache: "no-store",
      // QUAN TRỌNG: tránh strict SSL
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("❌ API ERROR:", res.status, API);
      return (
        <Container className="text-center py-20 text-red-600">
          Lỗi API ({res.status}) — không tải được tin tức.
        </Container>
      );
    }

    posts = await res.json();
  } catch (err) {
    console.error("❌ FETCH FAILED:", err);
    return (
      <Container className="text-center py-20 text-red-600">
        Không thể kết nối API tin tức.<br />
        Hãy kiểm tra BACKEND có chạy không.
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="mb-6 text-center text-2xl font-bold">TIN TỨC ~ SỰ KIỆN</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        {/* ================= MAIN LIST ================= */}
        <section className="space-y-6">
          {posts.map((p: any) => (
            <article
              key={p._id}
              className="card grid gap-4 p-4 sm:grid-cols-[160px_1fr]"
            >
              <div className="overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={getImageUrl(p.image)}
                  alt={p.title}
                  width={320}
                  height={200}
                  className="h-40 w-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold hover:underline">
                  {p.title}
                </h3>

                <div className="mt-1 text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                </div>

                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {p.excerpt}
                </p>

                <a
                  href={`/news/${p._id}`}
                  className="mt-3 inline-block text-sm text-[hsl(var(--mw-accent))] hover:underline"
                >
                  Xem chi tiết →
                </a>
              </div>
            </article>
          ))}

          {/* ================= FEATURED ================= */}
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.slice(0, 2).map((p: any) => (
              <article key={p._id} className="card overflow-hidden">
                <Image
                  src={getImageUrl(p.image)}
                  alt={p.title}
                  width={1200}
                  height={600}
                  className="h-60 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                    {p.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= SIDEBAR ================= */}
        <aside className="space-y-4">
          <div className="card p-4">
            <div className="mb-3 text-base font-semibold">Bài viết mới</div>

            <ul className="space-y-3 text-sm">
              {posts.slice(0, 5).map((p: any) => (
                <li key={p._id} className="flex items-center gap-3">
                  <Image
                    src={getImageUrl(p.image)}
                    alt={p.title}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-lg object-cover"
                  />

                  <div>
                    <div className="line-clamp-2 font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card overflow-hidden">
            <Image
              src="/img/1.webp"
              alt="promo"
              width={400}
              height={300}
              className="h-40 w-full object-cover"
            />
          </div>
        </aside>
      </div>
    </Container>
  );
}
