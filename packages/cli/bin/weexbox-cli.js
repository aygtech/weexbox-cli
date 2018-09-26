#! /usr/bin/env node
const program = require('commander')

program
  .command('create <projectName>')
  .description('使用 weexbox 创建工程')
  .action((projectName) => {
    require('../lib/index')(projectName)
  })

program.parse(process.argv)
