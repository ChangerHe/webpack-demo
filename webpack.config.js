const path = require('path')
const webpack = require('webpack');
const HappyPack = require('happypack');
const os = require('os');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssertsPlugin = require('optimize-css-assets-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
const devMode = process.env.NODE_ENV !== 'production'
module.exports = (env, argv) => {
  return {
    devServer: {
      port: 3000, //端口号
    },
    // entry: [   "babel-polyfill", path.join(__dirname, './src/index.js') ],
    entry: {
      pageOne: [
        "babel-polyfill", path.join(__dirname, './src/index.js')
      ],
      pageTwo: [
        "babel-polyfill", path.join(__dirname, './src/index1.js')
      ]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          // use: {
          //   loader: "babel-loader?cacheDirectory", // 通过cacheDirectory选项开启支持缓存
          //   options: {
          //     presets: ['@babel/preset-env']
          //   }
          // }
          use: "happypack/loader?id=happyBabel"
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
      new CleanWebpackPlugin(['dist']),
      new webpack
        .optimize
        .SplitChunksPlugin({
          chunks: "all",
          minSize: 20000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          name: true
        }),
      new webpack.DllReferencePlugin({
        context: __dirname, // 与DllPlugin中的那个context保持一致
        /** 
            下面这个地址对应webpack.dll.config.js中生成的那个json文件的路径
            这样webpack打包时，会检测此文件中的映射，不会把存在映射的包打包进bundle.js
        **/
        manifest: require('./dll/vendor-manifest.json')
      }),
      new AddAssetHtmlPlugin({ filepath: require.resolve('./dll/vendor.dll.js') }),
      new HappyPack({
          //用id来标识 happypack处理那里类文件
        id: 'happyBabel',
        //如何处理  用法和loader 的配置一样
        loaders: [{
          loader: "babel-loader", // 通过cacheDirectory选项开启支持缓存
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env']
          }
        }],
        //共享进程池
        threadPool: happyThreadPool,
        //允许 HappyPack 输出日志
        verbose: true,
      })
    ],
    optimization: {
      minimizer: [// 压缩CSS
        new OptimizeCSSAssertsPlugin({})],
    },
    devtool: devMode
      ? 'inline-source-map'
      : ''
  }
}