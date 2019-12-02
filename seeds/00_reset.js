
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('Application_Category').del();
  await knex.raw('ALTER TABLE Application_Category AUTO_INCREMENT = 1');
  await knex('Category').del();
  await knex.raw('ALTER TABLE Category AUTO_INCREMENT = 1');
  await knex('Scaling').del();
  await knex.raw('ALTER TABLE Scaling AUTO_INCREMENT = 1');
  await knex('EnergyConsumption').del();
  await knex.raw('ALTER TABLE EnergyConsumption AUTO_INCREMENT = 1');
  await knex('Application').del();
  await knex.raw('ALTER TABLE Application AUTO_INCREMENT = 1');
  await knex('Company').del();
  await knex.raw('ALTER TABLE Company AUTO_INCREMENT = 1');
  await knex('City').del();
  await knex.raw('ALTER TABLE City AUTO_INCREMENT = 1');
  await knex('GGEI').del();
  await knex.raw('ALTER TABLE GGEI AUTO_INCREMENT = 1');
  await knex('Country').del();
  await knex.raw('ALTER TABLE Country AUTO_INCREMENT = 1');
};
