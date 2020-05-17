const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.NEXT_PUBLIC_ANALYZE === 'true',
});

module.exports = withPlugins([withBundleAnalyzer, withCSS, withStylus, withCustomBabelConfigFile], {
    babelConfigFile: path.resolve('./babel.config.js'),
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
