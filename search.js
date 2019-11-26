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
    let catcollection = true;
    let collection;
    const getResponse = (elem) => {
      const appName = elem.AppName;
      const rate = elem.ecs[0].ConsumptionRate;
      const compcf = elem.company.Carbon_footprint;
      const citycf = elem.company.city.GGMCF;
      const ggei = elem.company.city.country.ggeis[0].Index;
      let es;
      if (catcollection) {
        es = score(
          collection.toJSON().scaling.VariableA,
          collection.toJSON().scaling.VariableB,
          rate,
        );
      } else {
        console.log(elem);
        es = score(
          elem.categories[0].scaling.VariableA,
          elem.categories[0].scaling.VariableB,
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
        EnergyScore: es.toFixed(one),
        CompanyScore: comps.toFixed(one),
        CityScore: cits.toFixed(one),
        CountryScore: cous.toFixed(one),
        TotalScore: totalScore(es, comps, cits, cous).toFixed(one),
      });
    };
    collection = await Category.where({ CategoryName: req.query.keyword })
      .fetch({ require: false, withRelated: ['scaling', 'apps.company.city.country.ggeis', 'apps.ecs'] });
    let response;
    if (!collection) {
      collection = await Application.where({ AppName: req.query.keyword })
        .fetch({ require: false, withRelated: ['categories'] });
      if (!collection) {
        collection = await Application.query((qb) => {
          qb.whereRaw('`AppName` LIKE ?', [`%${req.query.keyword}%`]);
        }).fetchAll({ require: false, withRelated: ['categories.scaling', 'company.city.country.ggeis', 'ecs'] });
        if (!collection) {
          response = ['Nothing found'];
        } else if (collection.toJSON().length > one) {
          catcollection = false;
          response = collection.toJSON().map(getResponse);
        } else {
          collection = await Category.where({ id: collection.toJSON().categories[0].id })
            .fetch({ require: false, withRelated: ['scaling', 'apps.company.city.country.ggeis', 'apps.ecs'] });
          response = collection.toJSON().apps.map(getResponse);
        }
      } else {
        collection = await Category.where({ id: collection.toJSON().categories[0].id })
          .fetch({ require: false, withRelated: ['scaling', 'apps.company.city.country.ggeis', 'apps.ecs'] });
        response = collection.toJSON().apps.map(getResponse);
      }
    } else {
      response = collection.toJSON().apps.map(getResponse);
    }
    res.send(response);
  } catch (e) {
    console.log(e);
    res.send(['Nothing found']);
  }
});

module.exports = router;
