const withTypescript = require('@zeit/next-typescript');
const withStylus = require('@zeit/next-stylus');
const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
module.exports = withPlugins([withTypescript, withCSS, withStylus]);
