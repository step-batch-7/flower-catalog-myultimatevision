const fs = require('fs');
const CONTENT_TYPES = require('./lib/types');
const { loadTemplate } = require('./lib/viewTemplate');

const STATIC_FOLDER = `${__dirname}/public`;

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = value;
  return query;
};
const readParams = keyValueTextPairs => keyValueTextPairs.split('&').reduce(pickupParams, {});

const serveHomePage = function (req, res) {
  const html = fs.readFileSync(`${STATIC_FOLDER}/home.html`, 'utf8');
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
};

const serveStaticFile = (req, res) => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return getHandlers.defaultHandler(req, res);
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const html = fs.readFileSync(path);
  res.setHeader('Content-Type', contentType);
  res.end(html)
}

const loadComments = function () {
  const filePath = './data/comments.json';
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8') || []);
  }
  return [];
}

const generateHtml = function (html, commentDetails) {
  const { name, date, comment } = commentDetails;
  const commentHtml =
    `<div class= "commentDetails">
       <div class="userName">
       <div><img class="icons" src="images/icn_username.png"/>${name}</div>
       <div><img class="icons" src="images/icn_year.png"/>${new Date(date).toGMTString()}</div>
       </div>
       <div class="comment">${comment}<img class="icons" src="images/icn_comment.png"/></div>
     </div>`
  return html + commentHtml;
}

const generateComments = function () {
  const noCommentsHtml = `<h3 style="color:gray;">No comments yet to show<h3>`
  const commentsDetails = loadComments();
  const commentHtml = commentsDetails.reduce(generateHtml, '');
  return commentHtml || noCommentsHtml
}

const saveComment = function (req, res) {
  let data = '';
  const filePath = './data/comments.json'
  const comments = loadComments();
  req.on('data', (chunk) => data += chunk);
  req.on('end', () => {
    const date = new Date();
    const { comment, name } = readParams(data);
    const commentWithOutNewLines = decodeURIComponent(comment).replace(/\+/g, ' ')
    const commentText = commentWithOutNewLines.replace(/\r\n/g, '<br />')
    const nameText = decodeURIComponent(name).replace(/\+/g, ' ');
    comments.unshift({ date, name: nameText, comment: commentText });
    fs.writeFileSync(filePath, JSON.stringify(comments), 'utf8');
    res.setHeader('Content-Type', CONTENT_TYPES.html);
    res.setHeader('Location', '/guest_book.html');
    res.statusCode = 301;
    res.end();
  });
}

const serveGuestBook = function (req, res) {
  const comments = generateComments();
  const html = loadTemplate('/guest_book.html', { COMMENTS: comments });
  res.setHeader('content-Length', html.length);
  res.end(html);
}

const notFound = function (req, res) {
  res.writeHead(404);
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  res.writeHead(400, 'Method Not Allowed');
  res.end();
}

const getHandlers = {
  '/': serveHomePage,
  '/guest_book.html': serveGuestBook,
  'static': serveStaticFile,
  'defaultHandler': notFound
};

const postHandlers = {
  '/saveComment': saveComment,
  'defaultHandler': notFound
};

const methods = {
  GET: getHandlers,
  POST: postHandlers,
  NOT_ALLOWED: { defaultHandler: methodNotAllowed }
}

module.exports = { methods };