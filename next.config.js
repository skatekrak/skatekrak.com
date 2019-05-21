const path = require('path');

const withTypescript = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');

const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const webpack = require('webpack');

module.exports = withPlugins([withCSS, withStylus, withCustomBabelConfigFile, withTypescript], {
    babelConfigFile: path.resolve('./babel.config.js'),
    publicRuntimeConfig: {
        NODE_ENV: process.env.NODE_ENV,
        BEARER: process.env.BEARER,
        CACHING_URL: process.env.CACHING_URL,
        CAIROTE_URL: process.env.CAIROTE_URL,
        INTERCOM_ID: process.env.INTERCOM_ID,
        REDIRECT_URL: process.env.REDIRECT_URL,
        RSS_BACKEND_URL: process.env.RSS_BACKEND_URL,
        SESTERCES_URL: process.env.SESTERCES_URL,
        STRIPE_KEY: process.env.STRIPE_KEY,
        IS_QUARTERFULL: process.env.IS_QUARTERFULL === 'true',
        NEXT_QUARTER_START: process.env.NEXT_QUARTER_START,
        NEXT_QUARTER_END: process.env.NEXT_QUARTER_END,
        CLUB_CONTACT_NAME: process.env.CLUB_CONTACT_NAME,
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
