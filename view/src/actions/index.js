import axios from 'axios'

/**
 * 获取全部hosts
 */
export const getAllHosts = () => {
  return axios.get('//localhost:3000/api/getAllHosts')
}

/**
 * 修改host状态
 * @param {Object} payload 地址及ip
 */
export const changeState = (payload) => {
  return axios.post('//localhost:3000/api/changeState', {
    address: payload.address,
    ip: payload.ip
  })
}

/**
 * 添加host
 * @param {Object} payload 地址及ip
 */
export const addHost = (payload) => {
  return axios.post('//localhost:3000/api/addHost', {
    address: payload.address,
    ip: payload.ip
  })
}

/**
 * 删除host
 * @param {Object} payload 地址及ip
 */
export const deleteHost = (payload) => {
  return axios.post('//localhost:3000/api/deleteHost', {
    address: payload.address,
    ip: payload.ip
  })
}
