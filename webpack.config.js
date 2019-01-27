const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env, argv) => {
  console.log("env =========================", env)
  console.log("argv =========================", argv)
  const devMode = argv.mode !== 'production'
  return {
    devServer: {
      port: 3000, //端口号
    },
    entry: [
      "babel-polyfill", path.join(__dirname, './src/index.js')
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }, {
          test: /\.less$/,
          use: [
            devMode
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader'
          ]
        }, {
          test: /\.(sc|sa|c)ss$/,
          use: [
            {
              loader: 'style-loader'
            }, {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: loader => [// 可以配置多个插件
                  require('autoprefixer')({browsers: [' > 0.15% in CN ']})]
              }
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }, {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                minimize: true
              }
            }
          ]
        }, {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({filename: "[name].css", chunkFilename: "[id].css"}),
      // new ExtractTextPlugin('style.css'),
      new HtmlWebPackPlugin({template: "./public/index.html", filename: "./index.html"}),
      new CleanWebpackPlugin(['dist'])
    ]
  }
}