const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.config')

const plugins = [
  new UglifyJsPlugin({
    parallel: true
  }),
  new webpack.BannerPlugin({
    banner: '// { "framework": "Vue"} \n',
    raw: true,
    exclude: 'Vue'
  })
]

const weexConfig = merge({ plugins }, common)

module.exports = weexConfig
