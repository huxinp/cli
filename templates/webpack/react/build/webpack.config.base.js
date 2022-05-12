const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const alias = require('./common/alias');
const loaders = require('./common/loader');

const { BUILD_OUTPUT_DIR = path.resolve('dist'), NODE_ENV = 'development', BUILD_TYPE } = process.env;

const __isDEV = NODE_ENV === 'development';

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: BUILD_OUTPUT_DIR,
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
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.BUILD_TYPE': JSON.stringify(BUILD_TYPE),
    }),
    new MiniCssExtractPlugin({
      filename: __isDEV ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: __isDEV ? '[id].css' : '[id].[contenthash].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      inject: 'body',
    })
  ]
}