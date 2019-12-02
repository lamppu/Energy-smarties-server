
exports.up = (knex) => knex.schema.table('EnergyConsumption', (table) => {
  table.renameColumn('Consumption', 'ConsumptionRate');
});

exports.down = (knex) => knex.schema.table('EnergyConsumption', (table) => {
  table.renameColumn('ConsumptionRate', 'Consumption');
});
