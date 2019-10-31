const parser = require('../data/parser');

exports.seed = async (knex) => {
  try {
    const ggmcf = await parser('./data/ggmcf.csv', ';');
    const filterCities = (elem) => {
      if (elem.UrbanCluster.includes('Unknown')) {
        return false;
      }
      if (elem.UrbanCluster.includes(',')) {
        return false;
      }
      if (elem.UrbanCluster.includes('/')) {
        return false;
      }
      return true;
    };
    const hel = 3.9;
    const espoo = 3.9;
    const vantaa = 4.7;
    const kauni = 4.1;
    const getCityModel = (elem) => {
      const id = knex.select('CountryId').from('Country')
        .where({ CountryName: elem.Country })
        .orWhere({ Abbrev: elem.Country })
        .orWhere({ AltName: elem.Country });
      if (elem.UrbanCluster === 'Helsinki') {
        return {
          CityName: elem.UrbanCluster,
          GGMCF: parseFloat(elem.FootprintPerCap_t_CO2),
          CoH_footprint: hel,
          CountryId: id,
        };
      }
      return {
        CityName: elem.UrbanCluster,
        GGMCF: parseFloat(elem.FootprintPerCap_t_CO2),
        CountryId: id,
      };
    };
    const cityInsert = ggmcf.filter(filterCities).map(getCityModel);
    cityInsert.push({
      CityName: 'Espoo',
      CoH_footprint: espoo,
      CountryId: knex('Country').select('CountryId').where({ CountryName: 'Finland' }),
    });
    cityInsert.push({
      CityName: 'Vantaa',
      CoH_footprint: vantaa,
      CountryId: knex('Country').select('CountryId').where({ CountryName: 'Finland' }),
    });
    cityInsert.push({
      CityName: 'Kauniainen',
      CoH_footprint: kauni,
      CountryId: knex('Country').select('CountryId').where({ CountryName: 'Finland' }),
    });
    console.log(cityInsert);
    await knex('City').insert(cityInsert);
  } catch (e) {
    console.log(e);
  }
};
