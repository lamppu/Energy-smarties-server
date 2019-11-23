const bookshelf = require('../bookshelf');

require('./city.js');
require('./ggei');

module.exports = bookshelf.model('Country', {
  tableName: 'Country',
  cities() {
    return this.hasMany('City');
  },
  ggeis() {
    return this.hasMany('GGEI');
  },
});
