"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const readline_1 = require("readline");
const generate_1 = require("./generate");
class Refimg {
    static start(path) {
        const pathIsOK = this.setConfigPath();
        if (pathIsOK === true) {
            this.dartPath = path;
            this.synImageConfig();
        }
        else {
            console.log('\x1B[31m%s\x1B[0m', 'error:请检查当前目录是否存在images，pubspec.yaml');
        }
    }
    static synImageConfig() {
        this.readdirImage(this.imagesDir).then(images => {
            this.imageNames = images;
            return this.writeImageForConfig(images, this.flutterPubspecName);
        }).then(conetnt => {
            this.updateConfig(this.flutterPubspecName, conetnt);
        });
    }
    static updateConfig(config, content) {
        fs_extra_1.writeFile(config, content, 'utf8', (error) => {
            if (error) {
                console.log('\x1B[31m%s\x1B[0m', 'error: ' + error + '\n');
            }
            else {
                console.log('\x1B[36m%s\x1B[0m', 'succeed: images目录的图片已同步到pubspec.yaml\n');
                this.createModel();
            }
        });
    }
    static createModel() {
        if (this.dartPath !== undefined) {
            this.dartPath = this.dartPath === 'd' ? './lib/util/image_path_config.dart' : this.dartPath;
            generate_1.Generate.start(this.dartPath, this.imageNames);
        }
    }
    static writeImageForConfig(files, configPath) {
        return new Promise(reslove => {
            const rl = readline_1.createInterface({
                input: fs_extra_1.createReadStream(configPath),
            });
            let canAdd = true;
            let tasking = false;
            const lines = [];
            rl.on('line', (line) => {
                if (this.lineIsAssets(line)) {
                    canAdd = false;
                    tasking = true;
                    lines.push(line);
                    files.forEach(file => {
                        const newfile = `     - images/${file}`;
                        lines.push(newfile);
                    });
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
                reslove(lines.join('\n'));
            });
        });
    }
    static readdirImage(dir) {
        return new Promise(reslove => {
            fs_extra_1.readdir(dir, (_, files) => {
                reslove(this.getImageFiles(files));
            });
        });
    }
    static getImageFiles(files) {
        const images = [];
        files.forEach(file => {
            if (file.indexOf('.png') !== -1 || file.indexOf('.jpg') !== -1) {
                images.push(file);
            }
        });
        return images;
    }
    static setConfigPath() {
        this.imagesDir = './images';
        this.flutterPubspecName = 'pubspec.yaml';
        const hasDir = fs_extra_1.pathExistsSync(this.imagesDir);
        const hasPub = fs_extra_1.pathExistsSync(this.flutterPubspecName);
        return hasDir && hasPub;
    }
    static lineIsAssets(line) {
        return (line.indexOf('assets:') !== -1 && line.indexOf('#') === -1);
    }
}
exports.Refimg = Refimg;