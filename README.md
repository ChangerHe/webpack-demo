# webpack-demo

一个基于 webpack4 所一步一步搭建的个人脚手架项目

# 配置详细步骤

## 零配置启动

需要零配置启动, 我们需要在工程目录中下载 webpack 的依赖

```
npm init -y
yarn add webpack webpack-cli -D
```

在 package.json 文件中, 我们配置一下运行的配置文件

```
"scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
},
```

webpack4 自带了代码压缩混淆的功能, 直接设置其 mode 为 production, 此时会自动进行代码混淆

在零配置情况下, webpack 会自动将`/src/index.js`作为入口文件, 将代码处理后将会输出到`/dist/main.js`中

## 在项目中引入 babel 来进行代码兼容转换

```
yarn add  babel-core babel-loader babel-preset-env -D
```

同样的, 我们在根目录中新建一个 babel 的配置文件`.babelrc`

此时建议锁定版本, babel 可能因为相互依赖的问题而导致项目编译失败

```
"babel-core": "^6.26.3",
"babel-loader": "^7.0.5",
"babel-preset-env": "^1.7.0",
```

## 使用 babel-polyfill 解决兼容问题

```
yarn add -D babel-polyfill babel-plugin-transfrom-runtime
```

同样的, 要让配置生效, 我们需要在.babelrc 中使用这个插件

```
{
    "presets": [
        "env"
    ],
    "plugins": [
      "transform-runtime"
    ]
}
```

## 编译 css

这一步我们对 css 进行编译, 其中包含自动添加前缀和抽取 css 到独立文件

- 在 webpack4 之前我们都是使用的`extract-text-webpack-plugin`来处理 css 文件, 现在 webpack4 的推荐依赖是`mini-css-extract-plugin`

同时, 我们需要添加相应的 loader 方便对文件进行处理

```
yarn add -D mini-css-extract-plugin postcss-loader css-loader style-loader
```

```
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production'
  return {
    module: {
      rules: [
        // ...,
        {
            test: /\.css$/,
            use: [
                devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ]
        },
        ]
      },
      plugins: [
        // ...,
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        })
      ]
  }
}
```

```
// postcss.config.js
module.exports = {
    plugins: {
        autoprefixer: {}
    }
}
```

## 复制并压缩 html 文件

```
yarn add -D html-loader html-webpack-plugin
```

```
// webpack.config.js
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
    module: {
        rules: [
            // ...,
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]
};
```

## 打包前清理原目录文件

```
yarn add -D clean-webpack-plugin
```

```
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    plugins: [
        new CleanWebpackPlugin(['dist']),
    ]
};
```

## 静态文件处理

```
yarn add -D file-loader
```

```
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jp(e)?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
                limit: 10000,
                // 定义文件输出名称
                name: '[name]-[hash:5].[ext]',
                // 输出路径为img文件夹下
                outputPath: 'img/'
            }
          }, {
              // 处理图片压缩等
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
          }, {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    // 文件大小小于limit参数，url-loader将会把文件转为DataURL
                    limit: 10000,
                    name: '[name]-[hash:5].[ext]',
                    output: 'fonts/',
                    // publicPath: '', 多用于CDN
                }
          }

        ]
      }
    ]
  }
}
```

## dev 模式下实现自动刷新

```
yarn add -D webpack-dev-server
```

```
"scripts": {
  "start": "webpack-dev-server --mode development --open",
  "build": "webpack --mode production"
}
```

## 区分生产还是开发环境

通常情况下, 我们需要配置webpack在dev模式下和prod模式下 的不同参数, 这个时候我们可以定义三个文件

```
webpack.base.config.js
webpack.dev.config.js
webpack.prod.config.js
```

我们通过`webpack-merge`插件来实现dev和prod中都基于原本的webpack.base来进行配置

```
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')

module.exports = merge(baseWebpackConfig, {
    // custom configs
})
```

## webpack配置js使用sourceMap

```
devtool: 'inline-source-map'
```

## 压缩less/sass的css代码

```
optimization: {
    minimizer: [// 压缩CSS
    new OptimizeCSSAssertsPlugin({})]
},
```

## 打包分析

```
yarn add -D webpack-bundle-analyzer
```

在package.json中加入如下命令

```
"build:report": "cross-env NODE_ENV=production webpack --mode production --config webpack.analysis.config.js --report"
```

建议与原有代码分离开来进行分析, 因此我们额外增加一个`webpack.analysis.config.js`文件, 并合并入prod的参数

```
const merge = require('webpack-merge')
const prodWebpackConfig = require('./webpack.prod.config.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(prodWebpackConfig, {
  plugins: [
    new BundleAnalyzerPlugin() // 打包分析
  ]
})
```

## 引入 react 相关内容

```
yarn add react react-dom
yarn add -D babel-preset-react less less-loader
```

```
// .babelrc
{
  "presets": ["env", "react"]
}
```

```
// webpack.config.js
const path = require('path');
module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production'
    return {
        entry: [
            "babel-polyfill",
            path.join(__dirname, './src/index.js')
        ],
        devServer: {
            port: 3000, //端口号
        },
        module: {
            rules: [
                // ...
                // 处理react
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                // 处理less
                {
                    test: /\.less$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'less-loader',
                    ]
                }
            ]
        }
    }
};
```

以上的配置你会发现, 我们无法实现像之前在脚手架中的一样, 正常的使用`css-modules`了, 也就是我们在react的jsx中`<div className={styles.index} />`这样写就完全无法生效了, 此时是因为我们在css-loader中没有将css转化为module的形式

现在看一个更加个性化的配置方式

```
{
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
        // 开启css的module形式
        modules: true,
        // 定义module的名称
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
}
```

