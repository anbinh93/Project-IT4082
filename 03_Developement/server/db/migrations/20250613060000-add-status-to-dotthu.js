'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add trangThai (status) column to DotThu table as VARCHAR first
    await queryInterface.addColumn('DotThu', 'trangThai', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Status of fee collection period: DANG_MO (Open), DA_DONG (Closed), HOAN_THANH (Completed)'
    });

    // Add dongTuDong (auto-closure) column
    await queryInterface.addColumn('DotThu', 'dongTuDong', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether to automatically close the period after deadline'
    });

    // Update existing records to have default status
    await queryInterface.sequelize.query(`
      UPDATE "DotThu" 
      SET "trangThai" = CASE 
        WHEN "thoiHan" < NOW() THEN 'DA_DONG'
        ELSE 'DANG_MO'
      END
      WHERE "trangThai" IS NULL
    `);

    // Make trangThai not nullable after updating existing records
    await queryInterface.changeColumn('DotThu', 'trangThai', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'DANG_MO'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the added columns
    await queryInterface.removeColumn('DotThu', 'dongTuDong');
    await queryInterface.removeColumn('DotThu', 'trangThai');
  }
};
