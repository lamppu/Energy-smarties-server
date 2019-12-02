
exports.up = (knex) => knex.schema.table('Country', (table) => {
  table.string('Abbrev');
});


exports.down = (knex) => knex.schema.table('Country', (table) => {
  table.dropColumn('Abbrev');
});
