const bookshelf = require('../bookshelf');

require('./company.js');
require('./country.js');

module.exports = bookshelf.model('City', {
  tableName: 'City',
  country() {
    return this.belongsTo('Country');
  },
  companies() {
    return this.hasMany('Company');
  },
});
