const path = require('path')
const fs = require('fs-extra')
const context = require('./context')
const AdmZip = require('adm-zip')

function execute() {
    const csContext = context.csContext()
    const android = path.join(process.cwd(), 'platforms/android/app/src/main/assets/www')
    const ios = path.join(process.cwd(), 'platforms/ios/www')
    fs.emptyDirSync(android)
    fs.emptyDirSync(ios)

    fs.copySync(csContext.configFilePath, path.join(android, csContext.configFileName))
    fs.copySync(csContext.md5FilePath, path.join(android, csContext.md5FileName))
    fs.copySync(csContext.configFilePath, path.join(ios, csContext.configFileName))
    fs.copySync(csContext.md5FilePath, path.join(ios, csContext.md5FileName))

    const zip = new AdmZip()
    zip.addLocalFolder(csContext.wwwFolderPath)
    zip.deleteFile(csContext.configFileName)
    zip.deleteFile(csContext.md5FileName)
    zip.writeZip(path.join(android, 'www.zip'))
    zip.writeZip(path.join(ios, 'www.zip'))
}

exports.execute = execute