#! /usr/bin/env node

const program = require('commander')

program
  .command('debug')
  .description('调试页面')
  .action()

program
  .command('build')
  .description('打包')
  .action()

program
  .command('update')
  .description('生成 热更新包')
  .action()

  program
  .command('android')
  .description('热更新包 拷贝到 Android')
  .action()

  program
  .command('ios')
  .description('热更新包 拷贝到 iOS')
  .action()