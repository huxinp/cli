const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConf = require('./webpack.config.base');

module.exports = merge(baseConf, {
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  output: {
    filename: '[name].js',
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
  devServer: {
    hot: true,
    port: 3000,
    host: '127.0.0.1',
    proxy: {
      headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      'demo/api': {
        target: 'https://www.baidu.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})