const fs = require('fs')
const config = require('../config/main')

module.exports = {

  /**
   * 获取所有hosts的json
   */
  getAllHosts: () => {
    let hostsFile = fs.readFileSync(`./config/${config.ALL}`)
    let hosts = JSON.parse(hostsFile.toString())
    return hosts
  },

  /**
   * 存入新的host
   */
  addHost: () => {
    fs.writeFileSync(`./config/${config.ALL}`, JSON.stringify(cont, null, 2))
  },

  /**
   * 获取页面
   */
  getView: () => {
    return fs.readFileSync(`./view/${config.VIEW}`)
  }

}