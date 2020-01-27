const fs = require('fs');
const CONTENT_TYPES = require('./lib/types');
const Response = require('./lib/response');
const { loadTemplate } = require('./lib/viewTemplate');

const STATIC_FOLDER = `${__dirname}/public`;

const loadComments = function () {
  const filePath = './data/comments.json';
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
}

const redirectToPage = function (file) {
  const res = new Response();
  res.setHeader('Location', file);
  res.setHeader('Content-Length', 0);
  res.setStatusCodeRedirect();
  return res;
}

const saveComment = function (req) {
  const filePath = './data/comments.json'
  const comments = loadComments();
  const { name, comment } = req.body;
  const date = new Date();
  comments.unshift({ date, name, comment });
  fs.writeFileSync(filePath, JSON.stringify(comments), 'utf8');
  return redirectToPage('/guest_book.html');
}

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

const generateHtml = function (html, commentDetails) {
  const commentHtml =
    `<div class= "comment">
       <div class="name"><span>${commentDetails.name}<span></div>
      <span>${commentDetails.date}<span>
      <span>${commentDetails.comment}<span>
     </div>`
  return html + commentHtml;
}

const generateComments = function () {
  const commentsDetails = loadComments();
  return commentsDetails.reduce(generateHtml, '');
}


const serveGuestBook = function (req) {
  const comments = generateComments();
  const html = loadTemplate('/guest_book.html', { COMMENTS: comments });
  const res = new Response();
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
  res.setStatusCodeOk();
  res.setBody(html);
  return res;
}

const findHandler = (req) => {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'POST' && req.url === '/saveComment') return saveComment;
  if (req.method === 'GET' && req.url === '/guest_book.html') return serveGuestBook;
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
}

const processRequest = function (req) {
  const handler = findHandler(req);
  return handler(req);
}

module.exports = { processRequest };