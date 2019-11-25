const parser = require('../data/parser');

const { map } = require('p-iteration');

const { filter } = require('p-iteration');

exports.seed = async (knex) => {
  try {
    const appData = await parser('./data/apps.csv', ';');
    const categories = new Set();
    const filterCat = (elem) => {
      if (categories.has(elem.Category)) {
        return false;
      }
      categories.add(elem.Category);
      return true;
    };
    const getCat = (elem) => ({ CategoryName: elem.Category });
    const companies = new Set();
    const filterComp = (elem) => {
      if (companies.has(elem.Company)) {
        return false;
      }
      companies.add(elem.Company);
      return true;
    };
    const getComp = (elem) => {
      const country = knex.select('id').from('Country')
        .where({ CountryName: elem.Country })
        .orWhere({ Abbrev: elem.Country })
        .orWhere({ AltName: elem.Country });
      if (country !== null) {
        const city = knex.select('id').from('City')
          .where({ CityName: elem.City })
          .andWhere({ Country_id: country });
        if (city !== null) {
          return {
            CompanyName: elem.Company,
            City_id: city,
          };
        }
      }
      return { CompanyName: elem.Company };
    };
    const getApp = (elem) => {
      const company = knex.select('id').from('Company')
        .where({ CompanyName: elem.Company });
      return {
        AppName: elem.App,
        Company_id: company,
      };
    };
    const getEC = (elem) => {
      const app = knex.select('id').from('Application')
        .where({ AppName: elem.App });
      return {
        ConsumptionRate: parseFloat((elem.ConsumptionRate).replace(/,/g, '.')),
        Application_id: app,
      };
    };
    const getAppCat = (elem) => {
      const app = knex.select('id').from('Application')
        .where({ AppName: elem.App });
      const category = knex.select('id').from('Category')
        .where({ CategoryName: elem.Category });
      return {
        Application_id: app,
        Category_id: category,
      };
    };
    const getFilteredCities = async (data) => {
      const filtered = await filter(data, async (elem) => {
        const country = await knex.select('id').from('Country')
          .where({ CountryName: elem.Country })
          .orWhere({ Abbrev: elem.Country })
          .orWhere({ AltName: elem.Country });
        // const country = await response1.toJson();
        console.log(country);
        const city = await knex.select('id').from('City')
          .where({ CityName: elem.City })
          .andWhere({ Country_id: country[0].id });
        // const city = await response2.toJson();
        console.log(city);
        const zero = 0;
        return city.length === zero;
      });
      return filtered;
    };
    const getMappedCities = (data) => map(data, async (elem) => {
      const country = await knex.select('id').from('Country')
        .where({ CountryName: elem.Country })
        .orWhere({ Abbrev: elem.Country })
        .orWhere({ AltName: elem.Country });
      // const country = response.toJson();
      console.log(country);
      return ({ CityName: elem.City, Country_id: country[0].id });
    });
    const getCityInsert = async (data) => {
      const filtered = await getFilteredCities(data);
      const mapped = await getMappedCities(filtered);
      return mapped;
    };
    const catInsert = appData.filter(filterCat).map(getCat);
    await knex('Category').insert(catInsert);
    const cityInsert = await getCityInsert(appData);
    console.log('------------------');
    console.log('cityInsert');
    console.log(cityInsert);
    console.log('------------------');
    await knex('City').insert(cityInsert);
    const compInsert = appData.filter(filterComp).map(getComp);
    await knex('Company').insert(compInsert);
    const appInsert = appData.map(getApp);
    await knex('Application').insert(appInsert);
    const eCInsert = appData.map(getEC);
    await knex('EnergyConsumption').insert(eCInsert);
    const appCatInsert = appData.map(getAppCat);
    await knex('Application_Category').insert(appCatInsert);
  } catch (e) {
    console.log(e);
  }
};