#! /usr/bin/env node
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')

program
  .version(fs.readJsonSync(path.join(__dirname, '../package.json')).version, '-v, --version')
  .command('create <projectName>')
  .description('使用 weexbox 创建工程')
  .action((projectName) => {
    require('../built/create').Create(projectName)
  })

program.parse(process.argv)
