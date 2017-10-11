/**
 * fes.config.js
 */

const fs = require('fs')
const path = require('path')
const { homedir } = require('os')

const dir = path.join(homedir(), '.pm2')
const configPath = path.join(dir, 'fes.config.js')

module.exports = {
  dir,
  path: configPath,
  load,
  create,
  list
}

function create(force) {
  if (!force && fs.existsSync(configPath)) {
    console.log('The config file already exists: ' + configPath)
    return
  }

  const serverDir = path.join(__dirname, '../../server')
  const file = path.join(serverDir, 'pm2.config.js')
  if (!fs.existsSync(file)) {
    console.error('File is not found: ' + file)
    return
  }

  const content = fs.readFileSync(file, 'utf8')
    .replace('__dirname', serverDir.replace(/\\/g, '/'))
  fs.writeFileSync(configPath, content)
  console.log('The config file is successfully created: ' + configPath)
}

function list() {
  console.log('Config file:', configPath)
  console.log(JSON.stringify(load(), null, 2))
}

function load() {
  let data
  try {
    data = require(configPath)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      exit('The config file is not found. Run `create-config` command to create it.')
    }
    throw err
  }

  if (data == null || typeof data !== 'object' || data.name !== 'fes') {
    exit('The config is invalid. Refer to /sever/pm2.config.js')
  }

  if (data.env == null) data.env = {}
  if (data.browsers == null) data.browsers = {}

  return data
}

function exit(message) {
  console.error(message)
  console.error('config file: ' + configPath)
  process.exit(1)
}
