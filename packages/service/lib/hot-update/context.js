const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')

const ignoreFileName = 'update-ignore.txt'
const configFileName = 'update-config.json'
const md5FileName = 'update-md5.json'
const defaultIgnoreList = ['.DS_Store', md5FileName, configFileName, '.gitignore', '.gitkeep', '.git']

function csContext() {
    const homePath = path.join(process.cwd(), 'deploy')
    const wwwFolderPath = path.join(homePath, 'www')
    const configPath = path.join(process.cwd(), 'config')
    const ignoreFilePath = path.join(configPath, ignoreFileName)
    const defaultConfigFilePath = path.join(configPath, configFileName)
    const configFilePath = path.join(wwwFolderPath, configFileName)
    const md5FilePath = path.join(wwwFolderPath, md5FileName)

    return {
        configFileName,
        md5FileName,
        defaultConfigFilePath,
        wwwFolderPath,
        md5FilePath,
        configFilePath,
        ignoredList: getIgnoredFiles(ignoreFilePath)
    }
}

function getIgnoredFiles(ignoreFilePath) {
    var projectIgnore = readIgnoredFilesProjectConfig(ignoreFilePath)
    var ignoredList = _.union(defaultIgnoreList, projectIgnore)
    _.remove(ignoredList, function (item) {
        return item.indexOf('#') === 0 || _.trim(item).length === 0
    })

    return ignoredList
}

function readIgnoredFilesProjectConfig(pathToConfig) {
    var fileContent
    try {
        fileContent = fs.readFileSync(pathToConfig, 'utf8')
    } catch (e) {
        return []
    }

    return _.trim(fileContent).split(/\n/)
}

exports.csContext = csContext