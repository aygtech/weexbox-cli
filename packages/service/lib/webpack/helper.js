const path = require('path')

const projectPath = (args) => {
  return path.join(process.cwd(), args)
}

module.exports = {
  projectPath
}
