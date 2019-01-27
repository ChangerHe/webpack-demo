const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssertsPlugin = require('optimize-css-assets-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
const devMode = process.env.NODE_ENV !== 'production'
module.exports = (env, argv) => {
  console.log("env =========================", env)
  console.log("argv =========================", argv)
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
            loader: "babel-loader?cacheDirectory", // 通过cacheDirectory选项开启支持缓存
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }, {
          test: /\.less$/,
          use: [
            devMode
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader?modules',
            'postcss-loader',
            'less-loader'
          ]
        }, {
          test: /\.(sc|sa|c)ss$/,
          use: [
            {
              loader: devMode
                ? 'style-loader'
                : MiniCssExtractPlugin.loader
            }, {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true,
                localIdentName: '[name]__[local]-[hash:base64:5]'
              }
            }, {
              loader: 'postcss-loader',
              // 更加个性化的配置方式
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
          test: /\.(png|jp(e)?g|gif|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[name]-[hash:5].[ext]',
                outputPath: 'img/'
              }
            }, {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75
                }
              }
            }
          ]
        }, {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            // 文件大小小于limit参数，url-loader将会把文件转为DataUR
            limit: 10000,
            name: '[name]-[hash:5].[ext]',
            output: 'fonts/',
            // publicPath: '', 多用于CDN
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode
          ? '[name].css'
          : '[name].[hash:5].css', // 设置输出的文件名
        chunkFilename: devMode
          ? '[id].css'
          : '[id].[hash:5].css'
      }),
      new HtmlWebPackPlugin({title: 'Webapck-demo by ChangerHe', template: "./public/index.html", filename: "./index.html"}),
      // TODO fix clean dist when devloping
      new CleanWebpackPlugin(['dist'])
    ],
    optimization: {
      minimizer: [// 压缩CSS
        new OptimizeCSSAssertsPlugin({})]
    },
    devtool: devMode ? 'inline-source-map' : ''
  }
}