const fs = require('fs-extra')
const context = require('./context')

function execute(argv) {
    const csContext = context.csContext(argv)
    fs.emptyDirSync(csContext.wwwFolderPath)
}

exports.execute = execute