const prompt = require('prompt')
const _ = require('lodash')
const utils = require('./utils')
const context = require('./context')
const clear = require('./clear')

const name = {
  description: '输入项目名称',
  pattern: /^[a-zA-Z\-\s0-9]+$/,
  message: '项目名称只能由字母、数字、空格、横线组成',
  required: true,
}

const ios_min_version = {
  description: 'iOS 最小版本号（只有当APP的版本号不小于该版本号时，APP才会进行热更新）',
  pattern: /^[a-zA-Z\-0-9\.]+$/,
  required: true,
}

const android_min_version = {
  description: 'Android 最小版本号（只有当APP的版本号不小于该版本号时，APP才会进行热更新）',
  pattern: /^[a-zA-Z\-0-9\.]+$/,
  required: true,
}

const schema = {
  properties: {
    name,
    ios_min_version,
    android_min_version,
  },
}

function execute(argv) {
  prompt.message = '按照提示带你飞'
  prompt.start()

  let result

  utils.getInput(prompt, schema)
    .then(res => result = res)
    .then(url => _.assign(result, url))
    .then(content => utils.writeFile(context.csContext(argv).defaultConfigFilePath, content))
    .then(clear.execute(argv))
    .then(done)
}

function done(err) {
  if (err) {
    return console.log(err)
  }

  console.log(`项目初始化完成`)
  console.log(`已生成 weexbox-config.json`)
}

exports.execute = execute