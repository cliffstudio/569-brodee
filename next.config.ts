import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Use a single alias to dist so we never hit the package's "development" export (src/ with .jsx)
      "bunny-input-dist": "./node_modules/@cliff-studio/sanity-plugin-bunny-input/dist/index.js",
    },
  },
  async redirects() {
    return [
      { source: '/activities', destination: '/calendar', permanent: true },
      { source: '/activities/:path*', destination: '/calendar/:path*', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for Sanity vendor chunks issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Use built dist for Bunny plugin (avoids "development" export using raw src/ with .jsx)
    config.resolve.alias = {
      ...config.resolve.alias,
      "bunny-input-dist": path.resolve(
        process.cwd(),
        "node_modules/@cliff-studio/sanity-plugin-bunny-input/dist/index.js"
      ),
    };
    
    // Fix for React 19 useMemoCache issues
    config.resolve.symlinks = false;
    
    // Fix for Sanity vendor chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          sanity: {
            test: /[\\/]node_modules[\\/](sanity|@sanity)[\\/]/,
            name: 'sanity',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
  // External packages for server components
  serverExternalPackages: ['sanity'],
  // Next 16: reactCompiler moved to top-level
  reactCompiler: false,
};

export default nextConfig;

