const os = require('os')
const path = require('path')

module.exports = {
  HOST: 'localhost',
  PORT: 3000,
  HOSTS: path.resolve(os.homedir(), 'ptHosts.json'),
  VIEW: 'index.html'
}