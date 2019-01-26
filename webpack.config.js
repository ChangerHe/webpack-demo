const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  console.log("env =========================", env)
  console.log("argv =========================", argv)
  const devMode = argv.mode !== 'production'
  return {
    devServer: {
      port: 3000, //端口号
    },
    entry: [
      "babel-polyfill",
      path.join(__dirname, './src/index.js')
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader',
          ]
        },
        {
          test: /\.html$/,
          use: [{
            loader: "html-loader",
            options: {
              minimize: true
            }
          }]
        },
        {
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
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html"
      }),
      new CleanWebpackPlugin(['dist'])
    ]
  }
}