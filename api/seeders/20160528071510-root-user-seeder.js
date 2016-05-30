'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('users', [{
      first_name: 'Dāvis',
      last_name: 'Mednis',
      email: 'davis.mednis@esynergy.lv',
      username: 'dmednis',
      password: '$2a$10$4yXe2s6XoAmVwyPPyyMvQOt22fC3ckWJEUpui/DFoJM5.ZJqq/aiC',
      status: true,
      created_at: new Date(),
      updated_at: new Date(),
      role: 'admin'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
