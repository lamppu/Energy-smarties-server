const bookshelf = require('../bookshelf');

require('./application.js');

require('./scaling.js');

module.exports = bookshelf.model('Category', {
  tableName: 'Category',
  apps() {
    return this.belongsToMany('Application');
  },
  scaling() {
    return this.belongsTo('Scaling');
  },
});
