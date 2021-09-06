const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //抽离css
const OptimizeCss = require("optimize-css-assets-webpack-plugin"); //压缩css
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin"); //压缩js
const CleanWebpackPlugin = require('clean-webpack-plugin') //删除打包后的文件夹dist
const CopyWebpackPlugin = require('copy-webpack-plugin') //复制文件至指定打包后文件夹
const webpack = require('webpack')

module.exports = {
    mode: "development", //模式默认两种development、production
    //===========单入口==========
    entry: "./src/index.js", 
    output: {
        path: path.resolve(__dirname, "dist"), //路径必须是一个绝对路径，resolve将路径转为绝对路径
        filename: "bundle[hash:8].js", //打包后的文件,hash戳显示hash长度为8
        // publicPath: 'http://localhost:8080' //所有文件打包的公共路径
    },
    //=============多入口===========
    // entry: {
    //     home: './src/index.js',
    //     other: './src/other.js'
    // },
    // output: {
    //     filename: '[name].[hash:8].js',
    //     path: path.resolve(__dirname, 'dist')
    // },
    // plugins: [ //多页面
    //     new HtmlWebpackPlugin({
    //         template: './index.html',
    //         filename: 'home.html',
    //         chunks: ['home'] //需要引入的文件 
    //     }),
    //     new HtmlWebpackPlugin({
    //         template: './index.html',
    //         filename: 'other.html',
    //         chunks: ['other']
    //     }),
    // ],
    devServer: {
        port: 8080,
        hot: true,
        open: true,
        contentBase: "./dist", //默认打开文件夹路径
    },
    module: {
        //模块
        rules: [
            //规则
            {
                //css-loader解析@import语法
                //style-loader是把css插入到head标签中
                //less-loader将less转为css
                //多个loader使用数组，单个laoder使用字符串
                //loader顺序是从右向左，从下至上执行
                test: /\.css$/,
                use: {
                    loader: ["style-loader", "css-loader"],
                },
                //loader也可以写成对象的形式，此时可以向其配置属性
                // use: [
                //==================将css文件放在style标签内===========
                //     {
                //         loader: 'style-loader',
                //         options: {
                //             insertAt: 'top'
                //         }
                //     },
                //     'css-loader'
                // ]
                //==================将css文件抽离出来===========
                // use: [
                //     MiniCssExtractPlugin.loader, //将css抽离出来放到link标签内
                //     'css-loader'
                // ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.js$/, //normal 普通顺序的loader
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env", //es6转es5
                            "@babel/plugin-transform-runtime", //抽离公共部分
                        ],
                    },
                },
            },
            {
                test: /\.js$/,
                use: {
                    loader: "eslint-loader", //校验js eslint规范
                    options: {
                        enforce: "pre", //previous强制先执行 post强制后执行，默认为normal
                    },
                },
            },
            {
                //会在内部生成一张图片，并把图片名字返回,需要使用import将图片引入 
                //import bgc form './bgc.png'
                test: /\.(png|jpg|gif)$/,
                use: 'file-loader' 
            },
            {
                //限制图片大小小于200K时使用base64转化，否则使用file-loader产生真实图片
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'uel-loader',
                    options: {
                        limit: 200*1024,
                        output: '/img/', //将文件打包进img文件夹下
                        publicPath: 'http://loaclhost:8080' //图片的公共路径
                    }
                }
            },
            {
                test: /\.html$/,
                use: 'html-withimg-loader' //解析html内的图片
            }
        ],
    },
    plugins: [
        //数组放所有webpack插件
        new HtmlWebpackPlugin({
            title: "快速开始",
            template: "index.html", //模板文件
            filename: "index.html", //打包后的文件名
            minify: {
                //压缩html文件
                removeAttributeQuotes: true, //移除双引号
                collapseWhitespace: true, //单行
            },
            hash: true, //引用js时使用hash戳
        }),
        new MiniCssExtractPlugin({
            filename: "main.css",
        }),
        new CleanWebpackPlugin('./dist'), //打包前删除dist目录
        new CopyWebpackPlugin({
            from:'doc', //将doc文件夹下的东西拷贝进dist
            to: './'
        }),
        new webpack.BannerPlugin('Author by xxx') //在文件开头加上备注信息
    ],
    optimization: {
        //优化项,production模式才会启用
        minimizer: [
            new OptimizeCss(),
            new UglifyjsWebpackPlugin({
                cache: true, //是否缓存
                parallel: true, //是否并发打包
                sourceMap: true, //是否映射
            }),
        ],
    },
    //增加映射文件
    // devtool: 'source-map' //源码映射，会单独生成一个.map文件,出错了会标识当前报错的行和列
    // devtool: 'eval-source-map' //不会生成单独的文件但可以显示错误的行和列
    // devtool: 'cheap-module-source-map' //不会产生列，但是是一个单独的文件
    devtool: 'cheap-module-eval-source-map', //不会生成文件，集成在打包文件中，不会产生列（不提示具体位置）
    watch: true, //文件发生变化就自动打包
    watchOptions: {
        //监控的选项
        poll: 1000, //每秒问我1000次是否要打包
        aggregateTimeout: true, //防抖
        ignored: '/node_modules' //不需要监控的文件
    },
    devServer: {
        proxy: {
            // '/api': 'http://localhost:8080' //配置了一个代理服务器，以/api开头的都去找该端口
            '/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/api': ''} //将/api重写为空
            }
        }
    },
    resolve: {
        alias: { //设置别名
            '@': resolve('src')
        }
    }
};
