const withTypescript = require('@zeit/next-typescript');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const webpack = require('webpack');

module.exports = withPlugins([withTypescript, withCSS, withStylus], {
    webpack: (config, options) => {
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
