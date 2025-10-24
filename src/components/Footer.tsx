import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900 text-gray-200">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="text-xl font-black">
            Magic<span className="text-[hsl(var(--mw-accent))]">Watches</span>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Cửa hàng đồng hồ chính hãng – bảo hành, đổi trả linh hoạt.
          </p>
        </div>

        <div>
          <div className="font-semibold">Chính sách</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>Bảo hành & Đổi trả</li>
            <li>Giao hàng</li>
            <li>Bảo mật</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Liên hệ</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>Hotline: 1900 1234</li>
            <li>Email: support@timewatch.vn</li>
            <li>Địa chỉ: TP.HCM</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Theo dõi</div>
          <div className="mt-3 flex gap-2">
            <span className="rounded-xl bg-white/10 px-3 py-1 text-sm">Facebook</span>
            <span className="rounded-xl bg-white/10 px-3 py-1 text-sm">YouTube</span>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} TimeWatch
      </div>
    </footer>
  );
}
