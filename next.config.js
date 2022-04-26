const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const withSourceMaps = require('@zeit/next-source-maps');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins([withBundleAnalyzer({}), withCSS, withStylus, withSourceMaps], {
    babelConfigFile: path.resolve('./babel.config.js'),
    webpack: (config, options) => {
        if (options.isServer) {
            config.plugins.push(
                new ForkTsCheckerWebpackPlugin({
                    tsconfig: './tsconfig.json',
                    eslint: { files: './**/*.{ts,tsx,js,jsx}' },
                }),
            );
        }
        return config;
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
