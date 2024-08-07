const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins([withBundleAnalyzer()], {
    productionBrowserSourceMaps: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
        styledComponents: true,
    },
    transpilePackages: ['@krak/carrelage-client', '@krak/trpc'],
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
