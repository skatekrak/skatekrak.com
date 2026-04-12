import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@krak/auth', '@krak/contracts'],
    allowedDevOrigins: ['*.skatekrak.com', '*.dev.skatekrak.com'],
};

export default nextConfig;
