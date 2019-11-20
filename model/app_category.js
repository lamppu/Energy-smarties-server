const bookshelf = require('../bookshelf');

require('./application.js');
require('./category.js');

module.exports = bookshelf.model('AppCategory', {
  tableName: 'Application_Category',
  app() {
    return this.hasOne('Application');
  },
  category() {
    return this.belongsTo('Category');
  },
});
