const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const baseConf = require('./webpack.config.base');

module.exports = merge(baseConf, {
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  output: {
    filename: '[name].js',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(), 
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
    // client: {
    //   // progress: true,
    //   overlay: {
    //     errors: true,
    //     warnings: false,
    //   },
    //   reconnect: 3,
    // },
    // compress: true, // gzip压缩
    open: true,
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    // proxy: {
    //   headers: {
		// 		'Access-Control-Allow-Origin': '*',
		// 		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
		// 		'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    //   },
    //   'demo/api': {
    //     target: 'https://www.baidu.com',
    //     changeOrigin: true,
    //     secure: true,
    //   }
    // }
  }
})