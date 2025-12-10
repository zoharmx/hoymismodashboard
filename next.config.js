/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  // Exclude example folders from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/Ejemplo 1/**', '**/Ejemplo 2/**', '**/node_modules/**'],
    }
    return config
  },
  // Exclude from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map((ext) => {
    return `${ext}`
  }),
}

module.exports = nextConfig
