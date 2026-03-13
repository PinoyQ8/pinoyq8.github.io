// next.config.ts
const nextConfig = {
  experimental: {
    turbopack: {
      root: '.', // Forces Turbopack to treat 02_Mainnet as the sovereign root
    },
  },
};