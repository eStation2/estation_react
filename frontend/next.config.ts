import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    turbo: {
      // Enable Turbopack optimizations
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://localhost:* http://localhost:* wss://localhost:* ws://localhost:*; font-src 'self' data:;",
          },
        ],
      },
    ];
  },

  // API proxy for development (optional fallback)
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_DIRECT_URL || 'http://localhost:8000'}/:path*`,
      },
      {
        source: '/geoserver-proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_GEOSERVER_DIRECT_URL || 'http://localhost:8080'}/:path*`,
      },
    ];
  },

  // Image optimization for geospatial data
  images: {
    domains: ['localhost', '127.0.0.1'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack configuration for better builds
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add any custom webpack configurations here
    
    // Optimize bundle for geospatial libraries
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },

  // Output configuration
  output: 'standalone',

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Disable ETags for better caching control
  generateEtags: false,

  // Custom build directory (optional)
  distDir: '.next',

  // Enable strict mode
  reactStrictMode: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration  
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
