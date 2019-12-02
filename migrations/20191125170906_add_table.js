exports.up = (knex) => knex.schema.createTable('Scaling', (table) => {
  table.increments('id');
  table.string('ScaleName');
  table.float('VariableA');
  table.float('VariableB');
  table.integer('Min');
  table.integer('Max');
});
exports.down = (knex) => knex.schema.dropTableIfExists('Scaling');
