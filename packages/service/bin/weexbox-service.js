#! /usr/bin/env node

const program = require('commander')

program
  .command('debug')
  .description('调试页面')
  .action()

program
  .command('build')
  .description('编译')
  .action(() => {
    const build = require('../lib/webpack/build')
    build.execute()
  })

program
  .command('update')
  .description('生成 热更新包')
  .action(() => {
    const update = require('../lib/hot-update/update')
    update.execute()
  })

  program
  .command('copy')
  .description('热更新包 拷贝到 Android 和 iOS')
  .action(() => {
    const copy = require('../lib/hot-update/copy')
    copy.execute()
  })

  program.parse(process.argv)