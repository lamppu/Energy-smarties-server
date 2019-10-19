const express = require("express");
const dotenv = require("dotenv");

const PORT = 5000;
const app = express();

dotenv.config();

const knex = require('./config/db').knex;

const bookshelf = require('bookshelf') (knex);


app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});