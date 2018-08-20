#! /usr/bin/env node

const cmd = require('yargs').argv._[0]

switch(cmd) {
  case 'hash':
    const command = require(`../lib/${cmd}`)
    command.execute()
    break
  default:
    require('../lib/version')
    process.exit(0)
}
