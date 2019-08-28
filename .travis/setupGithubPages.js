const fs = require('fs')

const messagejs = fs.readFileSync(__dirname + '../src/helper/message.js').toString()
  .replace(/^var usageLogger = null;/, `var usageLogger = '${process.env.LOGGER_URL}';`)

fs.writeFile(__dirname + "../src/helper/message.js", messagejs, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});