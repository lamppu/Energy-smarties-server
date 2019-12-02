
exports.up = (knex) => knex.schema.table('GGEI', (table) => {
  table.renameColumn('GGEI index', 'Index');
}).table('City', (table) => {
  table.renameColumn('CoH data footprint', 'CoH_footprint');
}).table('Company', (table) => {
  table.renameColumn('Carbon footprint', 'CarbonFootprint');
});

exports.down = (knex) => knex.schema.table('GGEI', (table) => {
  table.renameColumn('Index', 'GGEI index');
}).table('City', (table) => {
  table.renameColumn('CoH_footprint', 'CoH data footprint');
}).table('Company', (table) => {
  table.renameColumn('CarbonFootprint', 'Carbon footprint');
});
