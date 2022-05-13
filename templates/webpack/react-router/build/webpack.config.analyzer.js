const { merge } = require('webpack-merge');
const prodConf = require('./webpack.config.prod');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(prodConf, {
  plugins: [new BundleAnalyzerPlugin()],
})