const parser = require('../data/parser');

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
      const country = knex.select('CountryId').from('Country')
        .where({ CountryName: elem.Country })
        .orWhere({ Abbrev: elem.Country })
        .orWhere({ AltName: elem.Country });
      console.log('countryId');
      console.log(country);
      if (country !== null) {
        const city = knex.select('CityId').from('City')
          .where({ CityName: elem.City })
          .andWhere({ CountryId: country });
        console.log('cityId');
        console.log(country);
        if (city !== null) {
          return {
            CompanyName: elem.Company,
            CityId: city,
          };
        }
      }
      return { CompanyName: elem.Company };
    };
    const getApp = (elem) => {
      const company = knex.select('CompanyId').from('Company')
        .where({ CompanyName: elem.Company });
      return {
        AppName: elem.App,
        CompanyId: company,
      };
    };
    const getEC = (elem) => {
      const app = knex.select('AppId').from('Application')
        .where({ AppName: elem.App });
      return {
        ConsumptionRate: parseFloat((elem.ConsumptionRate).replace(/,/g, '.')),
        AppId: app,
      };
    };
    const getAppCat = (elem) => {
      const app = knex.select('AppId').from('Application')
        .where({ AppName: elem.App });
      const category = knex.select('CategoryId').from('Category')
        .where({ CategoryName: elem.Category });
      return {
        AppId: app,
        CategoryId: category,
      };
    };
    const catInsert = appData.filter(filterCat).map(getCat);
    await knex('Category').insert(catInsert);
    const compInsert = appData.filter(filterComp).map(getComp);
    await knex('Company').insert(compInsert);
    const appInsert = appData.map(getApp);
    await knex('Application').insert(appInsert);
    const eCInsert = appData.map(getEC);
    await knex('EnergyConsumption').insert(eCInsert);
    const appCatInsert = appData.map(getAppCat);
    await knex('AppCategory').insert(appCatInsert);
  } catch (e) {
    console.log(e);
  }
};
