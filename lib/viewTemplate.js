const fs = require('fs');
const TEMPLATE_FOLDER = `${__dirname}/../templates`;


const loadTemplate = function (templateFileName, propertyBag) {
  const content = fs.readFileSync(`${TEMPLATE_FOLDER}${templateFileName}`, 'utf8');

  const replaceKeyWithValue = function (content, key) {
    const pattern = new RegExp(`__${key}__`, 'g');
    return content.replace(pattern, propertyBag[key]);
  };
  const keys = Object.keys(propertyBag);
  const html = keys.reduce(replaceKeyWithValue, content);
  return html;
}

module.exports = { loadTemplate };