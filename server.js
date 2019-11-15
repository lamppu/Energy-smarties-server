const express = require('express');

const cors = require('cors');

const router = require('./search');

const PORT = 5000;
const app = express();
app.use(cors());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
