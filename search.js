const express = require('express');

const router = express.Router();

const Category = require('./model/category');

router.get('/search', async (req, res) => {
  try {
    const collection = await Category.where({ CategoryName: req.query.keyword }).fetch({ withRelated: ['apps'] });
    console.log(collection.toJSON());
    res.send(collection);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
