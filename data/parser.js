const csv = require('csv-parser');

const fs = require('fs');

function parseFile(fileName, delimiter) {
  return new Promise(((resolve) => {
    const results = [];
    try {
      fs.createReadStream(fileName)
        .pipe(csv({ separator: delimiter }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
          // console.log(results);
          resolve(results);
        });
    } catch (e) {
      console.log(e);
    }
  }));
}

module.exports = parseFile;
