const express = require('express');

const router = express.Router();

const Category = require('./model/category');

router.get('/search', async (req, res) => {
  try {
    const collection = await Category.where({ CategoryName: req.query.keyword }).fetch({ withRelated: ['apps.company.city.country.ggeis', 'apps.ecs'] });
    const response = [];
    collection.toJSON().apps.forEach((elem) => {
      response.push({
        AppName: elem.AppName,
        EnergyScore: elem.ecs[0].ConsumptionRate,
        CompanyScore: elem.company.Carbon_footprint,
        CityScore: elem.company.city.GGMCF,
        CountryScore: elem.company.city.country.ggeis[0].Index,
        TotalScore: null,
      });
    });
    console.log(collection.toJSON());
    console.log(collection.toJSON().apps);
    res.send(response);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
