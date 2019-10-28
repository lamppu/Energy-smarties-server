
exports.up = function (knex) {
  return knex.schema.renameTable('Energy consumption', 'EnergyConsumption');
};

exports.down = function (knex) {
  return knex.schema.renameTable('EnergyConsumption', 'Energy consumption');
};
