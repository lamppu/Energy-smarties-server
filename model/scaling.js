const bookshelf = require('../bookshelf');

require('./category.js');

module.exports = bookshelf.model('Scaling', {
  tableName: 'Scaling',
});
