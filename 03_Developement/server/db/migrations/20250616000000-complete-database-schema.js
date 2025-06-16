'use strict';

/**
 * 🗄️ IT4082 Complete Database Schema Migration
 * ============================================
 * 
 * This migration creates the complete database schema for the
 * IT4082 Apartment Management System with all required tables,
 * relationships, indexes, and constraints.
 * 
 * Created: June 16, 2025
 * Version: 1.0.0 (Production Ready)
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🚀 Starting complete database schema creation...');

      // =============================================
      // 1. CORE SYSTEM TABLES
      // =============================================

      // Users table for authentication
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('admin', 'manager', 'accountant', 'user'),
          allowNull: false,
          defaultValue: 'user'
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: true,
          unique: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        lastLogin: {
          type: Sequelize.DATE,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // =============================================
      // 2. RESIDENT AND HOUSEHOLD MANAGEMENT
      // =============================================

      // Residents (NhanKhau) table
      await queryInterface.createTable('NhanKhau', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        hoTen: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        ngaySinh: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        gioiTinh: {
          type: Sequelize.ENUM('Nam', 'Nữ', 'Khác'),
          allowNull: false
        },
        danToc: {
          type: Sequelize.STRING(50),
          defaultValue: 'Kinh'
        },
        tonGiao: {
          type: Sequelize.STRING(50),
          defaultValue: 'Không'
        },
        cccd: {
          type: Sequelize.STRING(12),
          allowNull: false,
          unique: true
        },
        ngayCap: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        noiCap: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        ngheNghiep: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        ghiChu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Households (HoKhau) table
      await queryInterface.createTable('HoKhau', {
        soHoKhau: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        chuHo: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'NhanKhau',
            key: 'id'
          },
          unique: true
        },
        soNha: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        duong: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        phuong: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        quan: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        thanhPho: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        ngayLamHoKhau: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        trangThai: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
          defaultValue: 'ACTIVE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Household Members (ThanhVienHoKhau) junction table
      await queryInterface.createTable('ThanhVienHoKhau', {
        nhanKhauId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'NhanKhau',
            key: 'id'
          }
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        ngayThemNhanKhau: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        quanHeVoiChuHo: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        trangThai: {
          type: Sequelize.ENUM('ACTIVE', 'MOVED_OUT', 'DECEASED'),
          defaultValue: 'ACTIVE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // =============================================
      // 3. HOUSING MANAGEMENT
      // =============================================

      // Apartments (Canho) table
      await queryInterface.createTable('Canho', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        soPhong: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          },
          unique: true
        },
        dienTich: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        soPhongNgu: {
          type: Sequelize.INTEGER,
          defaultValue: 1
        },
        soPhongTam: {
          type: Sequelize.INTEGER,
          defaultValue: 1
        },
        trangThai: {
          type: Sequelize.ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'),
          defaultValue: 'AVAILABLE'
        },
        giaThue: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true
        },
        moTa: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Rooms table for additional room types
      await queryInterface.createTable('Rooms', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        soPhong: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true
        },
        loaiPhong: {
          type: Sequelize.ENUM('APARTMENT', 'COMMERCIAL', 'STORAGE', 'PARKING', 'COMMON'),
          allowNull: false,
          defaultValue: 'APARTMENT'
        },
        dienTich: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        tang: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        trangThai: {
          type: Sequelize.ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'),
          defaultValue: 'AVAILABLE'
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        giaThue: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true
        },
        ngayBatDauThue: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        ngayKetThucThue: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        moTa: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // =============================================
      // 4. VEHICLE MANAGEMENT
      // =============================================

      // Vehicle Types (LoaiXe) table
      await queryInterface.createTable('LoaiXe', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        ten: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true
        },
        phiThue: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0
        },
        moTa: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Vehicle Management (QuanLyXe) table
      await queryInterface.createTable('QuanLyXe', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        loaiXeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'LoaiXe',
            key: 'id'
          }
        },
        bienSo: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true
        },
        hangXe: {
          type: Sequelize.STRING(50),
          allowNull: true
        },
        mauXe: {
          type: Sequelize.STRING(30),
          allowNull: true
        },
        namSanXuat: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        ngayBatDau: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        ngayKetThuc: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        trangThai: {
          type: Sequelize.ENUM('Đang sử dụng', 'Đã hủy', 'Tạm dừng'),
          defaultValue: 'Đang sử dụng'
        },
        ghiChu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // =============================================
      // 5. FEE MANAGEMENT SYSTEM
      // =============================================

      // Fee Types (KhoanThu) table
      await queryInterface.createTable('KhoanThu', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        tenkhoanthu: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        ngaytao: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        thoihan: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        batbuoc: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        soTienToiThieu: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
          defaultValue: 0
        },
        ghichu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        trangThai: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'EXPIRED'),
          defaultValue: 'ACTIVE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Collection Periods (DotThu) table
      await queryInterface.createTable('DotThu', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        tenDotThu: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        ngayTao: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        thoiHan: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        trangThai: {
          type: Sequelize.ENUM('DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED'),
          defaultValue: 'DRAFT'
        },
        moTa: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        tongSoTien: {
          type: Sequelize.DECIMAL(20, 2),
          defaultValue: 0
        },
        soHoKhauThamGia: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Collection Period - Fee Type Junction table
      await queryInterface.createTable('DotThu_KhoanThu', {
        dotThuId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'DotThu',
            key: 'id'
          }
        },
        khoanThuId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'KhoanThu',
            key: 'id'
          }
        },
        soTien: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0
        },
        ghiChu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Household Fees table
      await queryInterface.createTable('HouseholdFees', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        dotThuId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'DotThu',
            key: 'id'
          }
        },
        khoanThuId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'KhoanThu',
            key: 'id'
          }
        },
        soTien: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false
        },
        trangThai: {
          type: Sequelize.ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELLED'),
          defaultValue: 'PENDING'
        },
        ngayTao: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        ngayDaoHan: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        ghiChu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Payment Records (NopPhi) table
      await queryInterface.createTable('NopPhi', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        hokhau_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        khoanthu_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'KhoanThu',
            key: 'id'
          }
        },
        householdFeeId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'HouseholdFees',
            key: 'id'
          }
        },
        sotien: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false
        },
        ngaynop: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        nguoinop: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        phuongthuc: {
          type: Sequelize.ENUM('CASH', 'BANK_TRANSFER', 'ONLINE', 'CARD'),
          defaultValue: 'CASH'
        },
        ghichu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'ACTIVE'),
          defaultValue: 'PENDING'
        },
        nguoiXacNhan: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        ngayXacNhan: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // =============================================
      // 6. HISTORY AND TRACKING TABLES
      // =============================================

      // Household Change History table
      await queryInterface.createTable('LichSuThayDoiHoKhau', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nhanKhauId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'NhanKhau',
            key: 'id'
          }
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        loaiThayDoi: {
          type: Sequelize.ENUM('THEM_MOI', 'CHUYEN_DI', 'CHUYEN_DEN', 'TACH_HO', 'GOPI_HO', 'TU_VONG'),
          allowNull: false
        },
        thoiGian: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        lyDo: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        nguoiThucHien: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        ghiChu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // Temporary Residence (TamTruTamVang) table
      await queryInterface.createTable('TamTruTamVang', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nhanKhauId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'NhanKhau',
            key: 'id'
          }
        },
        loai: {
          type: Sequelize.ENUM('TAM_TRU', 'TAM_VANG'),
          allowNull: false
        },
        trangThai: {
          type: Sequelize.ENUM('CHO_DUYET', 'DA_DUYET', 'BI_TU_CHOI', 'HET_HAN'),
          defaultValue: 'CHO_DUYET'
        },
        diaChi: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        thoiGian: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        thoiHan: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        noiDungDeNghi: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        nguoiDuyet: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        ngayDuyet: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        ghiChu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });

      // =============================================
      // 7. CREATE INDEXES FOR PERFORMANCE
      // =============================================

      console.log('📊 Creating database indexes...');

      // Primary indexes
      await queryInterface.addIndex('NhanKhau', ['cccd'], { 
        unique: true, 
        name: 'idx_nhankhau_cccd',
        transaction 
      });
      
      await queryInterface.addIndex('NhanKhau', ['hoKhauId'], { 
        name: 'idx_nhankhau_hokhau',
        transaction 
      });

      await queryInterface.addIndex('HoKhau', ['chuHo'], { 
        unique: true, 
        name: 'idx_hokhau_chuho',
        transaction 
      });

      await queryInterface.addIndex('Canho', ['hoKhauId'], { 
        unique: true, 
        name: 'idx_canho_hokhau',
        transaction 
      });

      await queryInterface.addIndex('Canho', ['soPhong'], { 
        unique: true, 
        name: 'idx_canho_sophong',
        transaction 
      });

      // Fee management indexes
      await queryInterface.addIndex('HouseholdFees', ['hoKhauId', 'dotThuId'], { 
        name: 'idx_household_fees_ho_dot',
        transaction 
      });

      await queryInterface.addIndex('HouseholdFees', ['trangThai'], { 
        name: 'idx_household_fees_status',
        transaction 
      });

      await queryInterface.addIndex('NopPhi', ['hokhau_id', 'khoanthu_id'], { 
        name: 'idx_nopphi_ho_khoanthu',
        transaction 
      });

      // Performance indexes
      await queryInterface.addIndex('NhanKhau', ['hoTen'], { 
        name: 'idx_nhankhau_hoten',
        transaction 
      });

      await queryInterface.addIndex('QuanLyXe', ['bienSo'], { 
        unique: true, 
        name: 'idx_quanlyxe_bienso',
        transaction 
      });

      await queryInterface.addIndex('LichSuThayDoiHoKhau', ['nhanKhauId', 'thoiGian'], { 
        name: 'idx_lichsu_nhankhau_time',
        transaction 
      });

      // =============================================
      // 8. ADD FOREIGN KEY CONSTRAINTS
      // =============================================

      console.log('🔗 Adding foreign key constraints...');

      // Add foreign key constraints that weren't added during table creation
      // (Due to circular dependencies, some FKs need to be added after table creation)

      await queryInterface.addConstraint('NhanKhau', {
        fields: ['hoKhauId'],
        type: 'foreign key',
        name: 'fk_nhankhau_hokhau',
        references: {
          table: 'HoKhau',
          field: 'soHoKhau'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction
      });

      await queryInterface.addConstraint('HoKhau', {
        fields: ['chuHo'],
        type: 'foreign key',
        name: 'fk_hokhau_chuho',
        references: {
          table: 'NhanKhau',
          field: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction
      });

      // =============================================
      // 9. ADD CHECK CONSTRAINTS
      // =============================================

      console.log('✅ Adding check constraints...');

      // Age validation
      await queryInterface.addConstraint('NhanKhau', {
        fields: ['ngaySinh'],
        type: 'check',
        name: 'check_ngaysinh_valid',
        where: {
          ngaySinh: {
            [Sequelize.Op.lte]: new Date()
          }
        },
        transaction
      });

      // Fee amount validation
      await queryInterface.addConstraint('HouseholdFees', {
        fields: ['soTien'],
        type: 'check',
        name: 'check_sotien_positive',
        where: {
          soTien: {
            [Sequelize.Op.gte]: 0
          }
        },
        transaction
      });

      await queryInterface.addConstraint('NopPhi', {
        fields: ['sotien'],
        type: 'check',
        name: 'check_nopphi_sotien_positive',
        where: {
          sotien: {
            [Sequelize.Op.gt]: 0
          }
        },
        transaction
      });

      await transaction.commit();
      console.log('✅ Database schema created successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error creating database schema:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🗑️ Dropping database schema...');

      // Drop tables in reverse order to avoid foreign key constraints
      const tables = [
        'TamTruTamVang',
        'LichSuThayDoiHoKhau', 
        'NopPhi',
        'HouseholdFees',
        'DotThu_KhoanThu',
        'DotThu',
        'KhoanThu',
        'QuanLyXe',
        'LoaiXe',
        'Rooms',
        'Canho',
        'ThanhVienHoKhau',
        'HoKhau',
        'NhanKhau',
        'Users'
      ];

      for (const table of tables) {
        await queryInterface.dropTable(table, { transaction });
      }

      await transaction.commit();
      console.log('✅ Database schema dropped successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error dropping database schema:', error);
      throw error;
    }
  }
};
