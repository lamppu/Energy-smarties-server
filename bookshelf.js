const mysql = require('./db.js');

// console.log(knex);

module.exports = require('bookshelf')(mysql);
