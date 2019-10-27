const express = require('express');

const PORT = 5000;
const app = express();

const knex = require('./knexfile');
const bookshelf = require('bookshelf')(knex);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
