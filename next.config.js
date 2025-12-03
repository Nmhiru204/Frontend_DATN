/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ⭐ Cho phép ảnh từ Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

      // ⭐ Cho phép ảnh từ backend local
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
