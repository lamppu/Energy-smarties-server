const parser = require('../data/parser');

exports.seed = async (knex) => {
  try {
    const ggei2018 = await parser('./data/ggei2018.csv', ';');
    const getCountries = (elem) => ({ CountryName: elem.CountryName });
    const countries = ggei2018.map(getCountries);
    // Inserts seed entries
    await knex('Country').insert(countries);
  } catch (e) {
    console.log(e);
  }
};
