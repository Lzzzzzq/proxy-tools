const fs = require('fs')
const config = require('../config/main')

module.exports = {

  /**
   * 获取所有hosts的json
   */
  getAllHosts: () => {
    let hostsFile = fs.readFileSync(`./data/${config.ALL}`)
    let hosts = JSON.parse(hostsFile.toString())
    return hosts
  },

  /**
   * 存入新的host
   */
  addHost: (cont) => {
    fs.writeFileSync(`./data/${config.ALL}`, JSON.stringify(cont, null, 2))
  },

  /**
   * 获取页面
   */
  getView: () => {
    return fs.readFileSync(`./view/${config.VIEW}`)
  },

  /**
   * 获取所有分组
   */
  getAllGroups: () => {
    let groupsFile = fs.readFileSync(`./data/${config.GROUP}`)
    let groups = JSON.parse(groupsFile.toString())
    return groups
  },

  addGroup: (cont) => {
    fs.writeFileSync(`./data/${config.GROUP}`, JSON.stringify(cont, null, 2))
  }

}