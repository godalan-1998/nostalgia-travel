/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // สั่งให้ Vercel มองข้าม Error ของ TypeScript ตอน Build
    ignoreBuildErrors: true,
  },
  eslint: {
    // สั่งให้ Vercel มองข้าม Error ของ ESLint ตอน Build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;