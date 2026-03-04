/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Three.js canvas-related packages
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },

  // Security + CORS headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },

  // Image domains for news thumbnails (expand as needed)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.bbci.co.uk' },
      { protocol: 'https', hostname: '**.reuters.com' },
    ],
  },
};

module.exports = nextConfig;
