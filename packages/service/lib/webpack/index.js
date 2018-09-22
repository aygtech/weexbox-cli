const webpack = require('webpack')

function execute(name) {
  const webpackConfig = require(`./webpack.${name}.config`)
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
