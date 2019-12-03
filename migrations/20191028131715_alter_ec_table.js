
exports.up = (knex) => knex.schema.renameTable('Energy consumption', 'EnergyConsumption');

exports.down = (knex) => knex.schema.renameTable('EnergyConsumption', 'Energy consumption');
