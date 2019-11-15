const express = require('express');

const router = express.Router();

const Category = require('./model/category');
const AppCategory = require('./model/app_category');

router.get('/search', (req, res) => {
  console.log(req.query.keyword);
  Category.where({ CategoryName: req.query.keyword }).fetch().then((category) => {
    console.log(category.idAttribute);
    /*
    AppCategory.where({ CategoryId: category.CategoryId })
      .fetch()
      .then((list) => {
        res.send(list);
      }); */
    res.send(category);
  });
  // console.log(catId);
  // res.send(catId);
  /*
  Category.where({ CategoryName: req.query.keyword })
    .fetch({ withRelated: ['apps'] }).then((cat) => {
      res.send(cat.related('apps'));
    });
    */
});

module.exports = router;
