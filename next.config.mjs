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

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  scope: '/',
  sw: 'service-worker.js', // This file will be auto-generated
  runtimeCaching: [],
  // Your other next config options
})
