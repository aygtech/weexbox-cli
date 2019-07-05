import { resolve } from 'path'
import { existsSync } from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import validateProjectName = require('validate-npm-package-name')
import download = require('download-git-repo')

export class Create {
  static createProject(projectName: string) {
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
    const spinner = ora('正在从 https://github.com/aygtech/weexbox-template 下载模板\n如果您的网络不好，可以手动下载').start()
    download('aygtech/weexbox-template', targetDir, (err) => {
      spinner.stop()
      console.log(err ? err : `${projectName} 创建成功`)
    })
  }

  static async createPage(pageName: string, templatePath: string) {
    // try {
    //   await fs.access('./src', fs.constants.R_OK|fs.constants.W_OK)
  
    //   const pagePath = path.resolve(process.cwd(), 'src', pageName)
    //   try {
    //     await fs.access(pagePath)
    //     console.log(chalk.red(`页面: ${pageName}在 src 目录中已存在，请修改页面名称`))
    //   } catch(e) {
    //     await fs.mkdir(pagePath, {recursive: true})
  
    //     const templateDir = templatePath ? templatePath : path.resolve(__dirname, '../../template')
    //     await fs.writeFile(path.resolve(pagePath, 'index.js'), await fs.readFile(path.resolve(templateDir, 'index.js')))
    //     await fs.writeFile(path.resolve(pagePath, 'App.vue'), await fs.readFile(path.resolve(templateDir, 'App.vue')))
    //     console.log(chalk.cyan('页面创建成功，路径：')+ chalk.green(`${pagePath}`));
    //   }
    // } catch(e) {
    //   console.log(chalk.red(`页面创建过程出错：${e}`))
    // }
  
  }
}
