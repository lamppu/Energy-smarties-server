const bookshelf = require('../bookshelf');

require('./application.js');

module.exports = bookshelf.model('Category', {
  tableName: 'Category',
  apps() {
    return this.belongsToMany('Application');
  },
});
