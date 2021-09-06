plugin插件：
html-webpack-plugin
mini-css-extract-plugin //抽离css
optimize-css-assets-webpack-plugin //压缩css
uglifyjs-webpack-plugin //压缩js
cleanWebpackPlugin //可在打包前删除dist文件夹
copyWebpackPlugin //复制文件夹内文件至指定打包文件
bannerPlugin 内置模块 //在文件开头加上备注信息


loader：
=======处理样式文件=========
css-loader //解析@import语法
style-loader //把css插入到head标签中
less-loader //将less转为css
postcss-loader autoprefixer //自动添加css前缀,需要配置postcss.config,js文件
========处理js文件==========
babel-loader @babel/core @babel/preset-env //js处理，es6转es5
@babel/polyfill //重写不能实现的高级语法，在js内require('@babel/polyfill')
@babel/plugin-transform-runtime //抽离公共js部分
eslint eslint-loader //js语法检测
=========处理图片========
图片的引入方式：
1.js中创建
2.css中background引入
3.img标签引入
file-loader //默认会在内部生成一张图片，并把图片名字返回,需要使用import将图片引入import bgc form './bgc.png'
html-withimg-loader //解析html内的图片
url-loader //设置文件大小小于多少时使用base64解析


devtool//增加映射文件
'source-map' //源码映射，会单独生成一个.map文件,出错了会标识当前报错的行和列
'eval-source-map' //不会生成单独的文件但可以显示错误的行和列
'cheap-module-source-map' //不会产生列，但是是一个单独的文件
'cheap-module-eval-source-map' //不会生成文件，集成在打包文件中，不会产生列（不提示具体位置）


跨域
devServer.proxy内配置，但仅开发环境可用

区分不同的环境，可以建3个webpack配置文件，一个基础的，一个开发一个生产，使用webpack-merge合并