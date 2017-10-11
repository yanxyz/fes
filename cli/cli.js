#!/usr/bin/env node

const argv = require('yargs-parser')(process.argv.slice(2), {
  alias: {
    browser: 'b',
    port: 'p',
    help: 'h',
    force: 'f'
  },
  boolean: ['help', 'force', 'debug']
})

if (argv.debug) {
  console.log(argv)
  process.exit()
}

const firstArg = argv._[0]
if (argv.help || !firstArg) showHelp()

main()

function main() {
  if (firstArg === 'start') {
    require('./lib/start')()
    return
  }

  if (firstArg === 'config') {
    const config = require('./lib/config')
    const secondArg = argv._[1]
    if (!secondArg) return console.error('Missing argument')
    if (secondArg === 'create') return config.create(argv.force)
    if (secondArg === 'list') return config.list()
    return console.error('Unknown argument')
  }

  argv.args = argv._
  require('./lib/open')(argv)
}

function showHelp () {
  const help = `
fes [options] [paths...]
run the scripts in browser

Options:
  -b, --browser
  specify the browser, e.g. ie, edge

  -p, --port
  specify the port of url

  -h, --help
  output usage

====================================

fes start
start the fes server(pm2), see readme

fes config create [--force]
create fes.config.js

fes config list
list fes.config.js
`
  console.log(help)
  process.exit()
}

