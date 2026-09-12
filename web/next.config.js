/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // logo/images served as-is from /public, same as CRA behavior
  },
};

module.exports = nextConfig;
