#! /usr/bin/env node
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const { Create } = require('../lib/create/create')
const { Doctor } = require('../lib/doctor')

program
  .version(fs.readJsonSync(path.join(__dirname, '../package.json')).version, '-v, --version')

program
  .command('create <projectName>')
  .description('使用 weexbox 创建工程')
  .action((projectName) => {
    new Create(projectName)
  })

program
  .command('doctor')
  .description('检查')
  .action(() => {
    let spinner = logger.spin(`Verify iOS and Android environment ...`)
    const doctor = new Doctor()
    console.log(doctor.diagnose())
  })

program.parse(process.argv)
