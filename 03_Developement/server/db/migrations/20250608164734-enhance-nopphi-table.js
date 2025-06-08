'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add soft delete and enhanced features to nopphi table
    await queryInterface.addColumn('nopphi', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp'
    });
    
    await queryInterface.addColumn('nopphi', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'CANCELLED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      comment: 'Payment status'
    });
    
    await queryInterface.addColumn('nopphi', 'cancelledBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who cancelled the payment'
    });
    
    await queryInterface.addColumn('nopphi', 'cancelReason', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Reason for cancellation'
    });

    await queryInterface.addColumn('nopphi', 'phuongThucThanhToan', {
      type: Sequelize.ENUM('TIEN_MAT', 'CHUYEN_KHOAN', 'THU_TU_DONG'),
      allowNull: false,
      defaultValue: 'TIEN_MAT',
      comment: 'Payment method'
    });

    await queryInterface.addColumn('nopphi', 'maGiaoDich', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Transaction reference code'
    });

    await queryInterface.addColumn('nopphi', 'ghiChu', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Payment notes'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('nopphi', 'deletedAt');
    await queryInterface.removeColumn('nopphi', 'status');
    await queryInterface.removeColumn('nopphi', 'cancelledBy');
    await queryInterface.removeColumn('nopphi', 'cancelReason');
    await queryInterface.removeColumn('nopphi', 'phuongThucThanhToan');
    await queryInterface.removeColumn('nopphi', 'maGiaoDich');
    await queryInterface.removeColumn('nopphi', 'ghiChu');
  }
};
