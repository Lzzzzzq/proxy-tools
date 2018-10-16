const url = require('url')
const net = require('net')
const fs = require('fs')
const config = require('../config/main')

const dev = (req, cltSocket, head) => {
  try {
    let srvUrl = url.parse(`http://${req.url}`);
    let host = srvUrl.hostname

    let hostsFile = fs.readFileSync(`./config/${config.ACTIVE}`)
    let hosts = JSON.parse(hostsFile.toString())

    if(hosts && hosts[host]) {
      host = hosts[host]
    }

    let srvSocket = net.connect(srvUrl.port, host, () => {
      cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                      'Proxy-agent: MITM-proxy\r\n' +
                      '\r\n');
      srvSocket.write(head);
      srvSocket.pipe(cltSocket);
      cltSocket.pipe(srvSocket);
    });
    srvSocket.on('error', (e) => {
        console.error(e);
    });
  } catch (e) {
    console.error(e)
  }
}

module.exports = dev
