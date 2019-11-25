const express = require('express');

const router = express.Router();

const Category = require('./model/category');

const Scaling = require('./model/scaling');

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
    const collection = await Category.where({ CategoryName: req.query.keyword }).fetch({ withRelated: ['scaling', 'apps.company.city.country.ggeis', 'apps.ecs'] });
    const countryScale = await Scaling.where({ ScaleName: 'CountryScale' }).fetch();
    const cityScale = await Scaling.where({ ScaleName: 'CityScale' }).fetch();
    const compScale = await Scaling.where({ ScaleName: 'CompanyScale' }).fetch();
    const response = collection.toJSON().apps.map((elem) => {
      const appName = elem.AppName;
      const rate = elem.ecs[0].ConsumptionRate;
      const compcf = elem.company.Carbon_footprint;
      const citycf = elem.company.city.GGMCF;
      const ggei = elem.company.city.country.ggeis[0].Index;
      const es = score(
        collection.toJSON().scaling.VariableA,
        collection.toJSON().scaling.VariableB,
        rate,
      );
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
    });
    // console.log(collection.toJSON());
    // console.log(collection.toJSON().apps);
    res.send(response);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
