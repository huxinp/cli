const { merge } = require('webpack-merge');
const baseConf = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(baseConf, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: true,
    }),
  ],
  optimization: {
    nodeEnv: 'development',
  },
  devServer: {
    hot: true,
    open: true,
    host: '0.0.0.0',
    port: 3000,
  }
})
