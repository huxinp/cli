const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const alias = require('./common/alias');
const loaders = require('./common/loader');

const { BUILD_OUTPUT_DIR = path.resolve('dist'), BUILD_TYPE } = process.env;

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: '[name].[contenthash:8].js',
    path: BUILD_OUTPUT_DIR,
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css'],
    modules: [path.resolve('src'), path.resolve('node_modules')],
    alias,
  },
  module: {
    rules: Object.values(loaders),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BUILD_TYPE': JSON.stringify(BUILD_TYPE),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      inject: 'body',
    })
  ]
}