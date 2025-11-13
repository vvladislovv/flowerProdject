/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Игнорируем запросы от Chrome DevTools (опционально, можно убрать)
  // async rewrites() {
  //   return [
  //     {
  //       source: '/.well-known/appspecific/com.chrome.devtools.json',
  //       destination: '/api/devtools',
  //     },
  //   ]
  // },
}

module.exports = nextConfig

