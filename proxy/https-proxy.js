const url = require('url')
const net = require('net')

const dev = (req, cltSocket, head) => {
  var srvUrl = url.parse(`http://${req.url}`);

  // srvUrl.hostname = pre

  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
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
}

module.exports = dev
