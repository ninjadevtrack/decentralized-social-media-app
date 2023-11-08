const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }];
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  sw: 'sw.js',
  mode: 'production',
  importScripts: ['impressions.js']
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  transpilePackages: ['data'],
  reactStrictMode: false,
  experimental: { scrollRestoration: true },
  async rewrites() {
    return [
      {
        source: '/sitemaps/:match*',
        destination: 'https://sitemap.hey.xyz/:match*'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.com/invite/B8eKhSSUwX',
        permanent: true
      },
      {
        source: '/donate',
        destination: 'https://giveth.io/project/hey?utm_source=hey',
        permanent: true
      },
      {
        source: '/gitcoin',
        destination:
          'https://explorer.gitcoin.co/#/round/10/0x8de918f0163b2021839a8d84954dd7e8e151326d/0x8de918f0163b2021839a8d84954dd7e8e151326d-2',
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin' }
        ]
      },
      { source: '/about', headers },
      { source: '/privacy', headers },
      { source: '/thanks', headers }
    ];
  }
};

module.exports = withPWA(nextConfig);
