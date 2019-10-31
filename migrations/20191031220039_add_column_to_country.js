exports.up = (knex) => knex.schema.table('Country', (table) => {
  table.string('AltName');
});


exports.down = (knex) => knex.schema.table('Country', (table) => {
  table.dropColumn('AltName');
});
