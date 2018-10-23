const fs = require('fs')
const config = require('../config/main')

/**
 * 获取hosts文件
 */
getHosts = () => {
  return getFileAsJson(config.HOSTS)
}

/**
 * 获取address及ip对应的对象
 */
getHostsSymbolList = () => {
  let hosts = getFileAsJson(config.HOSTS)
  let symbolList = {}
  for (let key in hosts) {
    let item = hosts[key]
    symbolList[`${item.address}${item.ip}`] = 1
  }
  return symbolList
}

/**
 * 获取所有分组
 */
getAllGroups = () => {
  return getFileAsJson(config.GROUP)
}

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
}

/**
 * 获取页面
 */
getView = () => {
  return fs.readFileSync(`./view/dist/${config.VIEW}`)
}

/**
 * 更新hosts
 */
updateHosts = (cont) => {
  updateFileAsJson(config.HOSTS, cont)
}

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
  path = `./data/${path}`
  let fileCont = {}
  let exists = fs.existsSync(path)
  if (exists) {
    let file = fs.readFileSync(path)
    fileCont = JSON.parse(file.toString())
  } else {
    createFile(path, '{}')
  }
  return fileCont
}

/**
 * 创建文件并写入
 */
createFile = (filePath, fileData) => {
  const wstream = fs.createWriteStream(filePath);
  wstream.on('open', () => {
    wstream.write(fileData)
    wstream.end();
  });
  wstream.on('error', (err) => {});
  wstream.on('finish', () => {});
}

module.exports = {
  getHosts,
  getHostsSymbolList,
  getAllHostsList,
  getAllGroups,
  getView,
  updateHosts,
  updateGroup
}