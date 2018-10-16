const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const httpProxy = require('./proxy/http-proxy')
const httpsProxy = require('./proxy/https-proxy')
const config = require('./config')

const app = new Koa()
const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = 'Hello World!'
})

app.use(logger())
app.use(router.routes())
app.use(httpProxy())

const server = http.createServer(app.callback()).listen(config.PORT, config.HOST)

server.on('connect', httpsProxy)
