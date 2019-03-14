"use strict";
exports.__esModule = true;
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var chalk_1 = require("chalk");
var validateProjectName = require("validate-npm-package-name");
var download = require("download-git-repo");
var Create = (function () {
    function Create(projectName) {
        var result = validateProjectName(projectName);
        if (!result.validForNewPackages) {
            console.error(chalk_1["default"].red("Invalid project name: '" + projectName + "'"));
            var errors = result.errors;
            if (errors) {
                errors.forEach(function (err) {
                    console.error(chalk_1["default"].red(err));
                });
            }
            process.exit(1);
        }
        var targetDir = path_1.resolve(process.cwd(), projectName);
        if (fs_extra_1.existsSync(targetDir)) {
            console.error(chalk_1["default"].red("Target directory " + chalk_1["default"].cyan(targetDir) + " already exists."));
            process.exit(1);
        }
        console.log('正在从https://github.com/aygtech/weexbox-template下载模板\n如果您的网络不好，可以手动下载');
        download('aygtech/weexbox-template', targetDir, function (err) {
            console.log(err ? err : projectName + " is created!");
        });
    }
    return Create;
}());
exports.Create = Create;
//# sourceMappingURL=create.js.map