'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop all existing tables first (in reverse dependency order)
    const tables = [
      'nopphi',
      'DotThu_KhoanThu',
      'thanhvienhokhau',
      'lichsuthaydoihokhau',
      'tamtrutamvang',
      'phuongtien',
      'canho',
      'hokhau',
      'nhankhau',
      'dotthu',
      'khoanthu',
      'users',
      // Drop old tables that might exist
      'quanlyxe',
      'phong',
      'loaixe'
    ];

    for (const table of tables) {
      try {
        await queryInterface.dropTable(table);
      } catch (error) {
        // Ignore errors if table doesn't exist
        console.log(`Table ${table} doesn't exist, skipping...`);
      }
    }

    // Create Users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create NhanKhau table
    await queryInterface.createTable('nhankhau', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create HoKhau table
    await queryInterface.createTable('hokhau', {
      soHoKhau: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create KhoanThu table
    await queryInterface.createTable('khoanthu', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tenKhoanThu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      batBuoc: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      ghiChu: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create DotThu table
    await queryInterface.createTable('dotthu', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tenDotThu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ngayTao: {
        type: Sequelize.DATE,
        allowNull: true
      },
      thoiHan: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create TamTruTamVang table
    await queryInterface.createTable('tamtrutamvang', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nhanKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      trangThai: {
        type: Sequelize.STRING,
        allowNull: false
      },
      diaChi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      thoiGian: {
        type: Sequelize.DATE,
        allowNull: true
      },
      noiDungDeNghi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create ThanhVienHoKhau table
    await queryInterface.createTable('thanhvienhokhau', {
      nhanKhauId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      ngayThemNhanKhau: {
        type: Sequelize.DATE,
        allowNull: true
      },
      quanHeVoiChuHo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create LichSuThayDoiHoKhau table
    await queryInterface.createTable('lichsuthaydoihokhau', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nhanKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      loaiThayDoi: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      thoiGian: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create DotThu_KhoanThu junction table
    await queryInterface.createTable('DotThu_KhoanThu', {
      dotThuId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      khoanThuId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create NopPhi table
    await queryInterface.createTable('nopphi', {
      hoKhauId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      khoanThuId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      soTien: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      nguoiNop: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ngayNop: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trangThai: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create CanHo table
    await queryInterface.createTable('canho', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      soPhong: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      chuHoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create PhuongTien table
    await queryInterface.createTable('phuongtien', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      loaiXe: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bienSo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      thoiGianGui: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trangThai: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    console.log('Database schema reset completed successfully!');
  },

  async down(queryInterface, Sequelize) {
    // Drop all tables in reverse order
    const tables = [
      'phuongtien',
      'canho',
      'nopphi',
      'DotThu_KhoanThu',
      'dotthu',
      'khoanthu',
      'lichsuthaydoihokhau',
      'thanhvienhokhau',
      'tamtrutamvang',
      'hokhau',
      'nhankhau',
      'users'
    ];

    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  }
};
