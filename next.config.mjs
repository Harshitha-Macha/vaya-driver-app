// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig


import withPWA from 'next-pwa'

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const baseConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  }
}

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  scope: '/',
  sw: 'service-worker.js',
  runtimeCaching: [],
  manifest: '/manifest.json',
  skipWaiting: true,
}, baseConfig)
