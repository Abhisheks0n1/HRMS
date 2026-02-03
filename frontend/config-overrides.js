const {
  override,
  addWebpackAlias,
  useBabelRc,
} = require('customize-cra');
const path = require('path');
const webpack = require('webpack');

module.exports = override(
  useBabelRc(),

  addWebpackAlias({
    '@components': path.resolve(__dirname, 'src/components'),
  }),

  (config) => {
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
    ];
    return config;
  }

);
