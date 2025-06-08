'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add soft delete and enhanced features to nopphi table
    try {
      await queryInterface.addColumn('nopphi', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp'
      });
    } catch (error) {
      console.log('deletedAt column may already exist');
    }
    
    try {
      await queryInterface.addColumn('nopphi', 'status', {
        type: Sequelize.ENUM('ACTIVE', 'CANCELLED', 'REFUNDED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Payment status'
      });
    } catch (error) {
      console.log('status column may already exist');
    }
    
    try {
      await queryInterface.addColumn('nopphi', 'cancelledBy', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        comment: 'User who cancelled the payment'
      });
    } catch (error) {
      console.log('cancelledBy column may already exist');
    }
    
    try {
      await queryInterface.addColumn('nopphi', 'cancelReason', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason for cancellation'
      });
    } catch (error) {
      console.log('cancelReason column may already exist');
    }

    // Add payment method and additional tracking fields
    try {
      await queryInterface.addColumn('nopphi', 'phuongThucThanhToan', {
        type: Sequelize.ENUM('TIEN_MAT', 'CHUYEN_KHOAN', 'THU_TU_DONG'),
        allowNull: false,
        defaultValue: 'TIEN_MAT',
        comment: 'Payment method'
      });
    } catch (error) {
      console.log('phuongThucThanhToan column may already exist');
    }

    try {
      await queryInterface.addColumn('nopphi', 'maGiaoDich', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Transaction reference code'
      });
    } catch (error) {
      console.log('maGiaoDich column may already exist');
    }

    try {
      await queryInterface.addColumn('nopphi', 'ghiChu', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Payment notes'
      });
    } catch (error) {
      console.log('ghiChu column may already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove columns
    const columns = ['deletedAt', 'status', 'cancelledBy', 'cancelReason', 'phuongThucThanhToan', 'maGiaoDich', 'ghiChu'];
    
    for (const column of columns) {
      try {
        await queryInterface.removeColumn('nopphi', column);
      } catch (error) {
        console.log(`${column} column may not exist`);
      }
    }
  }
};
