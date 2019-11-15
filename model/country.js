const bookshelf = require('../bookshelf');

require('./city.js');

module.exports = bookshelf.model('Country', {
  tableName: 'country',
  /* cities() {
    return this.hasMany('City');
  }, */
});
