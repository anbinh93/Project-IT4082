'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add nguoiThue field to distinguish between owner and tenant
    await queryInterface.addColumn('Rooms', 'nguoiThue', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Tên người thuê thực tế (có thể khác với chủ hộ)'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rooms', 'nguoiThue');
  }
};
