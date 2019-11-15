const bookshelf = require('../bookshelf');

require('./company.js');
require('./energy_consumption.js');
require('./category.js');

module.exports = bookshelf.model('Application', {
  tableName: 'Application',
  company() {
    return this.belongsTo('Company');
  },
  /*
  ecs() {
    return this.hasMany('Energy consumption');
  },
  categories() {
    return this.hasMany('Category');
  },
  */
});
