import type { Product } from "@/components/ProductCard";

// Dùng ảnh local bạn có: public/img/1.webp
export const featured: Product[] = [
  {
    slug: "casio-ae-1200whd",
    name: "Casio World Time AE-1200WHD",
    brand: "CASIO",
    price: 1250000,
    salePrice: 956000,
    image: "/img/1.webp",
    tag: "Bán chạy",
  },
  {
    slug: "orient-bambino",
    name: "Orient Bambino Gen IV",
    brand: "ORIENT",
    price: 5200000,
    image: "/img/1.webp",
  },
  {
    slug: "seiko-5",
    name: "Seiko 5 Sports",
    brand: "SEIKO",
    price: 6200000,
    image: "/img/1.webp",
  },
  {
    slug: "tissot-prx",
    name: "Tissot PRX 40mm",
    brand: "TISSOT",
    price: 11500000,
    image: "/img/1.webp",
  },
];

export const byCategory: Record<string, Product[]> = {
  nam: featured,
  nu: featured.map((p) => ({
    ...p,
    slug: p.slug + "-nu",
    name: p.name + " – Nữ",
  })),
};

export function getProduct(slug: string): Product | undefined {
  return [...featured, ...byCategory.nu].find((p) => p.slug === slug);
}
