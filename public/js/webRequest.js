const sendHttpGET = (url, callback) => {
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status === 200) callback(this.responseText);
  }
  req.open('GET', url);
  req.send();
}