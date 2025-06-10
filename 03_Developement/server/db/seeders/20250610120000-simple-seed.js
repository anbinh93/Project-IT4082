'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Insert Users first
    await queryInterface.bulkInsert('Users', [
      {
        username: 'ketoan',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
        role: 'accountant',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'totruong',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert LoaiXe
    await queryInterface.bulkInsert('LoaiXe', [
      {
        ten: 'Xe máy',
        phiThue: 100000,
        moTa: 'Phí gửi xe máy hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ten: 'Ô tô',
        phiThue: 500000,
        moTa: 'Phí gửi ô tô hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert some Canho (empty apartments)
    await queryInterface.bulkInsert('Canho', [
      {
        soPhong: 101,
        hoKhauId: null,
        dienTich: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soPhong: 102,
        hoKhauId: null,
        dienTich: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soPhong: 103,
        hoKhauId: null,
        dienTich: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert KhoanThu (Fee types)
    await queryInterface.bulkInsert('KhoanThu', [
      {
        tenKhoanThu: 'Phí quản lý',
        batBuoc: true,
        ghiChu: 'Phí quản lý chung cư hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenKhoanThu: 'Phí điện',
        batBuoc: true,
        ghiChu: 'Tiền điện hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenKhoanThu: 'Phí nước',
        batBuoc: true,
        ghiChu: 'Tiền nước hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Add sample residents and households
    await queryInterface.bulkInsert('NhanKhau', [
      {
        hoTen: 'Nguyễn Văn An',
        ngaySinh: new Date('1980-05-15'),
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: '001234567890',
        ngayCap: new Date('2020-01-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Kỹ sư',
        ghiChu: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoTen: 'Trần Thị Bình',
        ngaySinh: new Date('1985-03-20'),
        gioiTinh: 'Nữ',
        danToc: 'Kinh',
        tonGiao: 'Phật giáo',
        cccd: '001234567891',
        ngayCap: new Date('2020-02-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Giáo viên',
        ghiChu: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Add household (assuming first person is head of household)
    await queryInterface.bulkInsert('HoKhau', [
      {
        chuHo: 1, // Nguyễn Văn An
        soNha: '101',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Update Canho to assign to household
    await queryInterface.bulkUpdate('Canho', 
      { hoKhauId: 1 }, 
      { soPhong: 101 }
    );

    // Add household members
    await queryInterface.bulkInsert('ThanhVienHoKhau', [
      {
        nhanKhauId: 1,
        hoKhauId: 1,
        ngayThemNhanKhau: new Date('2023-01-01'),
        quanHeVoiChuHo: 'chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhanKhauId: 2,
        hoKhauId: 1,
        ngayThemNhanKhau: new Date('2023-01-01'),
        quanHeVoiChuHo: 'vợ/chồng',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ThanhVienHoKhau', null, {});
    await queryInterface.bulkUpdate('Canho', { hoKhauId: null }, {});
    await queryInterface.bulkDelete('HoKhau', null, {});
    await queryInterface.bulkDelete('NhanKhau', null, {});
    await queryInterface.bulkDelete('KhoanThu', null, {});
    await queryInterface.bulkDelete('Canho', null, {});
    await queryInterface.bulkDelete('LoaiXe', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
