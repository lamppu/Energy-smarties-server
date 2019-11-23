const express = require('express');

const router = express.Router();

const Category = require('./model/category');

router.get('/search', async (req, res) => {
  try {
    const collection = await Category.where({ CategoryName: req.query.keyword }).fetch({ withRelated: ['apps.company.city.country.ggeis'] });
    const collectionWithEC = await Category.where({ CategoryName: req.query.keyword }).fetch({ withRelated: ['apps.ecs'] });
    const response = [];
    collection.toJSON().apps.forEach((elem) => {
      response.push({
        AppName: elem.AppName,
      });
    });
    console.log(collection.toJSON().apps);
    console.log(collectionWithEC.toJSON());
    res.send(response);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
