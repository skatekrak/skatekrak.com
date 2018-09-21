const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  webpack(config, option) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    return config
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' }
    }
  }
})