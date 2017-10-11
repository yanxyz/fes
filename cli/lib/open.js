/**
 * open file in browser
 */

const path = require('path')
const opn = require('opn')
const querystring = require('querystring')
const config = require('./config').load()

module.exports = function (opts) {
  // 下面情况跟 fes server 无关，只是为了方便在不同的浏览器中打开它们
  if (opts.args.length === 1) {
    const arg = opts.args[0]

    // url
    if (/^https?:\/\//.test(arg)) {
      openBrowser(arg, opts.browser)
      return
    }

    // *.html file
    if (arg.endsWith('.html')) {
      openBrowser(path.resolve(arg), opts.browser)
      return
    }
  }

  const port = opts.port || config.env.port
  if (!port) {
    console.error('port is missing')
    return
  }
  if (port < 1024) {
    console.error('port is invalid:', port)
    return
  }

  let params
  try {
    params = qs(opts.args)
  } catch (err) {
    console.error(err.message)
    return
  }

  const url = `http://localhost:${port}/?` + params
  openBrowser(url, opts.browser)
}

function qs(args) {
  let isSpec = false
  const arr = args.map(x => {
    if (!x.endsWith('.js')) {
      throw new Error('Only *.js file is allowed')
    }
    if (!isSpec && x.endsWith('.spec.js')) isSpec = true
    return path.resolve(x)
  })

  return querystring.stringify({
    type: isSpec ? 'spec' : 'script',
    file: arr,
  })
}

function openBrowser(url, browser) {
  // the default browser
  if (!browser) return open(url)

  if (process.platform === 'win32') {
    if (browser === 'edge') {
      return open('microsoft-edge:' + url)
    }

    if (browser === 'ie') {
      return open(url, 'iexplore.exe')
    }
  }

  // browser in config
  const app = config.browsers[browser]
  if (app) {
    return open(url, app)
  }

  // browser path
  open(url, browser)
}

function open(url, app) {
  return opn(url, { wait: false, app })
}
