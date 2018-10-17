const Router = require('koa-router')
const md5 = require('md5')
const file = require('../utils/file')
const common = require('../utils/common')

const router = new Router()

router.prefix('/api')

/**
 * 获取全部hosts
 */
router.get('/getAllHosts', async (ctx, next) => {
  try {
    let hostsObj = file.getAllHosts()
    let hostsArr = []
    for (let item in hostsObj) {
      let hostItem = hostsObj[item]
      hostsArr.push({
        address: hostItem.address,
        ip: hostItem.ip,
        active: hostItem.active
      })
    }
    ctx.body = {
      state: 1,
      data: hostsArr
    }
  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 新增hosts
 * @param {String} address 网址
 * @param {String} ip ip地址
 */
router.post('/addHost', async (ctx, next) => {
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
    let hosts = file.getAllHosts()
    let hostMd5 = md5(address + ip)
    if (hosts[hostMd5]) {
      ctx.body = {
        state: 0,
        msg: '已添加过该host'
      }
    } else {
      hosts[hostMd5] = {
        address: address,
        ip: ip,
        active: false
      }
      file.addHost(hosts)
      ctx.body = {
        state: 1,
        msg: '添加成功'
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

module.exports = router
