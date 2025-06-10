'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop all existing tables
    await queryInterface.dropAllTables();

    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['accountant', 'manager']] // kế toán, tổ trưởng
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create LoaiXe table
    await queryInterface.createTable('LoaiXe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ten: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phiThue: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      moTa: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create KhoanThu table
    await queryInterface.createTable('KhoanThu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tenKhoanThu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      batBuoc: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      ghiChu: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create DotThu table
    await queryInterface.createTable('DotThu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tenDotThu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ngayTao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      thoiHan: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create DotThu_KhoanThu junction table
    await queryInterface.createTable('DotThu_KhoanThu', {
      dotThuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DotThu',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      khoanThuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'KhoanThu',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add composite primary key
    await queryInterface.addConstraint('DotThu_KhoanThu', {
      fields: ['dotThuId', 'khoanThuId'],
      type: 'primary key',
      name: 'DotThu_KhoanThu_pkey'
    });

    // Create Canho table
    await queryInterface.createTable('Canho', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soPhong: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },
      dienTich: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create HoKhau table
    await queryInterface.createTable('HoKhau', {
      soHoKhau: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chuHo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      soNha: {
        type: Sequelize.STRING,
        allowNull: true
      },
      duong: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phuong: {
        type: Sequelize.STRING,
        allowNull: true
      },
      quan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      thanhPho: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ngayLamHoKhau: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create NhanKhau table
    await queryInterface.createTable('NhanKhau', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hoTen: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ngaySinh: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gioiTinh: {
        type: Sequelize.STRING,
        allowNull: false
      },
      danToc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tonGiao: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cccd: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      ngayCap: {
        type: Sequelize.DATE,
        allowNull: true
      },
      noiCap: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ngheNghiep: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ghiChu: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create ThanhVienHoKhau table
    await queryInterface.createTable('ThanhVienHoKhau', {
      nhanKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'NhanKhau',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'HoKhau',
          key: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ngayThemNhanKhau: {
        type: Sequelize.DATE,
        allowNull: false
      },
      quanHeVoiChuHo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['vợ/chồng', 'con', 'bố/mẹ', 'khác']]
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create LichSuThayDoiHoKhau table
    await queryInterface.createTable('LichSuThayDoiHoKhau', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nhanKhauId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'NhanKhau',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'HoKhau',
          key: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      loaiThayDoi: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      thoiGian: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create TamTruTamVang table
    await queryInterface.createTable('TamTruTamVang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nhanKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'NhanKhau',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      trangThai: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['đang tạm trú', 'đã kết thúc', 'tạm vắng']]
        }
      },
      diaChi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tuNgay: {
        type: Sequelize.DATE,
        allowNull: false
      },
      thoiGian: {
        type: Sequelize.DATE,
        allowNull: false
      },
      noiDungDeNghi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create QuanLyXe table
    await queryInterface.createTable('QuanLyXe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'HoKhau',
          key: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      loaiXeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'LoaiXe',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      bienSo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      ngayBatDau: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ngayKetThuc: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trangThai: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create NopPhi table
    await queryInterface.createTable('NopPhi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'HoKhau',
          key: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      khoanThuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'KhoanThu',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      soTien: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      nguoiNop: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ngayNop: {
        type: Sequelize.DATE,
        allowNull: false
      },
      trangThai: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('Canho', {
      fields: ['hoKhauId'],
      type: 'foreign key',
      name: 'fk_canho_hokhau',
      references: {
        table: 'HoKhau',
        field: 'soHoKhau'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('HoKhau', {
      fields: ['chuHo'],
      type: 'foreign key',
      name: 'fk_hokhau_chuho',
      references: {
        table: 'NhanKhau',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  }
};
