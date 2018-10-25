const http = require('http')
const Koa = require('koa')
const logger = require('koa-logger')
const httpProxy = require('./proxy/http-proxy')
const httpsProxy = require('./proxy/https-proxy')
const config = require('./config/main')
const registerRouter = require('./routes')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const static = require('koa-static')
const cors = require('koa-cors')
const opn = require('opn')
const url = require("url")
const fs = require("fs")

const staticPath = './view/dist/'

const app = new Koa()
const view = new Koa()

app.use(cors())
app.use(logger())
app.use(httpProxy())
app.use(static(
  path.join( __dirname,  staticPath)
))
app.use(bodyParser())
app.use(registerRouter())


function listen (port) {

  const server = http.createServer(app.callback()).listen(port, config.HOST)

  server.on('connect', httpsProxy)

}

process.on("uncaughtException", function (err) {
  console.error('An uncaught error occurred!');
  console.error(err.stack);
})
