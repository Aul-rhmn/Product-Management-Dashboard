/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack:{},
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@ant-design/colors': false,
    }
    return config
  },
}

export default nextConfig
