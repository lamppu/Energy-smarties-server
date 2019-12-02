const { map } = require('p-iteration');

const { filter } = require('p-iteration');

const parser = require('../data/parser');


exports.seed = async (knex) => {
  try {
    const zero = 0;
    const appData = await parser('./data/apps.csv', ';');
    const categories = new Set();
    const filterCat = (elem) => {
      if (categories.has(elem.Category)) {
        return false;
      }
      categories.add(elem.Category);
      return true;
    };
    const getCat = (elem) => {
      const scale = 'Scale';
      const scaleName = elem.Category + scale;
      const scaleId = knex.select('id').from('Scaling').where({ ScaleName: scaleName });
      return {
        CategoryName: elem.Category,
        Scaling_id: scaleId,
      };
    };
    const companies = new Set();
    const filterComp = (elem) => {
      if (companies.has(elem.Company)) {
        return false;
      }
      companies.add(elem.Company);
      return true;
    };
    const getComp = (elem) => {
      let cfp;
      if (parseFloat(elem.Company_footprint)) {
        cfp = parseFloat(elem.Company_footprint);
      } else {
        cfp = null;
      }
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
            Carbon_footprint: cfp,
            City_id: city,
          };
        }
      }
      return {
        CompanyName: elem.Company,
        Carbon_footprint: cfp,
      };
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
        const city = await knex.select('id').from('City')
          .where({ CityName: elem.City })
          .andWhere({ Country_id: country[0].id });
        return city.length === zero;
      });
      return filtered;
    };
    const getMappedCities = (data) => map(data, async (elem) => {
      const country = await knex.select('id').from('Country')
        .where({ CountryName: elem.Country })
        .orWhere({ Abbrev: elem.Country })
        .orWhere({ AltName: elem.Country });
      return ({ CityName: elem.City, Country_id: country[0].id });
    });
    const getCityInsert = async (data) => {
      const filtered = await getFilteredCities(data);
      const mapped = await getMappedCities(filtered);
      return mapped;
    };
    const filteredCats = appData.filter(filterCat);
    const getScaling = (inputArray, scaleName) => {
      const min = 0;
      const max = 10;
      const array = inputArray.filter((elem) => elem);
      console.log(array);
      if (!array.length) {
        return ({
          ScaleName: scaleName,
          VariableA: 0,
          VariableB: 0,
          Min: min,
          Max: max,
        });
      }
      const arrayMin = Math.min(...array);
      const arrayMax = Math.max(...array);
      const x = arrayMin - (arrayMax - arrayMin) / array.length;
      const y = arrayMax + (arrayMax - arrayMin) / array.length;
      if (y - x === zero) {
        return ({
          ScaleName: scaleName,
          VariableA: 0,
          VariableB: 0,
          Min: min,
          Max: max,
        });
      }
      const a = (min - max) / (y - x);
      const b = max - a * x;
      return ({
        ScaleName: scaleName,
        VariableA: a,
        VariableB: b,
        Min: min,
        Max: max,
      });
    };
    const scalingInsert = [];
    categories.forEach((elem) => {
      const cat = elem;
      const scale = 'Scale';
      const scaleName = elem + scale;
      const ecs = [];
      appData.forEach((app) => {
        if (app.Category === cat) {
          ecs.push(parseFloat((app.ConsumptionRate).replace(/,/g, '.')));
        }
      });
      scalingInsert.push(getScaling(ecs, scaleName));
    });
    const getCompFP = (elem) => parseFloat(elem.Company_footprint);
    const compFootprints = appData.map(getCompFP);
    console.log(compFootprints);
    scalingInsert.push(getScaling(compFootprints, 'CompanyScale'));
    await knex('Scaling').insert(scalingInsert);
    const catInsert = filteredCats.map(getCat);
    await knex('Category').insert(catInsert);
    const cityInsert = await getCityInsert(appData);
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
