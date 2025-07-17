/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.suitdev.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ideas",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
