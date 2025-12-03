/* eslint-disable @typescript-eslint/no-explicit-any */
import Container from "@/components/Container";
import Image from "next/image";

interface NewsDetailProps {
  params: {
    id: string;
  };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { id } = params;

  // Gọi API backend để lấy bài viết theo ID
  const res = await fetch(`http://localhost:5000/api/news/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-xl font-bold text-red-500">Không tìm thấy bài viết</h2>
      </Container>
    );
  }

  const post = await res.json();

  return (
    <Container className="py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div className="text-sm text-gray-500 mb-6">
        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
        {" — "}
        <span className="italic">{post.author}</span>
      </div>

      <div className="w-full mb-8">
        <Image
          src={post.image}
          alt={post.title}
          width={1000}
          height={600}
          className="w-full rounded-xl object-cover"
        />
      </div>

      <article className="prose prose-lg max-w-none">
        {/* post.content của backend đang là dạng văn bản HTML đơn giản */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </Container>
  );
}
