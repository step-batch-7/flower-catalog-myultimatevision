const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = value;
  return query;
};
const readParams = keyValueTextPairs => keyValueTextPairs.split('&').reduce(pickupParams, {});
const parseQueryParameters = entireUrl => {
  const [url, queryText] = entireUrl.split('?');
  const query = queryText && readParams(queryText);
  return { url, query };
}

const collectHeadersAndContent = function (headersAndContent, line) {
  if (line === '') {
    headersAndContent.body = '';
    return headersAndContent;
  }

  if ('body' in headersAndContent) {
    headersAndContent.body += line;
    return headersAndContent;
  }
  const [key, value] = line.split(': ');
  headersAndContent.headers[key] = value;
  return headersAndContent;
}

class Request {
  constructor(method, url, query, headers, body) {
    this.method = method;
    this.url = url;
    this.query = query;
    this.headers = headers;
    this.body = body;
  }
  static parse(requestText) {
    const [requestLine, ...headersAndBody] = requestText.split('\r\n');
    const [method, entireUrl, protocol] = requestLine.split(' ');
    const { url, query } = parseQueryParameters(entireUrl);
    let { headers, body } = headersAndBody.reduce(collectHeadersAndContent, { headers: {} });
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      body = (readParams(body));
      let { comment, name } = body;
      const commentWithOutNewLines = decodeURIComponent(comment).replace(/\+/g, ' ')
      body.comment = commentWithOutNewLines.replace(/\r\n/g, '<br />')
      body.name = decodeURIComponent(name).replace(/\+/g, ' ');
    }
    const req = new Request(method, url, query, headers, body);
    console.warn(req);
    return req;
  }
}

module.exports = Request;