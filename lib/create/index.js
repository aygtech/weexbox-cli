"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const chalk_1 = require("chalk");
const ora_1 = require("ora");
const validateProjectName = require("validate-npm-package-name");
const download = require("download-git-repo");
class Create {
    static createProject(projectName) {
        const result = validateProjectName(projectName);
        if (!result.validForNewPackages) {
            console.error(chalk_1.default.red(`无效的项目名称: '${projectName}'`));
            const errors = result.errors;
            if (errors) {
                errors.forEach(err => {
                    console.error(chalk_1.default.red(err));
                });
            }
            process.exit(1);
        }
        const targetDir = path_1.resolve(process.cwd(), projectName);
        if (fs_extra_1.existsSync(targetDir)) {
            console.error(chalk_1.default.red(`目录 ${chalk_1.default.cyan(targetDir)} 已存在`));
            process.exit(1);
        }
        const spinner = ora_1.default('正在从 https://github.com/aygtech/weexbox-template 下载模板\n如果您的网络不好，可以手动下载').start();
        download('aygtech/weexbox-template', targetDir, (err) => {
            spinner.stop();
            console.log(err ? err : `${projectName} 创建成功`);
        });
    }
    static async createPage(pageName, templatePath) {
    }
}
exports.Create = Create;
