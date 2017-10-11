/**
 * start pm2
 */

const { exec } = require('child_process')
const { dir } = require('./config')

module.exports = function () {
  const cp = exec('pm2 startOrReload fes.config.js', {
    cwd: dir,
    stdio: 'inherit'
  })
  cp.once('error', (error) => {
    throw error
  })
  cp.once('exit', () => {
    console.log('run `pm2 ls` to view the app status.')
  })
  cp.unref()
}
