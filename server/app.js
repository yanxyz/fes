const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const render = require('koa-ejs')
const stat = require('util').promisify(fs.stat)

const app = module.exports = new Koa()

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs',
})

app.use(async (ctx, next) => {
  if (ctx.method !== 'GET') return next()

  if (ctx.path === '/') {
    const query = ctx.query

    if (query.type) {
      let name = 'script'
      if (query.type === 'spec') {
        name = 'jasmine'
      }

      // ?file=a.js&file=b.js 这样可以指定多个 scripts
      const value = query.file
      if (!value) {
        ctx.throw(400, 'file is missing.')
      }
      const files = Array.isArray(value) ? value : [value]
      return ctx.render(name, { files })
    }

    if (query.file) return sendFile(ctx, query.file)
    return sendFile(ctx, 'readme.md')
  }

  if (ctx.path.startsWith('/lib/')) {
    return sendFile(ctx, path.join(__dirname, 'public', ctx.path))
  }
})

/**
 * koa-send 为了安全，只能发送限定目录下面的文件
 * 此应用则需要发送任意目录下的文件
 */
async function sendFile(ctx, filePath) {
  let stats
  try {
    stats = await stat(filePath)
  } catch (err) {
    const notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR']
    if (notfound.includes(err.code)) {
      ctx.throw(404, err)
    }
    err.status = 500
    throw err
  }

  if (stats.isDirectory()) {
    ctx.throw(400, 'File expected but got a directory: ' + filePath)
  }

  ctx.type = path.extname(filePath)
  ctx.body = fs.createReadStream(filePath)
}

const port = process.env.PORT || 9005
app.listen(port)
console.log(`Server address: http://localhost:${port}`)
