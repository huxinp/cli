const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseConf = require('./webpack.config.base');

module.exports = merge(baseConf, {
  devtool: 'source-map',
  mode: 'production',
  output: {
    publicPath: ''
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css',
      ignoreOrder: true,
    }),
  ],
  optimization: {
    moduleIds: 'named',
    concatenateModules: true,
    mergeDuplicateChunks: true,
    nodeEnv: 'production',
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          name: 'vendors',
        }
      }
    },
  },
})