const bookshelf = require('../bookshelf');

require('./application.js');

module.exports = bookshelf.model('EnergyConsumption', {
  tableName: 'EnergyConsumption',
  application() {
    return this.belongsTo('Application');
  },
});
