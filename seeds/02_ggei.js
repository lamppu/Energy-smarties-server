const parser = require('../data/parser');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('GGEI').del();
  await knex.raw('ALTER TABLE GGEI AUTO_INCREMENT = 1');
  const ggei2018 = await parser('./data/ggei2018.csv', ';');
  const getGGEI = function (elem, i) {
    const one = 1;
    return { Year: 2018, Index: parseFloat((elem.ggeiIndex).replace(/,/g, '.')), CountryId: i + one };
  };
  const ggeiInsert = ggei2018.map(getGGEI);
  // Inserts seed entries
  return knex('GGEI').insert(ggeiInsert);
};
