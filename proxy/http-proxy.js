const proxy = require('http-proxy-middleware')
const fs = require('fs')
const config = require('../config/main')
const md5 = require('md5')
const file = require('../utils/file')

const dev = () => {

  return httpProxy = async (ctx, next) => {
    try {
      let host = ctx.request.header.host
      let url = ctx.request.url
      let protocol = ctx.request.protocol

      let hosts = file.getHosts()
      
      let ip
      for (let item in hosts) {
        if (hosts[item].address === host && hosts[item].active) {
          ip = hosts[item].ip
        }
      }

      if (ip) {
        host = ip
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