import type { NextConfig } from 'next';

import './src/env';

const nextConfig: NextConfig = {
    transpilePackages: ['@krak/auth', '@krak/contracts'],
    allowedDevOrigins: ['*.skatekrak.com', '*.dev.skatekrak.com'],
};

export default nextConfig;
