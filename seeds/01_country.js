const parser = require('../data/parser');

exports.seed = async (knex) => {
  try {
    const ggei2018 = await parser('./data/ggei2018.csv', ';');
    const getCountries = (elem) => {
      if (elem.CountryName === 'United States') {
        return ({ CountryName: elem.CountryName, Abbrev: 'USA' });
      }
      if (elem.CountryName === 'United Arab Emirates') {
        return ({ CountryName: elem.CountryName, Abbrev: 'UAE' });
      }
      if (elem.CountryName === 'United Kingdom') {
        return ({ CountryName: elem.CountryName, Abbrev: 'UK' });
      }
      if (elem.CountryName === 'Russian Federation') {
        return ({ CountryName: elem.CountryName, AltName: 'Russia' });
      }
      if (elem.CountryName === 'Vietnam') {
        return ({ CountryName: elem.CountryName, AltName: 'Viet Nam' });
      }
      if (elem.CountryName === 'Slovak Republic') {
        return ({ CountryName: elem.CountryName, AltName: 'Slovakia' });
      }
      return ({ CountryName: elem.CountryName });
    };
    const countries = ggei2018.map(getCountries);
    // Inserts seed entries
    await knex('Country').insert(countries);
  } catch (e) {
    console.log(e);
  }
};
