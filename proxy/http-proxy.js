const proxy = require('http-proxy-middleware')

const dev = () => {

  return httpProxy = async (ctx, next) => {

    let host = ctx.request.header.host
    let url = ctx.request.url
    let protocol = ctx.request.protocol

    if (host.indexOf('localhost') >= 0) {
      next()
    } else {
      ctx.respond = false
      return proxy({
        target: protocol + '://' + host, // 服务器地址
        changeOrigin: true,
      })(ctx.req, ctx.res, next)
    }

  }

}

module.exports = dev