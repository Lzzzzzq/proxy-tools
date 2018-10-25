import axios from 'axios'

/**
 * 获取全部hosts
 */
export const getAllHosts = () => {
  return axios.get('/api/getAllHosts')
}

/**
 * 修改host状态
 * @param {Object} payload 地址及ip
 */
export const changeState = (payload) => {
  return axios.post('/api/changeState', {
    id: payload.id
  })
}

/**
 * 添加host
 * @param {Object} payload 地址及ip
 */
export const addHost = (payload) => {
  return axios.post('/api/addHost', {
    address: payload.address,
    ip: payload.ip
  })
}

/**
 * 删除host
 * @param {Object} payload 地址及ip
 */
export const deleteHost = (payload) => {
  return axios.post('/api/deleteHost', {
    id: payload.id
  })
}

/**
 * 编辑host
 * @param {Object} payload 地址及ip
 */
export const editHost = (payload) => {
  return axios.post('/api/editHost', {
    id: payload.id,
    address: payload.address,
    ip: payload.ip
  })
}

/**
 * 编辑host
 * @param {Object} payload 导入的hosts文件的内容
 */
export const importHosts = (payload) => {
  return axios.post('/api/importHosts', {
    cont: payload.cont
  })
}
