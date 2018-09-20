const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

function execute() {
  webpack(webpackConfig, (err, stats) => {
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        warnings: false,
        entrypoints: false,
        assets: false,
        hash: false,
        version: false,
        timings: false,
        builtAt: false
      })
    )
  })
}

exports.execute = execute
