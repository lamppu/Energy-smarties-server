const parser = require('../data/parser');

exports.seed = async (knex) => {
  try {
    const ggei2018 = await parser('./data/ggei2018.csv', ';');
    const getGGEI = (elem, i) => {
      const one = 1;
      return { Year: 2018, Index: parseFloat((elem.ggeiIndex).replace(/,/g, '.')), CountryId: i + one };
    };
    const ggeiInsert = ggei2018.map(getGGEI);
    await knex('GGEI').insert(ggeiInsert);
  } catch (e) {
    console.log(e);
  }
};
