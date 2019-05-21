#! /usr/bin/env node
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const { Create } = require('../lib/create')
const { Doctor } = require('../lib/doctor')

program
  .version(fs.readJsonSync(path.join(__dirname, '../package.json')).version, '-v, --version')

program
  .command('create <projectName>')
  .description('使用 weexbox 创建工程')
  .action((projectName) => {
    Create.createProject(projectName)
  })

program
  .command('doctor')
  .description('检查')
  .action(() => {
    console.log('Verify iOS and Android environment ...')
    const doctor = new Doctor()
    console.log(doctor.diagnose())
  })

program
.command('page <pageName>')
.description('快速创建页面')
.option('-t, --template <tempalte_dir>', '自定义页面模板路径')
.action(( pageName, options) => {
  console.log(options);
  Create.createPage(pageName, options.template)
})

program.parse(process.argv)
