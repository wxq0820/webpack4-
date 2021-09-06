const {merge} = require('webpack-merge')
const base = require('./webpack.base.config')

module.exports = merge(base,{
    mode: 'development',
    devServer: {
        proxy: {
            // '/api': 'http://localhost:8080' //配置了一个代理服务器，以/api开头的都去找该端口
            '/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/api': ''} //将/api重写为空
            }
        }
    }
})