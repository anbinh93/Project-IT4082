'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the not-null constraint on chuHo column directly using raw SQL
    await queryInterface.sequelize.query('ALTER TABLE "HoKhau" ALTER COLUMN "chuHo" DROP NOT NULL;');
  },

  down: async (queryInterface, Sequelize) => {
    // Add back the not-null constraint  
    await queryInterface.sequelize.query('ALTER TABLE "HoKhau" ALTER COLUMN "chuHo" SET NOT NULL;');
  }
};
