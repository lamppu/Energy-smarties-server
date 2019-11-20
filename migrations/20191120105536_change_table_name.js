
exports.up = (knex) => knex.schema.renameTable('AppCategory', 'Application_Category');

exports.down = (knex) => knex.schema.renameTable('Application_Category', 'AppCategory');
