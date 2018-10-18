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

/**
 * 获取全部hosts
 */
router.get('/getAllGroups', async (ctx, next) => {
  try {
    let groupObj = file.getAllGroups()
    let groupArr = []
    for (let item in groupObj) {
      let groupItem = groupObj[item]
      groupArr.push({
        name: groupItem.name,
        hosts: groupItem.hosts
      })
    }
    ctx.body = {
      state: 1,
      data: groupArr
    }
  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 新增分组
 * @param {String} name 分组名称
 */
router.post('/addGroup', async (ctx, next) => {
  try {
    let {name} = ctx.request.body
    if (!name) {
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: '请输入分组名称'
      }
      return
    }
    let groups = file.getAllGroups()
    let groupMd5 = md5(name)
    if (groups[groupMd5]) {
      ctx.body = {
        state: 0,
        msg: '已添加过该分组'
      }
    } else {
      groups[groupMd5] = {
        name: name,
        hosts: []
      }
      file.addGroup(groups)
      ctx.body = {
        state: 1,
        msg: '添加成功'
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 添加进分组
 * @param {String} address 网址
 * @param {String} ip ip地址
 * @param {String} name 分组名称
 */
router.post('/addIntoGroup', async (ctx, next) => {
  try {
    let {address, ip, name} = ctx.request.body
    if (!address || !ip || !name) {
      let msg = ''
      if (!address) {
        msg = '请输入地址'
      } else if (!ip) {
        msg = '请输入ip'
      } else {
        msg = '请输入分组名称'
      }
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: msg
      }
      return
    }
    let groups = file.getAllGroups()
    let hostMd5 = md5(address + ip)
    let groupMd5 = md5(name)
    if (groups[groupMd5]) {
      if (groups[groupMd5].hosts.indexOf(hostMd5) >= 0) {
        ctx.body = {
          state: 0,
          msg: '已添加过该host'
        }
      } else {
        groups[groupMd5].hosts.push(hostMd5)
        file.addIntoGroup(groups)
        ctx.body = {
          state: 1,
          msg: '添加成功'
        }
      }
    } else {
      ctx.body = {
        state: 0,
        msg: '分组不存在'
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 移出分组
 * @param {String} address 网址
 * @param {String} ip ip地址
 * @param {String} name 分组名称
 */
router.post('/removeFromGroups', async (ctx, next) => {
  try {
    let {address, ip, name} = ctx.request.body
    if (!address || !ip || !name) {
      let msg = ''
      if (!address) {
        msg = '请输入地址'
      } else if (!ip) {
        msg = '请输入ip'
      } else {
        msg = '请输入分组名称'
      }
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: msg
      }
      return
    }
    let groups = file.getAllGroups()
    let hostMd5 = md5(address + ip)
    let groupMd5 = md5(name)
    if (groups[groupMd5]) {
      if (groups[groupMd5].hosts.indexOf(hostMd5) >= 0) {
        let index = groups[groupMd5].hosts.indexOf(hostMd5)
        groups[groupMd5].hosts.splice(index, 1)
        file.removeFromGroup(groups)
        ctx.body = {
          state: 1,
          msg: '已移除该hosts'
        }
      } else {
        ctx.body = {
          state: 0,
          msg: '该组内无此hosts'
        }
      }
    } else {
      ctx.body = {
        state: 0,
        msg: '分组不存在'
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

module.exports = router
