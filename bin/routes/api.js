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
    ctx.body = {
      state: 1,
      data: file.getAllHostsList()
    }
  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 新增host
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
    address = address.replace(/http:\/\/|https:\/\//g, '')
    let hosts = file.getHosts()
    let added = false

    for (let key in hosts) {
      let item = hosts[key]
      if (item.address === address && item.ip === ip) {
        added = true
        break
      }
    }
    
    if (added) {
      ctx.body = {
        state: 0,
        msg: '已添加过该host'
      }
    } else {
      let hostKey = md5(Date.parse(new Date()))
      hosts[hostKey] = {
        address: address,
        ip: ip,
        active: false
      }

      file.updateHosts(hosts)

      ctx.body = {
        state: 1,
        msg: '添加成功',
        data: file.getAllHostsList()
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 删除host
 * @param {String} id host id
 */
router.post('/deleteHost', async (ctx, next) => {
  try {
    let {id} = ctx.request.body
    if (!id) {
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: '请输入id'
      }
      return
    }
    let hosts = file.getHosts()

    if (hosts[id]) {
      delete hosts[id]
      file.updateHosts(hosts)
      ctx.body = {
        state: 1,
        msg: '删除成功',
        data: file.getAllHostsList()
      }
    } else {
      ctx.body = {
        state: 0,
        msg: '该hosts不存在'
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 编辑host
 * @param {String} id host id
 * @param {String} address 网址
 * @param {String} ip ip地址
 */
router.post('/editHost', async (ctx, next) => {
  try {
    let {id, address, ip} = ctx.request.body
    if (!id || !address || !ip) {
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: '请输入正确的信息'
      }
      return
    }
    let hosts = file.getHosts()

    if (hosts[id]) {
      
      let same = false

      for (let key in hosts) {
        let item = hosts[key]
        if (item.address === address && item.ip === ip) {
          same = true
          break
        }
      }
      if (same) {
        ctx.body = {
          state: 0,
          msg: '已有相同host'
        }
      } else {
        hosts[id].address = address
        hosts[id].ip = ip

        file.updateHosts(hosts)
        ctx.body = {
          state: 1,
          msg: '修改成功',
          data: file.getAllHostsList()
        }
      }
    } else {
      ctx.body = {
        state: 0,
        msg: '该hosts不存在'
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 导入hosts文件
 */
router.post('/importHosts', async (ctx, next) => {
  try {
    let {cont} = ctx.request.body
    if (!cont) {
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: '请输入正确的信息'
      }
      return
    }

    let ipReg = /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/

    // 按行分割
    let data = cont.split(/[\n\r]/g)

    // 过滤掉空行
    data = data.filter(item => {
      return !!item && item.match(ipReg)
    })

    // 格式化每行为host对象
    data = data.map(item => {
      let ip = ''
      let address = item.replace(ipReg, function (word) {
        ip = word
        return ''
      }).replace(/[\s]/g, '')

      let active = false

      if (address[0] !== '#') [
        active = true
      ]

      address = address.replace(/\#/g, '')

      return {
        ip,
        address,
        active: active
      }
    })

    // 过滤掉已添加的hosts
    let hostsSymbolList = file.getHostsSymbolList()
    data = data.filter(item => {
      return !hostsSymbolList[`${item.address}${item.ip}`]
    })

    // 更新hosts文件
    let hosts = file.getHosts()
    let ts = Date.parse(new Date())
    data.map((item, index) => {
      hosts[md5(ts + index)] = {
        address: item.address,
        ip: item.ip,
        active: item.active
      }
    })

    file.updateHosts(hosts)

    ctx.body = {
      state: 1,
      data: file.getAllHostsList()
    }
  } catch (e) {
    common.postError(ctx, e, 500)
  }
})

/**
 * 获取全部分组
 */
// router.get('/getAllGroups', async (ctx, next) => {
//   try {
//     let groupObj = file.getHosts()
//     let groupArr = []
//     for (let item in groupObj) {
//       let groupItem = groupObj[item]
//       groupArr.push({
//         name: groupItem.name,
//         hosts: groupItem.hosts
//       })
//     }
//     ctx.body = {
//       state: 1,
//       data: groupArr
//     }
//   } catch (e) {
//     common.postError(ctx, e, 500)
//   }
// })

/**
 * 新增分组
 * @param {String} name 分组名称
 */
// router.post('/addGroup', async (ctx, next) => {
//   try {
//     let {name} = ctx.request.body
//     if (!name) {
//       ctx.status = 400
//       ctx.body = {
//         state: 0,
//         msg: '请输入分组名称'
//       }
//       return
//     }
//     let groups = file.getAllGroups()
//     let groupMd5 = md5(name)
//     if (groups[groupMd5]) {
//       ctx.body = {
//         state: 0,
//         msg: '已添加过该分组'
//       }
//     } else {
//       groups[groupMd5] = {
//         name: name,
//         hosts: []
//       }
//       file.updateGroup(groups)
//       ctx.body = {
//         state: 1,
//         msg: '添加成功'
//       }
//     }

//   } catch (e) {
//     common.postError(ctx, e, 500)
//   }
// })

/**
 * 添加进分组
 * @param {String} address 网址
 * @param {String} ip ip地址
 * @param {String} name 分组名称
 */
// router.post('/addIntoGroup', async (ctx, next) => {
//   try {
//     let {address, ip, name} = ctx.request.body
//     if (!address || !ip || !name) {
//       let msg = ''
//       if (!address) {
//         msg = '请输入地址'
//       } else if (!ip) {
//         msg = '请输入ip'
//       } else {
//         msg = '请输入分组名称'
//       }
//       ctx.status = 400
//       ctx.body = {
//         state: 0,
//         msg: msg
//       }
//       return
//     }
//     let groups = file.getAllGroups()
//     let hostMd5 = md5(address + ip)
//     let groupMd5 = md5(name)
//     if (groups[groupMd5]) {
//       if (groups[groupMd5].hosts.indexOf(hostMd5) >= 0) {
//         ctx.body = {
//           state: 0,
//           msg: '已添加过该host'
//         }
//       } else {
//         groups[groupMd5].hosts.push(hostMd5)
//         file.updateGroup(groups)
//         ctx.body = {
//           state: 1,
//           msg: '添加成功'
//         }
//       }
//     } else {
//       ctx.body = {
//         state: 0,
//         msg: '分组不存在'
//       }
//     }

//   } catch (e) {
//     common.postError(ctx, e, 500)
//   }
// })

/**
 * 移出分组
 * @param {String} address 网址
 * @param {String} ip ip地址
 * @param {String} name 分组名称
 */
// router.post('/removeFromGroups', async (ctx, next) => {
//   try {
//     let {address, ip, name} = ctx.request.body
//     if (!address || !ip || !name) {
//       let msg = ''
//       if (!address) {
//         msg = '请输入地址'
//       } else if (!ip) {
//         msg = '请输入ip'
//       } else {
//         msg = '请输入分组名称'
//       }
//       ctx.status = 400
//       ctx.body = {
//         state: 0,
//         msg: msg
//       }
//       return
//     }
//     let groups = file.getAllGroups()
//     let hostMd5 = md5(address + ip)
//     let groupMd5 = md5(name)
//     if (groups[groupMd5]) {
//       if (groups[groupMd5].hosts.indexOf(hostMd5) >= 0) {
//         let index = groups[groupMd5].hosts.indexOf(hostMd5)
//         groups[groupMd5].hosts.splice(index, 1)
//         file.updateGroup(groups)
//         ctx.body = {
//           state: 1,
//           msg: '已移除该hosts'
//         }
//       } else {
//         ctx.body = {
//           state: 0,
//           msg: '该组内无此hosts'
//         }
//       }
//     } else {
//       ctx.body = {
//         state: 0,
//         msg: '分组不存在'
//       }
//     }

//   } catch (e) {
//     common.postError(ctx, e, 500)
//   }
// })

/**
 * 切换单条状态
 * @param {String} address 网址
 * @param {String} ip ip地址
 */
router.post('/changeState', async (ctx, next) => {
  try {
    let {id} = ctx.request.body
    if (!id) {
      ctx.status = 400
      ctx.body = {
        state: 0,
        msg: '请输入id'
      }
      return
    }
    let hosts = file.getHosts()

    if (hosts[id]) {
      hosts[id].active = !hosts[id].active
      file.updateHosts(hosts)
      ctx.body = {
        state: 1,
        msg: '修改成功'
      }
    } else {
      ctx.body = {
        state: 0,
        msg: '无此hosts'
      }
    }

  } catch (e) {
    common.postError(ctx, e, 500)
  }
})
module.exports = router
