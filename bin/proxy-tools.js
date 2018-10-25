#!/usr/bin/env node

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
const portfinder = require('portfinder')
const convert = require('koa-convert')

const staticPath = './view/dist/'

const app = new Koa()
const view = new Koa()

app.use(convert(cors()))
app.use(logger())
app.use(httpProxy())
app.use(static(
  path.join(__dirname, staticPath)
))
app.use(bodyParser())
app.use(registerRouter())

portfinder.basePort = config.PORT;
portfinder.getPort(function (err, port) {
  if (err) { throw err; }
  listen(port);
});

function listen (port) {
  process.env.PORT = port

  const server = http.createServer(app.callback()).listen(port, config.HOST)

  server.on('connect', httpsProxy)

  console.log('Starting up proxy-tools')
  console.log('  Please set the proxy to: http://localhost:' + port)
  console.log('  GUI pages location: http://localhost:' + port)
  // console.log('  Visual interface will open automatically')
  console.log('Hit CTRL-C to stop the server')

  // opn('http://localhost:' + port + '/')
  //   .catch(e => {
  //     console.log(e)
  //   })

}

process.on("uncaughtException", function (err) {
  console.error('An uncaught error occurred!');
  console.error(err.stack);
})
