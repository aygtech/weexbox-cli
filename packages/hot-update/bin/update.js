#! /usr/bin/env node
const argv = require('yargs').argv._
const cmd = argv[0]

switch(cmd) {
  case 'init':
  case 'build':
  case 'clear':
  case 'mobile':
    const command = require(`../lib/${cmd}`)
    command.execute(argv)
    break
  default:
    require('../lib/version')
    process.exit(0)
}
