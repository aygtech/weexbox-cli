const config = require('./config')
const glob = require('glob')
const helper = require('./helper')

exports.cssLoaders = function (options) {
  options = options || {}
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  const generateLoaders = (loader, loaderOptions) => {
    let loaders = options.useVue ? [cssLoader] : []
    if (options.usePostCSS) {
      loaders.push(postcssLoader)
    }
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    if (options.useVue) {
      return ['vue-style-loader'].concat(loaders)
    }

      return loaders

  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp(`\\.${  extension  }$`),
      use: loader
    })
  }

  return output
}

// 多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.getEntries = function (target) {
  const pagePath = helper.projectPath(config.sourceDir)
  return entries(`${pagePath  }/*/*/index.js`, target)
}

function entries(globPath, target) {
  const entries = {}
  /**
   * 读取src目录,并进行路径裁剪
   */
  glob.sync(globPath).forEach((indexEntry) => {
    const tmp = indexEntry.split('/').splice(-3)
    // var moduleName = tmp.slice(1, 2).toString()
    const moduleName = `${tmp.slice(0, 1).toString()}/${tmp.slice(1, 2).toString()}`
    if (target === 'web') {
      const renderEntry = indexEntry.replace('index.js', 'render.js')
      entries[moduleName] = [renderEntry, indexEntry]
    } else {
      entries[moduleName] = [indexEntry]
    }
  })
  // console.log(JSON.stringify(entries))
  return entries
}
