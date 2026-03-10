/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. GATEWAY REWRITES: Redirects the Pi Crawler to the V23 route.ts logic
  async rewrites() {
    return [
      {
        source: '/validation-key.txt',
        destination: '/api/v23/sync', 
      },
    ];
  },

  // 2. SECURITY HEADERS: Your existing CORS MESH protocol
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, 
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-pioneer-key" },
        ],
      },
    ];
  },
};

export default nextConfig;