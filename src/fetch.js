const display = require('./display');
const https = require('https');
const parse = require('./parse');

module.exports = () => {
  const mailConfig = require(`${process.env.HOME}/.shark-mail.js`);
  const options = {
    host: "mail.google.com",
    path: "/mail/feed/atom",
    headers: {
      'Authorization': 'Basic ' + new Buffer(mailConfig.cred.username + ':' + mailConfig.cred.password).toString('base64')
    }
  };
  https.get(options, (res) => {
    var requestData = '';
    res.on('data', (data) => {
      requestData += data;
    });
    res.on('end', () => {
      // do something with the email data
      parse(requestData)
        .then(display);
    });
  }).on('error', (err) => display.apply(null, `error :: ${err.message}`));
};