'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert Users (2 users: accountant và manager)
    await queryInterface.bulkInsert('Users', [
      {
        username: 'ketoan',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'accountant',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'totruong',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
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
      },
      {
        ten: 'Xe đạp điện',
        phiThue: 50000,
        moTa: 'Phí gửi xe đạp điện hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert KhoanThu
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
      },
      {
        tenKhoanThu: 'Phí internet',
        batBuoc: false,
        ghiChu: 'Phí internet chung',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert DotThu
    await queryInterface.bulkInsert('DotThu', [
      {
        tenDotThu: 'Thu phí tháng 6/2025',
        ngayTao: new Date('2025-06-01'),
        thoiHan: new Date('2025-06-30'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert DotThu_KhoanThu relationships
    await queryInterface.bulkInsert('DotThu_KhoanThu', [
      {
        dotThuId: 1,
        khoanThuId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dotThuId: 1,
        khoanThuId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dotThuId: 1,
        khoanThuId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert some Canho (Apartments)
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
        soPhong: 201,
        hoKhauId: null,
        dienTich: 65,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soPhong: 202,
        hoKhauId: null,
        dienTich: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample NhanKhau
    await queryInterface.bulkInsert('NhanKhau', [
      {
        hoTen: 'Nguyễn Văn An',
        ngaySinh: new Date('1980-01-15'),
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
      },
      {
        hoTen: 'Lê Minh Cường',
        ngaySinh: new Date('1975-07-10'),
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: '001234567892',
        ngayCap: new Date('2020-03-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Bác sĩ',
        ghiChu: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert HoKhau
    await queryInterface.bulkInsert('HoKhau', [
      {
        chuHo: 1,
        soNha: '101',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        chuHo: 3,
        soNha: '201',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-02-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Update Canho with hoKhauId
    await queryInterface.bulkUpdate('Canho', 
      { hoKhauId: 1 },
      { soPhong: 101 }
    );
    
    await queryInterface.bulkUpdate('Canho', 
      { hoKhauId: 2 },
      { soPhong: 201 }
    );

    // Insert ThanhVienHoKhau
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
      },
      {
        nhanKhauId: 3,
        hoKhauId: 2,
        ngayThemNhanKhau: new Date('2023-02-01'),
        quanHeVoiChuHo: 'chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert some QuanLyXe
    await queryInterface.bulkInsert('QuanLyXe', [
      {
        hoKhauId: 1,
        loaiXeId: 1,
        bienSo: '30A-12345',
        ngayBatDau: new Date('2023-01-01'),
        ngayKetThuc: null,
        trangThai: 'Đang sử dụng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoKhauId: 1,
        loaiXeId: 2,
        bienSo: '30A-67890',
        ngayBatDau: new Date('2023-06-01'),
        ngayKetThuc: null,
        trangThai: 'Đang sử dụng',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample NopPhi
    await queryInterface.bulkInsert('NopPhi', [
      {
        hoKhauId: 1,
        khoanThuId: 1,
        soTien: 500000.00,
        nguoiNop: 'Nguyễn Văn An',
        ngayNop: new Date('2025-06-05'),
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoKhauId: 1,
        khoanThuId: 2,
        soTien: 800000.00,
        nguoiNop: 'Nguyễn Văn An',
        ngayNop: new Date('2025-06-05'),
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('NopPhi', null, {});
    await queryInterface.bulkDelete('QuanLyXe', null, {});
    await queryInterface.bulkDelete('ThanhVienHoKhau', null, {});
    await queryInterface.bulkDelete('HoKhau', null, {});
    await queryInterface.bulkDelete('NhanKhau', null, {});
    await queryInterface.bulkDelete('Canho', null, {});
    await queryInterface.bulkDelete('DotThu_KhoanThu', null, {});
    await queryInterface.bulkDelete('DotThu', null, {});
    await queryInterface.bulkDelete('KhoanThu', null, {});
    await queryInterface.bulkDelete('LoaiXe', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
