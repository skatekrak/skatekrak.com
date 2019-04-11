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
    webpack: (config, options) => {
        if (options.isServer) {
            config.plugins.push(
                new ForkTsCheckerWebpackPlugin({
                    tsconfig: './tsconfig.json',
                    tslint: './tslint.json',
                }),
            );
        }
        config.plugins.push(
            new webpack.EnvironmentPlugin([
                'STRIPE_KEY',
                'CAIROTE_URL',
                'SESTERCES_URL',
                'RSS_BACKEND_URL',
                'INTERCOM_ID',
                'CACHING_URL',
                'REDIRECT_URL',
                'BEARER',
                'RENEW_DATE',
                'RENEW_DATE_QUARTERFULL',
            ]),
        );
        return config;
    },
});
