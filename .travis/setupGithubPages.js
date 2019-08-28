const fs = require('fs');
const path = require('path');

const loggerUrl = process.env.LOGGER_URL

if (loggerUrl) {
  const messageJsFileName = path.resolve(__dirname, '..', 'src', 'helper', 'message.js');
  const messagejs = fs.readFileSync(messageJsFileName).toString()
    .replace(/^var usageLogger = null;/, `var usageLogger = '${loggerUrl}';`);

  fs.writeFile(messageJsFileName, messagejs, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully Written to File.');
    }
  });
}
