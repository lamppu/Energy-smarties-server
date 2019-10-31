const csv = require('csv-parser');

const fs = require('fs');

function parseFile(fileName, delimiter) {
  return new Promise(((resolve, reject) => {
    const results = [];
    const rs = fs.createReadStream(fileName);
    rs.on('error', (err) => {
      reject(err);
    });
    rs.pipe(csv({ separator: delimiter }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // console.log(results);
        resolve(results);
      });
  }));
}

module.exports = parseFile;
