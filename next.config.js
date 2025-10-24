/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Either use domains:
    domains: ["res.cloudinary.com"],

    // or remotePatterns (recommended / flexible):
    // remotePatterns: [
    //   { protocol: "https", hostname: "res.cloudinary.com" },
    // ],
  },
};

module.exports = nextConfig;
