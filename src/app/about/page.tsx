import Image from "next/image";
import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-orange-50 to-white">
        <Container className="py-10">
          <div className="mb-6 text-sm font-semibold text-[hsl(var(--mw-accent))]">Tinh hoa chế tác – Định nghĩa đẳng cấp</div>
          <div className="grid items-center gap-6 md:grid-cols-2">
            <Image src="/img/1.webp" alt="About banner" width={1000} height={700} className="rounded-3xl border object-cover shadow-xl" />
            <Image src="/img/1.webp" alt="About banner" width={1000} height={700} className="rounded-3xl border object-cover shadow-xl" />
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <h1 className="mb-2 text-center text-2xl font-bold text-[hsl(var(--mw-accent))]">THÀNH LẬP NĂM 2020</h1>
        <h2 className="mb-6 text-center text-xl font-bold">CAM KẾT 100% HÀNG CHÍNH HÃNG</h2>

        <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
          <p>
            Trải qua nhiều năm hình thành và phát triển, chúng tôi luôn coi trọng trải nghiệm khách hàng, chọn lọc kỹ càng
            các mẫu đồng hồ đến từ thương hiệu uy tín. Hệ thống phân phối rộng khắp, dịch vụ hậu mãi tận tâm.
          </p>
          <ul className="list-inside list-disc">
            <li>Đổi mới 1-1 nếu lỗi do nhà sản xuất trong 7 ngày.</li>
            <li>Bảo hành chính hãng 24 tháng.</li>
            <li>Đội ngũ tư vấn viên giàu kinh nghiệm về đồng hồ cơ & pin.</li>
          </ul>
        </div>

        <div className="mt-10 text-center text-lg font-semibold">CÁC THƯƠNG HIỆU ĐỒNG HỒ WATCHSTORE ĐANG PHÂN PHỐI</div>
        <div className="mt-4 grid grid-cols-3 items-center justify-items-center gap-4 sm:grid-cols-6">
          {"CASIO,SEIKO,LONGINES,CITIZEN,TISSOT,G-SHOCK".split(",").map((b) => (
            <div key={b} className="card w-full max-w-[160px] py-6 text-center text-sm font-semibold">{b}</div>
          ))}
        </div>
      </Container>
    </>
  );
}
