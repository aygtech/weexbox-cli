const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const validateProjectName = require('validate-npm-package-name')
const download = require('download-git-repo')

function create(projectName) {
  const result = validateProjectName(projectName)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: '${projectName}'`))
    const errors = result.errors
    if (errors) {
      errors.forEach(err => {
        console.error(chalk.red(err))
      })
    }
    process.exit(1)
  }
  const targetDir = path.resolve(process.cwd(), projectName)
  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`Target directory ${chalk.cyan(targetDir)} already exists.`))
    process.exit(1)
  }
  download('WeexBox/template', targetDir, function(err) {
    console.log(err ? err : 'WeexBox init success!')
  })
}

module.exports = create
