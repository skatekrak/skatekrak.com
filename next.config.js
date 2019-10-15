const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const webpack = require('webpack');

module.exports = withPlugins([withBundleAnalyzer, withCSS, withStylus, withCustomBabelConfigFile], {
    babelConfigFile: path.resolve('./babel.config.js'),
    publicRuntimeConfig: {
        BEARER: process.env.BEARER,
        NODE_ENV: process.env.NODE_ENV,

        INTERCOM_ID: process.env.INTERCOM_ID,
        STRIPE_KEY: process.env.STRIPE_KEY,

        CACHING_URL: process.env.CACHING_URL,
        CAIROTE_URL: process.env.CAIROTE_URL,
        REDIRECT_URL: process.env.REDIRECT_URL,
        RSS_BACKEND_URL: process.env.RSS_BACKEND_URL,
        SESTERCES_URL: process.env.SESTERCES_URL,
        KRAKMAG_URL: process.env.KRAKMAG_URL,

        CLUB_CONTACT_NAME: process.env.CLUB_CONTACT_NAME,
        IS_QUARTERFULL: process.env.IS_QUARTERFULL === 'true',
        NEXT_QUARTER_END: process.env.NEXT_QUARTER_END,
        NEXT_QUARTER_START: process.env.NEXT_QUARTER_START,
    },
    serverRuntimeConfig: {},
    webpack: (config, options) => {
        if (options.isServer) {
            config.plugins.push(
                new ForkTsCheckerWebpackPlugin({
                    tsconfig: './tsconfig.json',
                    tslint: './tslint.json',
                }),
            );
        }
        return config;
    },
});
