# webpack-demo

一个基于webpack4所一步一步搭建的个人脚手架项目

# 配置详细步骤

## 零配置启动

需要零配置启动, 我们需要在工程目录中下载webpack的依赖

```
npm init -y
yarn add webpack webpack-cli -D
```

在package.json文件中, 我们配置一下运行的配置文件

```
"scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
},
```

webpack4自带了代码压缩混淆的功能, 直接设置其mode为production, 此时会自动进行代码混淆

在零配置情况下, webpack会自动将`/src/index.js`作为入口文件, 将代码处理后将会输出到`/dist/main.js`中

## 在项目中引入babel来进行代码兼容转换

```
yarn add  babel-core babel-loader babel-preset-env -D
```

同样的, 我们在根目录中新建一个babel的配置文件`.babelrc`

此时建议锁定版本, babel可能因为相互依赖的问题而导致项目编译失败

```
"babel-core": "^6.26.3",
"babel-loader": "^7.0.5",
"babel-preset-env": "^1.7.0",
```

## 使用babel-polyfill解决兼容问题

```
yarn add -D babel-polyfill babel-plugin-transfrom-runtime
```

同样的, 要让配置生效, 我们需要在.babelrc中使用这个插件

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

## 编译css

这一步我们对css进行编译, 其中包含自动添加前缀和抽取css到独立文件

- 在webpack4之前我们都是使用的`extract-text-webpack-plugin`来处理css文件, 现在webpack4的推荐依赖是`mini-css-extract-plugin`

同时, 我们需要添加相应的loader方便对文件进行处理

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

## 复制并压缩html文件

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
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  }
}
```

## dev模式下实现自动刷新

```
yarn add -D webpack-dev-server
```

```
"scripts": {
  "start": "webpack-dev-server --mode development --open",
  "build": "webpack --mode production"
}
```

## 引入react相关内容

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