const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();

const router = require('./search');

// const { PORT } = process.env;
const PORT = 5000;
const app = express();
app.use(cors());
app.use('/', router);


app.listen(PORT, 'localhost', () => {
  console.log(`Server is listening on port: ${PORT}`);
});
