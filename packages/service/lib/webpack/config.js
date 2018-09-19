const path = require('path')

const ROOT = path.resolve(__dirname, '..')

const config = {
  root: ROOT,
  weexboxConfigPath: path.join(process.cwd(), 'config/weexbox-config.js'),
  sourceDir: 'src',
  delpoyDir: 'deploy',
  distDir: 'deploy/www',
  staticDic: 'deploy/static',
  excludeModuleReg: /node_modules(?!(\/|\\).*(weex).*)/,
  nodeConfiguration: {
    global: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
    clearImmediate: false,
    // see: https://github.com/webpack/node-libs-browser
    assert: false,
    buffer: false,
    child_process: false,
    cluster: false,
    console: false,
    constants: false,
    crypto: false,
    dgram: false,
    dns: false,
    domain: false,
    events: false,
    fs: false,
    http: false,
    https: false,
    module: false,
    net: false,
    os: false,
    path: false,
    process: false,
    punycode: false,
    querystring: false,
    readline: false,
    repl: false,
    stream: false,
    string_decoder: false,
    sys: false,
    timers: false,
    tls: false,
    tty: false,
    url: false,
    util: false,
    vm: false,
    zlib: false
  }
}
module.exports = config
