const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const alias = require('./common/alias');
const loaders = require('./common/loaders');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  mode: 'production',
  module: {
    rules: Object.values(loaders),
  },
  resolve: {
    alias,
    extensions: ['.js', '.jsx', '.css', '.less'],
    modules: [path.resolve('src'), path.resolve('node_modules')],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      inject: 'body',
    })
  ],
  // performance: {
  //   hints: 'warning',
  // },
}