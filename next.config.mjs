/** @type {import('next').NextConfig} */
const isExtensionBuild = process.env.EXT_BUILD === '1' || process.env.NEXT_PUBLIC_IS_EXTENSION === '1'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  assetPrefix: isExtensionBuild ? '' : (process.env.NODE_ENV === 'production' ? '/omegagu-tracker' : ''),
  basePath: isExtensionBuild ? '' : (process.env.NODE_ENV === 'production' ? '/omegagu-tracker' : ''),
}

export default nextConfig
