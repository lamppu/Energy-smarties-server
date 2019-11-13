// Update with your config settings.
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
  },
  debug: true,
};
