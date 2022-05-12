const { merge } = require('webpack-merge');
const baseConf = require('./webpack.config.base');

module.exports = merge(baseConf, {
  devtool: 'source-map',
  mode: 'production',
  output: {
    publicPath: ''
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        chunks: 'initial',
        minChunks: 2,
        maxInitialRequests: 5,
        minSize: 0,
        name: 'vendors',
      }
    },
    minimizer: [
      // new CssMinimizerPlugin({})
    ]
  },
})