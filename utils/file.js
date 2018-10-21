const fs = require('fs')
const config = require('../config/main')

/**
 * 获取所有hosts的json
 */
getAllHosts = () => {
  let hostsFile = fs.readFileSync(`./data/${config.ALL}`)
  let hosts = JSON.parse(hostsFile.toString())
  return hosts
},

/**
 * 获取所有分组
 */
getAllGroups = () => {
  let groupsFile = fs.readFileSync(`./data/${config.GROUP}`)
  let groups = JSON.parse(groupsFile.toString())
  return groups
},

/**
 * 获取所有hosts的数组
 */
getAllHostsList = () => {
  let hosts = getAllHosts()
  let hostsArr = []
  for (let item in hosts) {
    let hostItem = hosts[item]
    hostsArr.push({
      address: hostItem.address,
      ip: hostItem.ip,
      active: hostItem.active
    })
  }
  return hostsArr
},

/**
 * 获取页面
 */
getView = () => {
  return fs.readFileSync(`./view/dist/${config.VIEW}`)
},

/**
 * 更新hosts
 */
updateHosts = (cont) => {
  fs.writeFileSync(`./data/${config.ALL}`, JSON.stringify(cont, null, 2))
},

/**
 * 更新分组数据
 */
updateGroup = (cont) => {
  fs.writeFileSync(`./data/${config.GROUP}`, JSON.stringify(cont, null, 2))
}

module.exports = {
  getAllHosts,
  getAllHostsList,
  getAllGroups,
  getView,
  updateHosts,
  updateGroup
}