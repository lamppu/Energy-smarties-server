
exports.up = (knex) => knex.schema
  .createTable('Application_Category', (table) => {
    table.integer('Application_id').unsigned().references('Application.id');
    table.integer('Category_CategoryId').unsigned().references('Category.CategoryId');
    table.primary(['Application_id', 'Category_CategoryId']);
  })
  .table('EnergyConsumption', (table) => {
    table.integer('Application_id').unsigned();
    table.foreign('Application_id').references('Application.id');
  });

exports.down = (knex) => knex.schema
  .dropTableIfExists('Application_Category')
  .table('EnergyConsumption', (table) => {
    table.dropForeign('Application_id');
    table.dropColumn('Application_id');
  });
