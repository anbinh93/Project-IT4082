'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hokhau', 'phong_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'phong',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add index for better performance
    await queryInterface.addIndex('hokhau', ['phong_id'], {
      name: 'idx_hokhau_phong_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('hokhau', 'idx_hokhau_phong_id');
    await queryInterface.removeColumn('hokhau', 'phong_id');
  }
};
