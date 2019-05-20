#! /usr/bin/env node
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const lib = require('../lib/index')

program
  .version(fs.readJsonSync(path.join(__dirname, '../package.json')).version, '-v, --version')
  .command('create <projectName>')
  .description('使用 weexbox 创建工程')
  .action((projectName) => {
    lib.create(projectName)
  })
 
program
  .command('page <pageNmae>')
  .description('在 src 目录下创建页面，支持多级路径，如：weexbox page class1/page')
  .option('-t, --template <template>', '自定义模板文件所在目录')
  .action((pageName, options) => {
    lib.createPage(pageName, options.template)
  })  

program.parse(process.argv)
