const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const withSourceMaps = require('@zeit/next-source-maps');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins([withBundleAnalyzer({}), withCSS, withStylus, withCustomBabelConfigFile, withSourceMaps], {
    babelConfigFile: path.resolve('./babel.config.js'),
    serverRuntimeConfig: {},
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
                source: '/club',
                destination: 'https://krakito.com',
                permanent: true,
            },
            {
                source: '/map/:mapId',
                destination: '/map?id=:mapId',
                permanent: false,
            },
        ];
    },
});
