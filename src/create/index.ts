import { resolve } from 'path'
import { existsSync } from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import validateProjectName = require('validate-npm-package-name')
import download = require('download-git-repo')

export class Create {
  constructor(projectName: string) {
    const result = validateProjectName(projectName)
    if (!result.validForNewPackages) {
      console.error(chalk.red(`Invalid project name: '${projectName}'`))
      const errors = result.errors
      if (errors) {
        errors.forEach(err => {
          console.error(chalk.red(err))
        })
      }
      process.exit(1)
    }
    const targetDir = resolve(process.cwd(), projectName)
    if (existsSync(targetDir)) {
      console.error(chalk.red(`Target directory ${chalk.cyan(targetDir)} already exists.`))
      process.exit(1)
    }
    const spinner = ora('正在从 https://github.com/aygtech/weexbox-template 下载模板\n如果您的网络不好，可以手动下载').start()
    download('aygtech/weexbox-template', targetDir, (err) => {
      spinner.stop()
      console.log(err ? err : `${projectName} is created!`)
    })
  }
}
