const bookshelf = require('../bookshelf');

require('./country.js');

module.exports = bookshelf.model('GGEI', {
  tableName: 'GGEI',
  country() {
    return this.belongsTo('Country');
  },
});
