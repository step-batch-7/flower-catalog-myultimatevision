class Response {
  constructor() {
    this.statusCode = 404;
    this.headers = [{ key: 'content-length', value: 0 }];
  }

  setHeader(key, value) {
    const header = this.headers.find(header => header.key === key);
    if (header) header.value = value;
    else this.headers.push({ key, value });
  }

  getHeadersText() {
    const lines = this.headers.map(header => `${header.key} :${header.value}`);
    return lines.join('\r\n');
  }

  writeTo(writable) {
    writable.write(`HTTP/1.1 ${this.statusCode}`);
    writable.write(this.getHeadersText());
    writable.write(`\r\n\r\n`);
    this.body && writable.write(this.body);
  }
  setStatusCodeOk() {
    this.statusCode = 200;
  }

  setStatusCodeRedirect() {
    this.statusCode = 301;
  }
  setBody(content) {
    this.body = content;
  }
}

module.exports = Response;