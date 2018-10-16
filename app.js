const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')
const net = require('net')
const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const proxy = require('http-proxy-middleware')
const app = new Koa()
const router = new Router()

// Settings
const HOST = 'localhost';
const HTTP_PORT = 3000;

router.get('/', (ctx, next) => {
  ctx.body = 'Hello World!'
})

app.use(router.routes())
app.use((ctx, next) => {
  ctx.body = 'hello'
  let host = ctx.request.header.host
  let url = ctx.request.url
  let protocol = ctx.request.protocol

  console.log(url)
  console.log(host)
  if (host.indexOf('localhost') >= 0) {
    next()
  } else {
    ctx.respond = false
    return proxy({
      target: protocol + '://' + host, // 服务器地址
      changeOrigin: true,
    })(ctx.req, ctx.res, next)
  }

})

const server = http.createServer(app.callback()).listen(HTTP_PORT, HOST)

server.on('connect', (req, cltSocket, head) => {
  // connect to an origin server
  var srvUrl = url.parse(`http://${req.url}`);

  // srvUrl.hostname = pre

  console.log(`CONNECT ${srvUrl.hostname}:${srvUrl.port}`);

  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: MITM-proxy\r\n' +
                    '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
  srvSocket.on('error', (e) => {
      console.error(e);
  });
})
