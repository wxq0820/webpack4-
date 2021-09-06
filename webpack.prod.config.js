const {merge} = require('webpack-merge')
const base = require('./webpack.base.config')
const OptimizeCss = require("optimize-css-assets-webpack-plugin"); //压缩css

module.exports = merge(base,{
    mode: 'production',
    optimization: {
        minimizer: [
            new OptimizeCss()
        ]
    }
})