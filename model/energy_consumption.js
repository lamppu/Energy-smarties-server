const bookshelf = require('../bookshelf');

require('./application.js');

module.exports = bookshelf.model('Energy consumption', {
  tableName: 'Energy consumption',
  application() {
    return this.belongsTo('Application');
  },
});
