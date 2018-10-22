const fs = require('fs')
const config = require('../config/main')

/**
 * 获取hosts文件
 */
getHosts = () => {
  return getFileAsJson(config.HOSTS)
},

/**
 * 获取所有分组
 */
getAllGroups = () => {
  return getFileAsJson(config.GROUP)
},

/**
 * 获取所有hosts的数组
 */
getAllHostsList = () => {
  let hosts = getHosts()
  let hostsArr = []
  for (let item in hosts) {
    let hostItem = hosts[item]
    hostsArr.push({
      address: hostItem.address,
      ip: hostItem.ip,
      active: hostItem.active,
      id: item
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
  updateFileAsJson(config.HOSTS, cont)
},

/**
 * 更新分组数据
 */
updateGroup = (cont) => {
  updateFileAsJson(config.GROUP, cont)
}

/**
 * 更新文件
 */
updateFileAsJson = (path, cont) => {
  fs.writeFileSync(`./data/${path}`, JSON.stringify(cont, null, 2))
}

/**
 * 获取json文件
 */
getFileAsJson = (path) => {
  let fileCont = fs.readFileSync(`./data/${path}`)
  return JSON.parse(fileCont.toString())
}

module.exports = {
  getHosts,
  getAllHostsList,
  getAllGroups,
  getView,
  updateHosts,
  updateGroup
}