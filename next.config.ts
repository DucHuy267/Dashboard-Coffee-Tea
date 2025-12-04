import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // ⚡ Tắt source map production (fix cảnh báo Invalid source map)
  productionBrowserSourceMaps: false,

  // ⚡ Bật StrictMode để detect lỗi React
  reactStrictMode: true,

  // ⚡ Ẩn header "X-Powered-By: Next.js"
  poweredByHeader: false,

  // ⚡ Tối ưu load image
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // ⚡ Tree-shaking Ant Design giảm bundle ~40–60%
  modularizeImports: {
    antd: {
      transform: "antd/es/{{member}}",
    },
  },

  // ⚡ Cache routes tốt hơn cho Production (Vercel)
  experimental: {
    optimizePackageImports: ["antd", "recharts"],
  },
};

export default nextConfig;
