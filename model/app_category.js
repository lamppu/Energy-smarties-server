const bookshelf = require('../bookshelf');

require('./application.js');
require('./category.js');

module.exports = bookshelf.model('AppCategory', {
  tableName: 'AppCategory',
  apps() {
    return this.hasMany('Application');
  },
  categories() {
    return this.hasMany('Category');
  },
});
