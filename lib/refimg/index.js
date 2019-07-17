"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const readline_1 = require("readline");
class Refimg {
    static start() {
        const pathIsOK = this.setConfigPath();
        if (pathIsOK === true) {
            fs_extra_1.readdir(this.imagesDir, (_, files) => {
                this.clean(this.flutterPubspecName, (ret) => {
                    this.outPut(ret, files);
                });
            });
        }
        else {
            console.log('请检查当前目录是否存在images和pubspec.yaml');
        }
    }
    static setConfigPath() {
        this.imagesDir = './images';
        this.flutterPubspecName = 'pubspec.yaml';
        const hasDir = fs_extra_1.pathExistsSync(this.imagesDir);
        const hasPub = fs_extra_1.pathExistsSync(this.flutterPubspecName);
        return hasDir && hasPub;
    }
    static clean(fileName, callBack) {
        const rl = readline_1.createInterface({
            input: fs_extra_1.createReadStream(fileName),
        });
        let canAdd = true;
        let tasking = false;
        const lines = [];
        rl.on('line', (line) => {
            if (this.lineIsAssets(line)) {
                canAdd = false;
                tasking = true;
                lines.push(line);
            }
            if (tasking === true && line.indexOf('#') !== -1) {
                tasking = false;
                canAdd = true;
            }
            if (canAdd === true) {
                lines.push(line);
            }
        });
        rl.on('close', () => {
            callBack(lines);
        });
    }
    static lineIsAssets(line) {
        return (line.indexOf('assets:') !== -1 && line.indexOf('#') === -1);
    }
    static outPut(ary1, ary2) {
        const newLines = [];
        ary1.forEach((line) => {
            newLines.push(line);
            if (this.lineIsAssets(line)) {
                ary2.forEach((line2) => {
                    const newLine2 = `        - images/${line2}`;
                    newLines.push(newLine2);
                });
            }
        });
        const newContent = newLines.join('\n');
        fs_extra_1.writeFile(this.flutterPubspecName, newContent, 'utf8', (error) => {
            if (error) {
                console.log('同步异常--------', error);
            }
            else {
                console.log('图片同步成功');
            }
        });
    }
}
exports.Refimg = Refimg;
