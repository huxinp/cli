const { merge } = require('webpack-merge');
const baseConf = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(baseConf, {
  devtool: 'source-map',
  mode: 'production',
  output: {
    publicPath: ''
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:5].css',
      chunkFilename: '[id].[contenthash:5].css',
      ignoreOrder: true,
    })
  ],
  optimization: {
    nodeEnv: 'production',
    splitChunks: {
      minChunks: 2,
      cacheGroups: {
        defaultVendors: {
          name: 'vendors',
          minChunks: 2,
          chunks: 'initial',
          maxInitialRequests: 5,
        }
      }
    }
  }
})