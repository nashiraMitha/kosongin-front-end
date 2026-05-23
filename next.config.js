/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 🔥 SAKTI: Mengizinkan SEMUA domain di dunia, termasuk URL ganda buatan backend, agar tidak crash lagi!
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;