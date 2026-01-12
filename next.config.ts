import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
    // Enable source maps for better debugging
    productionBrowserSourceMaps: true,
    
    // ESLint configuration - treat warnings as non-fatal
    eslint: {
        // During builds, only fail on errors, not warnings
        ignoreDuringBuilds: true,
    },
    
    // Experimental features for better performance
    experimental: {
        // Optimize package imports
        optimizePackageImports: ['@tanstack/react-query', 'lucide-react', '@radix-ui/react-icons'],
        // Enable partial prerendering for faster initial loads
        ppr: false, // Disable for now to avoid issues
    },
    
    // Webpack optimizations
    webpack: (config, { isServer, dev }) => {
        if (!dev && !isServer) {
            // Optimize chunk splitting for better caching
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // Vendor chunk
                    vendor: {
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: 20
                    },
                    // UI library chunk
                    ui: {
                        name: 'ui',
                        test: /[\\/]node_modules[\\/](@radix-ui|@tanstack|lucide-react)[\\/]/,
                        chunks: 'all',
                        priority: 30
                    },
                    // Common chunk
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10
                    }
                }
            };
        }
        return config;
    },
    
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
                pathname: "/f/**",
            },
            {
                protocol: "https",
                hostname: "chvq0wd57s.ufs.sh",
                pathname: "/f/**",
            },
            {
                protocol: "https",
                hostname: "x6bo3x9qkp.ufs.sh",
                pathname: "/f/**",
            },
            {
                protocol: "https",
                hostname: "plus.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "static.vecteezy.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "thumbs.dreamstime.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.shopify.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "drive.google.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.imgur.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "img.clerk.com",
                pathname: "/**",
            },
        ],
    },
    
    // Server external packages - keeps these modules server-only
    serverExternalPackages: [
        'ioredis', 
        'postgres', 
        'isomorphic-dompurify',
        '@exodus/bytes',
        'html-encoding-sniffer'
    ],
};

export default nextConfig;
