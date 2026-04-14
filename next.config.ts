import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vpysqshhafthuxvokwqj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Exclude Supabase Edge Functions from Next.js build
  turbopack: {},
  webpack: (config: Record<string, unknown>) => {
    config.watchOptions = {
      ...(config.watchOptions as Record<string, unknown>),
      ignored: ['**/supabase/functions/**'],
    };
    return config;
  },
};

export default nextConfig;

