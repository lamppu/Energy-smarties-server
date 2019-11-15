const bookshelf = require('../bookshelf');

require('./application.js');

module.exports = bookshelf.model('Category', {
  tableName: 'Category',
  idAttribute: 'CategoryId',
  /* apps() {
    return this.hasMany('Application');
  }, */
});
