/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure middleware runs consistently
  experimental: {
    // Ensure middleware is always fresh
    workerThreads: false,
    cpus: 1,
  },
}

export default nextConfig
