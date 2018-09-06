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
  .action(() => {
    const update = require('../lib/update')
    update.execute()
  })

  program
  .command('copy')
  .description('热更新包 拷贝到 Android 和 iOS')
  .action(() => {
    const copy = require('../lib/copy')
    copy.execute()
  })

  program.parse(process.argv)