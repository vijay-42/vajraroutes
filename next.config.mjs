/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/packages/domestic", destination: "/domestic-tours", permanent: true },
      { source: "/packages/international", destination: "/international-tours", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "vajraroutes.com" },
    ],
  },
};
export default nextConfig;
