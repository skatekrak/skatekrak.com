const withTypescript = require('@zeit/next-typescript');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const webpack = require('webpack');
const { parsed: localEnv } = require('dotenv').config();

module.exports = withPlugins([withTypescript, withCSS, withStylus], {
    webpack: (config, options) => {
        config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
        return config;
    },
});
