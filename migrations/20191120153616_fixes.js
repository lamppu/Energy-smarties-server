
exports.up = (knex) => knex.schema
  .dropTableIfExists('Application_Category')
  .dropTableIfExists('Category')
  .dropTableIfExists('EnergyConsumption')
  .dropTableIfExists('Application')
  .dropTableIfExists('Company')
  .dropTableIfExists('City')
  .dropTableIfExists('GGEI')
  .dropTableIfExists('Country')
  .createTable('Country', (table) => {
    table.increments('id');
    table.string('CountryName');
    table.string('Abbrev');
    table.string('AltName');
  })
  .createTable('GGEI', (table) => {
    table.increments('id');
    table.integer('Year');
    table.float('Index');
    table.integer('Country_id').unsigned();
    table.foreign('Country_id').references('Country.id');
  })
  .createTable('City', (table) => {
    table.increments('id');
    table.string('CityName');
    table.float('GGMCF');
    table.float('CoH_footprint');
    table.integer('Country_id').unsigned();
    table.foreign('Country_id').references('Country.id');
  })
  .createTable('Company', (table) => {
    table.increments('id');
    table.string('CompanyName');
    table.float('Carbon_footprint');
    table.integer('City_id').unsigned();
    table.foreign('City_id').references('City.id');
  })
  .createTable('Application', (table) => {
    table.increments('id');
    table.string('AppName');
    table.string('Keywords');
    table.integer('Company_id').unsigned();
    table.foreign('Company_id').references('Company.id');
  })
  .createTable('EnergyConsumption', (table) => {
    table.increments('id');
    table.string('Device');
    table.float('ConsumptionRate');
    table.integer('Application_id').unsigned();
    table.foreign('Application_id').references('Application.id');
  })
  .createTable('Category', (table) => {
    table.increments('id');
    table.string('CategoryName');
  })
  .createTable('Application_Category', (table) => {
    table.integer('Application_id').unsigned().references('Application.id');
    table.integer('Category_id').unsigned().references('Category.id');
    // table.primary(['Application_id', 'Category_id']);
  });

exports.down = (knex) => knex.schema
  .dropTableIfExists('Application_Category')
  .dropTableIfExists('Category')
  .dropTableIfExists('EnergyConsumption')
  .dropTableIfExists('Application')
  .dropTableIfExists('Company')
  .dropTableIfExists('City')
  .dropTableIfExists('GGEI')
  .dropTableIfExists('Country');
