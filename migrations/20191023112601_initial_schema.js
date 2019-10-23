
exports.up = function(knex) {
  return knex.schema.createTable('Country', function (table) {
    table.increments('CountryId');
    table.string('CountryName');
}).createTable('GGEI', function (table) {
    table.increments('GgeiId');
    table.integer('Year');
    table.float('GGEI index');
    table.integer('CountryId').unsigned();
    table.foreign('CountryId').references('Country.CountryId');
}).createTable('City', function (table) {
    table.increments('CityId');
    table.string('CityName');
    table.float('GGMCF');
    table.float('CoH data footprint');
    table.integer('CountryId').unsigned();
    table.foreign('CountryId').references('Country.CountryId');
}).createTable('Company', function (table) {
    table.increments('CompanyId');
    table.string('CompanyName');
    table.float('Carbon footprint');
    table.integer('CityId').unsigned();
    table.foreign('CityId').references('City.CityId');
}).createTable('Application', function (table) {
    table.increments('AppId');
    table.string('AppName');
    table.string('Keywords');
    table.integer('CompanyId').unsigned();
    table.foreign('CompanyId').references('Company.CompanyId');
}).createTable('Energy consumption', function (table) {
    table.increments('EnergyId');
    table.string('Device');
    table.float('Consumption');
    table.integer('AppId').unsigned();
    table.foreign('AppId').references('Application.AppId');
}).createTable('Category', function (table) {
    table.increments('CategoryId');
    table.string('CategoryName');
}).createTable('AppCategory', function (table) {
    table.integer('AppId').unsigned().references('Application.AppId');
    table.integer('CategoryId').unsigned().references('Category.CategoryId');
    table.primary(['AppId', 'CategoryId']);
})
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('AppCategory')
    .dropTableIfExists('Category')
    .dropTableIfExists('Energy consumption')
    .dropTableIfExists('Application')
    .dropTableIfExists('Company')
    .dropTableIfExists('City')
    .dropTableIfExists('GGEI')
    .dropTableIfExists('Country')
};
