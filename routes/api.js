const Router = require('koa-router')
const fs = require('fs')
const config = require('../config/main')

const router = new Router()

router.prefix('/api')

router.get('/getAllHosts', async (ctx, next) => {
  let hostsFile = fs.readFileSync(`./config/${config.ACTIVE}`)
  let hosts = JSON.parse(hostsFile.toString())
  ctx.body = hosts
})

router.post('/changeHost', async (ctx, next) => {
  try {
    let {address, ip} = ctx.request.body
    if (!address || !ip) {
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: !address ? '请输入地址' : '请输入ip'
      }
      return
    }
    let hostsFile = fs.readFileSync(`./config/${config.ACTIVE}`)
    let hosts = JSON.parse(hostsFile.toString())

    hosts[address] = ip
    
    fs.writeFileSync(`./config/${config.ACTIVE}`, JSON.stringify(hosts, null, 2));
    ctx.body = {
      state: 1,
      msg: '修改成功'
    }
  } catch(e) {
    console.error(e)
    ctx.throw(500)
  }
})

module.exports = router
