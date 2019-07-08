"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const chalk_1 = require("chalk");
const ora_1 = require("ora");
const validateProjectName = require("validate-npm-package-name");
const download = require("download-git-repo");
class Create {
    static createProject(projectName, options) {
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
        let templatePath = 'aygtech/weexbox-template';
        if (options.flutter) {
            templatePath += '#flutter';
        }
        const spinner = ora_1.default(`正在从 https://github.com/${templatePath} 下载模板\n如果您的网络不好，可以手动下载`).start();
        download(templatePath, targetDir, (err) => {
            spinner.stop();
            console.log(err ? err : `${projectName} 创建成功`);
        });
    }
    static async createPage(pageName, templatePath) {
        try {
            await fs_extra_1.access('./src', fs_extra_1.constants.R_OK | fs_extra_1.constants.W_OK);
            const pagePath = path_1.resolve(process.cwd(), 'src', pageName);
            try {
                await fs_extra_1.access(pagePath);
                console.log(chalk_1.default.red(`页面: ${pageName}在 src 目录中已存在，请修改页面名称`));
            }
            catch (e) {
                await fs_extra_1.ensureDir(pagePath);
                let templateDir = '';
                if (templatePath) {
                    templateDir = path_1.resolve(process.cwd(), templatePath);
                }
                else {
                    templateDir = path_1.resolve(__dirname, '../../template');
                }
                await fs_extra_1.copy(templateDir, pagePath, { recursive: true });
                console.log(chalk_1.default.cyan('页面创建成功，路径：') + chalk_1.default.green(`${pagePath}`));
            }
        }
        catch (e) {
            console.log(chalk_1.default.red(`页面创建过程出错：${e}`));
        }
    }
}
exports.Create = Create;
