const http = require('http');
const { methods } = require('./handlers');

const requestListener = function (req, res) {
  console.log('Request: ', req.url, req.method);
  const handlers = methods[req.method] || methods.NOT_ALLOWED;
  const handler = handlers[req.url] || handlers.static;
  return handler(req, res);
};

const main = function (port = 4000) {
  const server = new http.Server(requestListener);
  server.listen(port, () => console.log(`listening to ${port}`));
};

main(process.argv[2]);