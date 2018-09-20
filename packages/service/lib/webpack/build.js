const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

function execute() {
  webpack(webpackConfig, (err, stats) => {
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        
      })
    )
  })
}

exports.execute = execute
