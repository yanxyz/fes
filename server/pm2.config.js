/**
 * PM2 configuration
 * http://pm2.keymetrics.io/docs/usage/application-declaration/
 */

module.exports = {
  name: 'fes',
  script: './app.js',
  cwd: '__dirname', // server 所在目录
  env: {
    port: '9005'
  },
  out_file: '/dev/null',
  /**
   * fes cli options
   *
   * brosers
   * IE, Edge 已支持，不需要指定
   */
  browsers: {
    ff: 'C:\\Program Files\\Firefox Developer Edition\\firefox.exe'
  }
}
