const fs = require('fs');
const TEMPLATE_FOLDER = `${__dirname}/../templates`;


const loadTemplate = function (templateFileName) {
  const content = fs.readFileSync(`${TEMPLATE_FOLDER}${templateFileName}`, 'utf8');
  return html;
}

module.exports = { loadTemplate };