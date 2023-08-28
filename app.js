const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const httpErrorHandler = require('./middleware/httpErrorHandler')
const jwtAuth = require('./middleware/jwtAuth')
const cors = require('koa2-cors')
const MongoConnect = require('./db')
const index = require('./routes/index')
const users = require('./routes/users')
const projects = require('./routes/projects')
const permissions = require('./routes/permissions')
const interface = require('./routes/interface')
const members = require('./routes/member')
const hope = require('./routes/hope')
const mock = require('./routes/mock')

// 连接数据库
MongoConnect()

app.use(cors())

// 全局错误处理
app.use(httpErrorHandler)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// jwt 
app.use(jwtAuth)

// routes注册一下这些路由
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(projects.routes(), projects.allowedMethods())
app.use(permissions.routes(), projects.allowedMethods())
app.use(interface.routes(), interface.allowedMethods())
app.use(members.routes(), members.allowedMethods())
app.use(hope.routes(), hope.allowedMethods())
app.use(mock.routes(), mock.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app


