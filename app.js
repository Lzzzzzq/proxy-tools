const http = require('http')
const Koa = require('koa')
const logger = require('koa-logger')
const httpProxy = require('./proxy/http-proxy')
const httpsProxy = require('./proxy/https-proxy')
const config = require('./config/main')
const registerRouter  = require('./routes')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(registerRouter())
app.use(httpProxy())

const server = http.createServer(app.callback()).listen(config.PORT, config.HOST)

server.on('connect', httpsProxy)
