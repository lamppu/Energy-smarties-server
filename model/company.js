const bookshelf = require('../bookshelf');

require('./city.js');
require('./application.js');

module.exports = bookshelf.model('Company', {
  tableName: 'Company',
  city() {
    return this.belongsTo('City');
  },
  /* apps() {
    return this.hasMany('Application');
  }, */
});
