console.log(process.env.MYSQL_HOST);

const knex = require('knex') ({
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
        database: process.env.MYSQL_DB
    },
    debug: true
});

module.exports.knex = knex;