const parser = require('../data/parser');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('GGEI').del();
  await knex.raw('ALTER TABLE GGEI AUTO_INCREMENT = 1');
  /*
  const ggei2018 = await parser('../data/ggei2018.csv', ';');
  const getCountries = function (elem) {
    return { CountryName: elem.CountryName };
  };
  const countries = ggei2018.map(getCountries);
  // Inserts seed entries
  return knex('Country').insert(countries);
  */
};
