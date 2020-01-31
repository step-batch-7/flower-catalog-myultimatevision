const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const CONTENT_TYPES = require('./lib/types');
const { loadTemplate } = require('./lib/viewTemplate');

const STATIC_FOLDER = `${__dirname}/public`;

const isStatusNotOk = function (stat) {
  return !stat || !stat.isFile();
};

const getUrl = function (url) {
  return url === '/' ? '/home.html' : url;
};

const serveStaticFile = (req, res, next) => {
  const url = getUrl(req.url);
  const path = `${STATIC_FOLDER}${url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (isStatusNotOk(stat)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const html = fs.readFileSync(path);
  res.setHeader('Content-Type', contentType);
  res.end(html);
};

const loadComments = function () {
  const filePath = './data/comments.json';
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
  }
  return [];
};

const generateHtml = function (html, commentDetails) {
  const { name, date, comment } = commentDetails;
  const commentHtml =
    `<tr >
       <td>${new Date(date).toGMTString()}</td>
       <td>${name}</td>
       <td>${comment.replace(/\r\n/g, '<br />')}</td> 
     </tr>`;
  return html + commentHtml;
};

const generateComments = function () {
  const headerHtml =
    `<tr>
      <th>Date</th>
      <th>Name</th>
      <th>Comment</th>
     </tr>`;
  const noCommentsHtml = '<h3 style="color:gray;">No comments yet to show<h3>';
  const commentsDetails = loadComments();
  const commentHtml = commentsDetails.reduce(generateHtml, '');
  return commentHtml ? `${headerHtml}${commentHtml}` : noCommentsHtml;
};

const redirectTo = function (res, file) {
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Location', file);
  res.writeHead(301, 'redirect');
  res.end();
};

const saveComment = function (req, res) {
  const filePath = './data/comments.json';
  const comments = loadComments();
  const date = new Date();
  const { comment, name } = querystring.parse(req.body);
  comments.unshift({ date, name, comment });
  fs.writeFileSync(filePath, JSON.stringify(comments), 'utf8');
  redirectTo(res, '/guest_book.html');
};

const serveGuestBook = function (req, res) {
  const comments = generateComments();
  const html = loadTemplate('/guest_book.html', { COMMENTS: comments });
  res.setHeader('content-Type', CONTENT_TYPES.html);
  res.setHeader('content-Length', html.length);
  res.end(html);
};

const notFound = function (req, res) {
  res.writeHead(404, 'method not found');
  res.end('Not Found');
};

const readBody = (request, response, next) => {
  let body = '';
  request.on('data', data => {
    body += data;
  });
  request.on('end', () => {
    request.body = body;
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('/guest_book.html', serveGuestBook);
app.get('', serveStaticFile);
app.post('/saveComment', saveComment);
app.use(notFound);

module.exports = { app };
