const path = require('path')
const fs = require('fs-extra')
const context = require('./context')
const AdmZip = require('adm-zip')

function execute(argv) {
    const csContext = context.csContext(argv)
    const to = path.join(process.cwd(), argv[2])
    fs.emptyDirSync(to)

    fs.copySync(csContext.configFilePath, path.join(to, csContext.configFileName))
    fs.copySync(csContext.md5FilePath, path.join(to, csContext.md5FileName))

    const zip = new AdmZip()
    zip.addLocalFolder(csContext.wwwFolderPath)
    zip.deleteFile(csContext.configFileName)
    zip.deleteFile(csContext.md5FileName)
    zip.writeZip(path.join(to, 'www.zip'))
}

exports.execute = execute