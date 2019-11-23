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
      const id = knex.select('id').from('Country')
        .where({ CountryName: elem.Country })
        .orWhere({ Abbrev: elem.Country })
        .orWhere({ AltName: elem.Country });
      if (elem.UrbanCluster === 'Helsinki') {
        return {
          CityName: elem.UrbanCluster,
          GGMCF: parseFloat(elem.FootprintPerCap_t_CO2),
          CoH_footprint: hel,
          Country_id: id,
        };
      }
      return {
        CityName: elem.UrbanCluster,
        GGMCF: parseFloat(elem.FootprintPerCap_t_CO2),
        Country_id: id,
      };
    };
    const cityInsert = ggmcf.filter(filterCities).map(getCityModel);
    const finId = knex('Country').select('id').where({ CountryName: 'Finland' });
    cityInsert.push({
      CityName: 'Espoo',
      CoH_footprint: espoo,
      Country_id: finId,
    });
    cityInsert.push({
      CityName: 'Vantaa',
      CoH_footprint: vantaa,
      Country_id: finId,
    });
    cityInsert.push({
      CityName: 'Kauniainen',
      CoH_footprint: kauni,
      Country_id: finId,
    });
    // console.log(cityInsert);
    await knex('City').insert(cityInsert);
  } catch (e) {
    console.log(e);
  }
};
