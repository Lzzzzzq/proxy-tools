const proxy = require('http-proxy-middleware')
const fs = require('fs')
const config = require('../config/main')

const dev = () => {

  return httpProxy = async (ctx, next) => {
    try {
      let host = ctx.request.header.host
      let url = ctx.request.url
      let protocol = ctx.request.protocol
      let hostsFile = fs.readFileSync(`./config/${config.ACTIVE}`)
      let hosts = JSON.parse(hostsFile.toString())

      if (hosts && hosts[host]) {
        host = hosts[host]
        ctx.respond = false
        return proxy({
            target: protocol + '://' + host
        })(ctx.req, ctx.res, next)
      }else if (host === `localhost:${config.PORT}` || host === `127.0.0.1:${config.PORT}`) {
        next()
      } else {
        ctx.respond = false
        return proxy({
          target: protocol + '://' + host,
          changeOrigin: true,
        })(ctx.req, ctx.res, next)
      }
    } catch (e) {
      console.error(e)
    }

  }

}

module.exports = dev