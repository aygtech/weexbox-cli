const fs = require('fs')

function getInput(prompt, props) {
  const promise = new Promise(resolve => prompt.get(props, (err, result) => resolve(result, err)))
  return promise
}

function writeFile(file, content) {
  const promise = new Promise((resolve, reject) => {
    const data = JSON.stringify(content, null, 2)
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

exports.getInput = getInput
exports.writeFile = writeFile