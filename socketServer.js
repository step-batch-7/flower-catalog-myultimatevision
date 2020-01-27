const { Server } = require('net');
const { processRequest } = require('./app');
const Request = require('./lib/request');


const handleConnection = function (socket) {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`new Connection ${remote}`);
  socket.setEncoding('utf8');
  socket.on('end', () => console.log(`${remote} ended`));
  socket.on('drain', () => console.log(`${remote} drained`));
  socket.on('error', (err) => console.log(`socket error ${err}`));
  socket.on('close', (hadError) =>
    console.log(`${remote} closed ${hadError ? 'with error' : ''}`));
  socket.on('data', data => {
    console.warn(`${remote} data :\n`);
    const req = Request.parse(data);
    const res = processRequest(req);
    res.writeTo(socket);
    console.log(req);
  });
};


const main = function () {
  const server = new Server();
  server.on('connection', handleConnection);
  server.listen(9000);
  server.on('listening', () => console.log('server listening ', server.address()));
};

main();