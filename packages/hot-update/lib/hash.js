const fs = require('fs-extra')
const crypto = require('crypto')
const path = require('path')
// const xattr = require('fs-xattr')
// 获取所有静态文件路径及名称
const staticPath = './static'
const staticTempPath = './deploy/static'
const srcPath = './src'
const componentsPath = './components'
const staticFiles = []
const fileHash = {}
const pathHash = {}

const createStaticFiles = (path) => {
  const dirPath = fs.readdirSync(path)
  dirPath.forEach((i) => {
    const childPath = `${path}/${i}`
    if (fs.lstatSync(childPath).isFile()) {
      staticFiles.push(childPath)
    } else {
      createStaticFiles(childPath)
    }
  })
}

// 文件替换
const funs = [
  'formatImage',
]

const fileReplace = (path) => {
  Object.keys(pathHash).forEach((a) => {
    const fileString = fs.readFileSync(path).toString()
    funs.forEach((i) => {
      const info = pathHash[a]
      // const reg = new RegExp(`${i}\\(\\'${info.name}+(\\.{0,1})([a-z0-9]{0,7})${info.ext}\\'\\)`, 'g')
      const reg = new RegExp(`${i}\\(\\'${info.name}(\\.[a-z0-9]{0,7})?\\'\\)`, 'g')
      if (reg.test(fileString)) {
        const fileEndString = fileString.replace(reg, `${i}('${info.name}.${info.hash}')`)
        fs.writeFileSync(path, fileEndString)
        // 改 staticTempPath 里的文件名
        const oldPath = `${staticTempPath}/${info.name}${info.ext}`
        const newPath = `${staticTempPath}/${info.name}.${info.hash}${info.ext}`
        if (fs.pathExistsSync(oldPath)) {
          fs.renameSync(oldPath, newPath)
          // // 删除扩展属性
          // const attributes = xattr.listSync(newPath)
          // for (const attribute in attributes) {
          //   xattr.removeSync(newPath, attribute)
          // }
          // // 修改权限
          // fs.chmodSync(newPath, 644)
        }
        // console.log(`路径是：${path}, 关健字是：${a}`)
      }
    })
  })
}

// 判断是文件夹一直循环下去
const replaceStatic = (path) => {
  const dir = fs.readdirSync(path)
  dir.forEach((i) => {
    const childPath = `${path}/${i}`
    if (fs.lstatSync(childPath).isFile()) {
      // 执行替换函数
      fileReplace(childPath)
    } else {
      replaceStatic(childPath)
    }
  })
}

const execute = function () {
  fs.removeSync(staticTempPath)
  fs.copySync(staticPath, staticTempPath)
  createStaticFiles(staticPath)
  // console.log(staticFiles)
  // 根据所有的文件生成hash值
  staticFiles.forEach((i) => {
    const file = fs.readFileSync(i)
    const md5 = crypto.createHash('md5')
    const buf = md5.update(file)
    const hash = buf.digest('hex').substring(0, 7)
    fileHash[i] = hash
  })
  // console.log(fileHash)
  Object.keys(fileHash).forEach((e) => {
    const pathParse = path.parse(e)
    const basename = path.basename(e)
    pathHash[basename] = {}
    pathHash[basename].name = pathParse.name
    pathHash[basename].ext = pathParse.ext
    pathHash[basename].hash = fileHash[e]
  })
  // console.log(pathHash)
  replaceStatic(srcPath)
  replaceStatic(componentsPath)
  console.log('static 替换成功')
}

exports.execute = execute
