/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? './invoice-categorizer/' : '',
  basePath: isProd ? '/invoice-categorizer' : '',
  output: 'standalone',
}

export default nextConfig
