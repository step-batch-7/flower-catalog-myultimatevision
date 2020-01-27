const fs = require('fs');
const CONTENT_TYPES = require('./lib/types');
const Response = require('./lib/response');

const STATIC_FOLDER = `${__dirname}/public`;
const TEMPLATE_FOLDER = `${__dirname}/templates`;


const serveStaticFile = (req) => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return new Response();
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const html = fs.readFileSync(path);
  const res = new Response();
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', html.length);
  res.setStatusCodeOk();
  res.setBody(html);
  console.log(res);
  return res;
}

const serveHomePage = (req) => {
  const html = fs.readFileSync(`${STATIC_FOLDER}/home.html`, 'utf8');
  const res = new Response();
  if (!req.headers['Cookie']) res.setHeader('Set-Cookie', `sessionId=${new Date().getTime()}`);
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.setStatusCodeOk();
  res.setBody(html);
  return res;
}

const serveGuestBook = function (req) {
  const html = fs.readFileSync(`${TEMPLATE_FOLDER}/guest_book.html`, 'utf8');
  const res = new Response();
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
  res.setStatusCodeOk();
  res.setBody(html);
  return res;
}

const findHandler = (req) => {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'GET' && req.url === '/guest_book.html') return serveGuestBook;
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
}

const processRequest = function (req) {
  const handler = findHandler(req);
  return handler(req);
}

module.exports = { processRequest };