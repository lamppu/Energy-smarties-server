const bookshelf = require('../bookshelf');

require('./company.js');
require('./energy_consumption.js');
require('./category.js');

module.exports = bookshelf.model('Application', {
  tableName: 'Application',
  company() {
    return this.belongsTo('Company');
  },
  ecs() {
    return this.hasMany('EnergyConsumption');
  },
  categories() {
    return this.belongsToMany('Category');
  },
});
