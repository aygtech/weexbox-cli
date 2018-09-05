const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { stopSpinner, error, exit, clearConsole } = require('../lib/util/')
const validateProjectName = require('validate-npm-package-name')
const download = require('download-git-repo')

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd()

  console.log(process.cwd())
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')

  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: '${projectName}'`))
    result.errors &&
      result.errors.forEach(err => {
        console.error(chalk.red(err))
      })
    exit(1)
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      await clearConsole()
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(
              targetDir
            )} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

    download('flipxfx/download-git-repo-fixture', 'test/tmp', function (err) {
        console.log(err ? 'Error' : 'Success')
    })
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}
