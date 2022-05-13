const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  js: {
    test: /\.js/,
    exclude: [/^node_modules/],
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      }
    },
    include: [path.resolve('src')]
  },
  css: {
    test: /\.(css|less)/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: false,
        }
      },
      {
        loader: 'css-loader',
        options: {
          modules: {
						localIdentName: '[local]_[hash:base64:4]',
          }
        }
      },
      'postcss-loader',
      'less-loader',
    ]
  },
  img: {
    test: /\.(eot|svg|ttf|woff|woff2|svga|png|jpg|gif|webp)$/i,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 5120,
          name: 'images/[name]-[hash:base64:5].[ext]?[hash:base64:4]'
        },
      }
    ]
  }
}