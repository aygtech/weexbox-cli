"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
class Generate {
    static start(dartPath, images) {
        const attributes = [];
        images.forEach(image => {
            const attName = this.getImgKey(image);
            const attribute = '  static const ' + attName + ' = ' + '"images/' + image + '";';
            attributes.push(attribute);
        });
        const fileName = this.getFlieName(dartPath);
        const className = this.getClasseName(fileName);
        const content = attributes.join('\n');
        const classContent = ' // 由weexbox自动生成,无需手动编辑\n class ' + className + ' {\n' + content + '\n}';
        this.createDartFile(dartPath, classContent);
    }
    static getFlieName(path) {
        let modalName = '';
        const att = path.split('/');
        if (att.length > 1) {
            path = att[att.length - 1];
        }
        modalName = path.replace('.dart', '');
        return modalName;
    }
    static createDartFile(fileName, content) {
        fs_extra_1.writeFile(fileName, content, 'utf8', (error) => {
            if (error) {
                console.log('\x1B[31m%s\x1B[0m', 'error: ' + error + '\n');
            }
            else {
                console.log('\x1B[36m%s\x1B[0m', 'succeed: dart文件创建成功' + fileName + '\n');
            }
        });
    }
    static getImgKey(key) {
        key = key.replace(/.png/g, '');
        key = key.replace(/.jpg/g, '');
        key = key.toUpperCase();
        return key;
    }
    static getClasseName(className) {
        let i = 0;
        const newStrs = [];
        let underlineIndex = -1;
        for (i = 0; i < className.length; i++) {
            const str = className.charAt(i);
            let needToUpper = false;
            if (i === 0 || i === underlineIndex + 1) {
                needToUpper = true;
            }
            if (str.indexOf('_') !== -1) {
                underlineIndex = i;
            }
            else {
                const chart = needToUpper === true ? str.toUpperCase() : str;
                newStrs.push(chart);
            }
        }
        return newStrs.join('');
    }
}
exports.Generate = Generate;
