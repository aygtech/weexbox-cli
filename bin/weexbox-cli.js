#! /usr/bin/env node
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const { Create } = require('../lib/create')
const { Doctor } = require('../lib/doctor')
const { Refimg } = require('../lib/refimg')

program
  .version(fs.readJsonSync(path.join(__dirname, '../package.json')).version, '-v, --version')

program
  .command('create <projectName>')
  .description('使用 weexbox 创建工程')
  .option('-f, --flutter', '含flutter的工程')
  .action((projectName, options) => {
    Create.createProject(projectName, options)
  })

program
  .command('doctor')
  .description('检查')
  .action(() => {
    console.log('检查环境中 ...')
    const doctor = new Doctor()
    console.log(doctor.diagnose())
  })
 
program
  .command('page <pageNmae>')
  .description('在 src 目录下快速创建页面，支持多级路径，示例：weexbox page personCenter/profile')
  .option('-t, --template <template_dir>', '自定义模板文件所在目录')
  .action((pageName, options) => {
    Create.createPage(pageName, options.template)
  })
program
  .command('refimg')
  .description('刷新flutter图片配置')
  .action(() => {
    Refimg.start()
    // const doctor = new Doctor()
    // console.log(doctor.diagnose())
  })   

program.parse(process.argv)
