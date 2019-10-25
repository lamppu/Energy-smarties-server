
exports.up = function (knex) {
  return knex.schema.createTable('Country', (table) => {
    table.increments('CountryId');
    table.string('CountryName');
  }).createTable('GGEI', (table) => {
    table.increments('GgeiId');
    table.integer('Year');
    table.float('GGEI index');
    table.integer('CountryId').unsigned();
    table.foreign('CountryId').references('Country.CountryId');
  }).createTable('City', (table) => {
    table.increments('CityId');
    table.string('CityName');
    table.float('GGMCF');
    table.float('CoH data footprint');
    table.integer('CountryId').unsigned();
    table.foreign('CountryId').references('Country.CountryId');
  }).createTable('Company', (table) => {
    table.increments('CompanyId');
    table.string('CompanyName');
    table.float('Carbon footprint');
    table.integer('CityId').unsigned();
    table.foreign('CityId').references('City.CityId');
  })
    .createTable('Application', (table) => {
      table.increments('AppId');
      table.string('AppName');
      table.string('Keywords');
      table.integer('CompanyId').unsigned();
      table.foreign('CompanyId').references('Company.CompanyId');
    })
    .createTable('Energy consumption', (table) => {
      table.increments('EnergyId');
      table.string('Device');
      table.float('Consumption');
      table.integer('AppId').unsigned();
      table.foreign('AppId').references('Application.AppId');
    })
    .createTable('Category', (table) => {
      table.increments('CategoryId');
      table.string('CategoryName');
    })
    .createTable('AppCategory', (table) => {
      table.integer('AppId').unsigned().references('Application.AppId');
      table.integer('CategoryId').unsigned().references('Category.CategoryId');
      table.primary(['AppId', 'CategoryId']);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('AppCategory')
    .dropTableIfExists('Category')
    .dropTableIfExists('Energy consumption')
    .dropTableIfExists('Application')
    .dropTableIfExists('Company')
    .dropTableIfExists('City')
    .dropTableIfExists('GGEI')
    .dropTableIfExists('Country');
};
