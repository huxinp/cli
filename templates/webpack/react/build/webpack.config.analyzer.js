const { merge } = require('webpack-merge');
const baseConf = require('./webpack.config.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseConf, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [new BundleAnalyzerPlugin()]
})
