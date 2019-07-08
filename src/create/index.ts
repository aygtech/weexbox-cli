import { resolve } from 'path'
import { existsSync, access, ensureDir, constants, copy } from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import validateProjectName = require('validate-npm-package-name')
import download = require('download-git-repo')

export class Create {

  static createProject(projectName: string, options: any) {
    const result = validateProjectName(projectName)
    if (!result.validForNewPackages) {
      console.error(chalk.red(`无效的项目名称: '${projectName}'`))
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
      console.error(chalk.red(`目录 ${chalk.cyan(targetDir)} 已存在`))
      process.exit(1)
    }
    let templatePath = 'aygtech/weexbox-template'
    if (options.flutter) {
      templatePath += '#flutter'
    }
    const spinner = ora(`正在从 https://github.com/${templatePath} 下载模板\n如果您的网络不好，可以手动下载`).start()
    download(templatePath, targetDir, (err) => {
      spinner.stop()
      console.log(err ? err : `${projectName} 创建成功`)
    })
  }

  /**
   * 根据模板创建页面
   * @param pageName 页面名称，支持带多级路径
   * @param templatePath 模板文件目录，不传使用内置默认模板
   */
  static async createPage(pageName: string, templatePath?: string) {
    try {
      await access('./src', constants.R_OK|constants.W_OK)
  
      const pagePath = resolve(process.cwd(), 'src', pageName)
      try {
        await access(pagePath)
        console.log(chalk.red(`页面: ${pageName}在 src 目录中已存在，请修改页面名称`))
      } catch(e) {
        await ensureDir(pagePath)
  
        let templateDir = ''
        if (templatePath) {
          templateDir = resolve(process.cwd(), templatePath)
        } else {
          templateDir = resolve(__dirname, '../../template')
        }
        await copy(templateDir, pagePath, {recursive: true})
        console.log(chalk.cyan('页面创建成功，路径：')+ chalk.green(`${pagePath}`));
      }
    } catch(e) {
      console.log(chalk.red(`页面创建过程出错：${e}`))
    }
  
  }
}
