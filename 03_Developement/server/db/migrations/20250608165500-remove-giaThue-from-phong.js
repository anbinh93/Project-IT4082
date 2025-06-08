'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove giaThue column from phong table
    await queryInterface.removeColumn('phong', 'giaThue');
  },

  async down (queryInterface, Sequelize) {
    // Add giaThue column back if rollback is needed
    await queryInterface.addColumn('phong', 'giaThue', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Giá thuê hàng tháng'
    });
  }
};
