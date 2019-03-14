#! /usr/bin/env node
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const create = require('../built/create')

program
  .version(fs.readJsonSync(path.join(__dirname, '../package.json')).version, '-v, --version')
  .command('create <projectName>')
  .description('使用 weexbox 创建工程')
  .action((projectName) => {
    new create.Create(projectName)
  })

program.parse(process.argv)
