const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    output: 'standalone',
    allowedDevOrigins: ['*.skatekrak.com'],
    productionBrowserSourceMaps: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    transpilePackages: ['@krak/auth', '@krak/types', '@krak/contracts', '@krak/ui', '@krak/utils'],
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dev.skatekrak.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/join',
                destination: 'https://buy.stripe.com/4gw02Tbao2Cna5O7ss',
                permanent: true,
            },
            {
                source: '/map/:mapId',
                destination: '/?id=:mapId',
                permanent: false,
            },
            {
                source: '/map',
                destination: '/',
                permanent: true,
            },
        ];
    },
});
