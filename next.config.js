const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins([withBundleAnalyzer, withCSS, withStylus, withCustomBabelConfigFile], {
    babelConfigFile: path.resolve('./babel.config.js'),
    publicRuntimeConfig: {
        WEBSITE_URL: process.env.WEBSITE_URL,
        NODE_ENV: process.env.NODE_ENV,

        CACHING_URL: process.env.CACHING_URL,
        REDIRECT_URL: process.env.REDIRECT_URL,
        RSS_BACKEND_URL: process.env.RSS_BACKEND_URL,
        KRAKMAG_URL: process.env.KRAKMAG_URL,
        TALENT_URL: process.env.TALENT_URL,
        CARRELAGE_URL: process.env.CARRELAGE_URL,

        STRIPE_KEY: process.env.STRIPE_KEY,
        MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,

        CLUB_CONTACT_NAME: process.env.CLUB_CONTACT_NAME,
        IS_QUARTERFULL: process.env.IS_QUARTERFULL === 'true',
        NEXT_QUARTER_END: process.env.NEXT_QUARTER_END,
        NEXT_QUARTER_START: process.env.NEXT_QUARTER_START,
    },
    serverRuntimeConfig: {},
    webpack: (config, options) => {
        if (options.isServer) {
            config.plugins.push(
                new ForkTsCheckerWebpackPlugin({ tsconfig: './tsconfig.json', tslint: './tslint.json' }),
            );
        }
        return config;
    },
});
