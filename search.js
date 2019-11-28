const express = require('express');

const router = express.Router();

const Category = require('./model/category');

const Scaling = require('./model/scaling');

const Application = require('./model/application');

const zero = 0;
const one = 1;
const score = (a, b, x) => (a * x + b);
const totalScore = (es, comps, cits, cous) => {
  const two = 2;
  const four = 4;
  return (two * es + comps + cits + cous) / four;
};

router.get('/search', async (req, res) => {
  try {
    const countryScale = await Scaling.where({ ScaleName: 'CountryScale' }).fetch();
    const cityScale = await Scaling.where({ ScaleName: 'CityScale' }).fetch();
    const compScale = await Scaling.where({ ScaleName: 'CompanyScale' }).fetch();
    let partAppName = false;
    let partCatName = false;
    let collection;
    const getResponse = (elem) => {
      const appName = elem.AppName;
      const cityName = elem.company.city.CityName;
      const countryName = elem.company.city.country.CountryName;
      const rate = elem.ecs[0].ConsumptionRate;
      const compcf = elem.company.Carbon_footprint;
      const citycf = elem.company.city.GGMCF;
      const ggei = elem.company.city.country.ggeis[0].Index;
      let es;
      if (partAppName) {
        es = score(
          elem.categories[0].scaling.VariableA,
          elem.categories[0].scaling.VariableB,
          rate,
        );
      } else if (partCatName) {
        es = score(
          collection.toJSON()[0].scaling.VariableA,
          collection.toJSON()[0].scaling.VariableB,
          rate,
        );
      } else {
        es = score(
          collection.toJSON().scaling.VariableA,
          collection.toJSON().scaling.VariableB,
          rate,
        );
      }
      let comps;
      if (compcf) {
        comps = score(
          compScale.toJSON().VariableA,
          compScale.toJSON().VariableB,
          compcf,
        );
      } else {
        comps = zero;
      }
      let cits;
      if (citycf) {
        cits = score(cityScale.toJSON().VariableA, cityScale.toJSON().VariableB, citycf);
      } else {
        cits = zero;
      }
      let cous;
      if (ggei) {
        cous = score(countryScale.toJSON().VariableA, countryScale.toJSON().VariableB, ggei);
      } else {
        cous = zero;
      }
      return ({
        AppName: appName,
        City: cityName,
        Country: countryName,
        EnergyScore: es.toFixed(one),
        CompanyScore: comps.toFixed(one),
        CityScore: cits.toFixed(one),
        CountryScore: cous.toFixed(one),
        TotalScore: totalScore(es, comps, cits, cous).toFixed(one),
      });
    };
    const sortByTotalScore = (a, b) => {
      if (parseFloat(a.TotalScore) < parseFloat(b.TotalScore)) {
        return one;
      }
      return -one;
    };
    const sortByEnergyScore = (a, b) => {
      if (parseFloat(a.EnergyScore) < parseFloat(b.EnergyScore)) {
        return one;
      }
      return -one;
    };
    const sortByCompanyScore = (a, b) => {
      if (parseFloat(a.CompanyScore) < parseFloat(b.CompanyScore)) {
        return one;
      }
      return -one;
    };
    const sortByCityScore = (a, b) => {
      if (parseFloat(a.CityScore) < parseFloat(b.CityScore)) {
        return one;
      }
      return -one;
    };
    const sortByCountryScore = (a, b) => {
      if (parseFloat(a.CountryScore) < parseFloat(b.CountryScore)) {
        return one;
      }
      return -one;
    };
    let response;
    const sortResponse = () => {
      if (req.query.sortby) {
        if (req.query.sortby === 'total') {
          response.sort(sortByTotalScore);
        } else if (req.query.sortby === 'energy') {
          response.sort(sortByEnergyScore);
        } else if (req.query.sortby === 'company') {
          response.sort(sortByCompanyScore);
        } else if (req.query.sortby === 'city') {
          response.sort(sortByCityScore);
        } else if (req.query.sortby === 'country') {
          response.sort(sortByCountryScore);
        }
      } else {
        response.sort(sortByTotalScore);
      }
    };
    // We start the search here by looking for exact match from category
    collection = await Category.where({ CategoryName: req.query.keyword })
      .fetch({ require: false, withRelated: ['scaling', 'apps.company.city.country.ggeis', 'apps.ecs'] });
    if (collection) {
      // Exact match found from category
      response = collection.toJSON().apps.map(getResponse);
      sortResponse();
      res.send(response);
    }
    // No exact category was found, continue by looking for exact match from apps
    collection = await Application.where({ AppName: req.query.keyword })
      .fetch({ require: false, withRelated: ['categories'] });
    if (collection) {
      // Exact match was found from apps
      collection = await Category.where({ id: collection.toJSON().categories[0].id })
        .fetch({ require: false, withRelated: ['scaling', 'apps.company.city.country.ggeis', 'apps.ecs'] });
      response = collection.toJSON().apps.map(getResponse);
      sortResponse();
      let toBeUnShifted;
      response = response.filter((elem) => {
        if (elem.AppName.toLowerCase() === req.query.keyword) {
          toBeUnShifted = elem;
          return false;
        }
        return true;
      });
      response.unshift(toBeUnShifted);
      res.send(response);
    }
    // No exact app was found, continue by looking for apps
    // for which the app name contains the search keyword
    collection = await Application.query((qb) => {
      qb.whereRaw('`AppName` LIKE ?', [`%${req.query.keyword}%`]);
    }).fetchAll({ require: false, withRelated: ['categories.scaling', 'company.city.country.ggeis', 'ecs'] });
    if (collection.length) {
      // Found app/apps
      partAppName = true;
      response = collection.toJSON().map(getResponse);
      sortResponse();
      res.send(response);
    }
    // No apps were found, continue by looking for categories
    // for which the category name contains the search keyword.
    // NOT HANDLED: What if the search finds multiple categories?
    collection = await Category.query((qb) => {
      qb.whereRaw('`CategoryName` LIKE ?', [`%${req.query.keyword}%`]);
    }).fetchAll({ require: false, withRelated: ['scaling', 'apps.company.city.country.ggeis', 'apps.ecs'] });
    if (collection.length) {
      partCatName = true;
      response = collection.toJSON()[0].apps.map(getResponse);
      sortResponse();
      res.send(response);
    } else {
      response = ['Nothing found'];
      res.send(response);
    }
  } catch (e) {
    console.log(e);
    res.send(['Nothing found']);
  }
});

module.exports = router;
