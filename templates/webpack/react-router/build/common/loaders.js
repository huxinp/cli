const { webpack } = require("webpack");
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  jsloader: {
    test: /\.(js|jsx)$/,
    exclude: [/^node_modules/],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          cacheDirectory: true,
        },
      }
    ],
    include: [path.resolve('src')],
  },
  cssloader: {
    test: /\.(less|css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[local]-[hash:base64:4]',
          },
        }
      },
      'postcss-loader',
      'less-loader',
    ]
  },
  imgloader: {
    test: /\.(png|jpg|gif|webp|eot|svg|svga|woff|ttf|woff2)$/i,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 5120,
          name: '[name].[hash:base64:5].[ext]?[hash:base64:4]'
        }
      }
    ]
  }
}