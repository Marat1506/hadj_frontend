import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dubliz.store',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
