"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const ora_1 = require("ora");
const validateProjectName = require("validate-npm-package-name");
const download = require("download-git-repo");
class Create {
    static createProject(projectName) {
        const result = validateProjectName(projectName);
        if (!result.validForNewPackages) {
            console.error(chalk.default.red(`Invalid project name: '${projectName}'`));
            const errors = result.errors;
            if (errors) {
                errors.forEach(err => {
                    console.error(chalk.default.red(err));
                });
            }
            process.exit(1);
        }
        const targetDir = path.resolve(process.cwd(), projectName);
        if (fs.existsSync(targetDir)) {
            console.error(chalk.default.red(`Target directory ${chalk.default.cyan(targetDir)} already exists.`));
            process.exit(1);
        }
        const spinner = ora_1.default('正在从https://github.com/aygtech/weexbox-template下载模板\n如果您的网络不好，可以手动下载').start();
        download('aygtech/weexbox-template', targetDir, (err) => {
            spinner.stop();
            console.log(err ? err : `${projectName} is created!`);
        });
    }

    static async createPage(pageName, templatePath) {
        try {
          await fs.access('./src', fs.constants.R_OK|fs.constants.W_OK)
      
          const pagePath = path.resolve(process.cwd(), 'src', pageName)
          try {
            await fs.access(pagePath)
            console.log(chalk.red(`页面: ${pageName}在 src 目录中已存在，请修改页面名称`))
          } catch(e) {
            await fs.mkdir(pagePath, {recursive: true})
      
            const templateDir = templatePath ? templatePath : path.resolve(__dirname, '../template')
            await fs.writeFile(path.resolve(pagePath, 'index.js'), await fs.readFile(path.resolve(templateDir, 'index.js')))
            await fs.writeFile(path.resolve(pagePath, 'App.vue'), await fs.readFile(path.resolve(templateDir, 'App.vue')))
            console.log(chalk.cyan('页面创建成功，路径：')+ chalk.green(`${pagePath}`));
          }
        } catch(e) {
          console.log(chalk.red(`页面创建过程出错：${e}`))
        }
      }
}
exports.Create = Create;
