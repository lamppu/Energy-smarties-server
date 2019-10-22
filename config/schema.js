const knex = require('./db').knex;

/*
knex.schema
.dropTable('AppCategory')
.dropTable('Category')
.dropTable('Energy consumption')
.dropTable('Application')
.dropTable('Company')
.dropTable('City')
.dropTable('GGEI')
.dropTable('Country')
.then();*/


knex.schema.createTable('Country', function (table) {
    table.increments('CountryId');
    table.string('CountryName');
}).then();

knex.schema.createTable('GGEI', function (table) {
    table.increments('GgeiId');
    table.integer('Year');
    table.float('GGEI index');
    table.integer('CountryId').unsigned();
    table.foreign('CountryId').references('Country.CountryId');
}).then();

knex.schema.createTable('City', function (table) {
    table.increments('CityId');
    table.string('CityName');
    table.float('GGMCF');
    table.float('CoH data footprint');
    table.integer('CountryId').unsigned();
    table.foreign('CountryId').references('Country.CountryId');
}).then();

knex.schema.createTable('Company', function (table) {
    table.increments('CompanyId');
    table.string('CompanyName');
    table.float('Carbon footprint');
    table.integer('CityId').unsigned();
    table.foreign('CityId').references('City.CityId');
}).then();

knex.schema.createTable('Application', function (table) {
    table.increments('AppId');
    table.string('AppName');
    table.string('Keywords');
    table.integer('CompanyId').unsigned();
    table.foreign('CompanyId').references('Company.CompanyId');
}).then();

knex.schema.createTable('Energy consumption', function (table) {
    table.increments('EnergyId');
    table.string('Device');
    table.float('Consumption');
    table.integer('AppId').unsigned();
    table.foreign('AppId').references('Application.AppId');
}).then();

knex.schema.createTable('Category', function (table) {
    table.increments('CategoryId');
    table.string('CategoryName');
}).then();

knex.schema.createTable('AppCategory', function (table) {
    table.integer('AppId').unsigned().references('Application.AppId');
    table.integer('CategoryId').unsigned().references('Category.CategoryId');
}).then();


