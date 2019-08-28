const fs = require('fs')

const messageJsFileName = __dirname + '../src/helper/message.js'
const messagejs = fs.readFileSync(messageJsFileName).toString()
  .replace(/^var usageLogger = null;/, `var usageLogger = '${process.env.LOGGER_URL}';`)

fs.writeFile(messageJs, messagejs, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully Written to File.');
    }
});
