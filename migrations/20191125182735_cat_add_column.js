exports.up = (knex) => knex.schema.table('Category', (table) => {
  table.integer('Scaling_id').unsigned();
  table.foreign('Scaling_id').references('Scaling.id');
});
exports.down = (knex) => knex.schema.table('Category', (table) => {
  table.dropForeign('Scaling_id');
  table.dropColumn('Scaling_id');
});
