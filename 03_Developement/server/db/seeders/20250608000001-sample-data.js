'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Temporarily disable foreign key checks
    await queryInterface.sequelize.query('SET session_replication_role = replica;');
    
    // Insert sample users
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'accountant',
        password: '123456',
        role: 'accountant',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user',
        password: '123456',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });

    // Insert sample hokhau (households) - MUST BE FIRST due to foreign key constraints
    await queryInterface.bulkInsert('hokhau', [
      {
        chuHo: 1, // Temporary, will be correct after nhankhau insert
        soNha: '123',
        duong: 'Nguyễn Trãi',
        phuong: 'Thanh Xuân Nam',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: '2020-01-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        chuHo: 1, // Temporary, will be correct after nhankhau insert  
        soNha: '456',
        duong: 'Lê Duẩn',
        phuong: 'Thanh Xuân Bắc',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: '2021-06-01',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });

    // Insert sample nhankhau (people)
    await queryInterface.bulkInsert('nhankhau', [
      {
        hoTen: 'Nguyễn Văn An',
        ngaySinh: '1980-05-15',
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: '001080012345',
        ngayCap: '2020-01-15',
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Kỹ sư',
        ghiChu: 'Chủ hộ',
        hoKhauId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoTen: 'Trần Thị Bình',
        ngaySinh: '1985-08-20',
        gioiTinh: 'Nữ',
        danToc: 'Kinh',
        tonGiao: 'Phật giáo',
        cccd: '001085067890',
        ngayCap: '2020-03-10',
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Giáo viên',
        ghiChu: 'Vợ chủ hộ',
        hoKhauId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoTen: 'Nguyễn Văn Cường',
        ngaySinh: '2010-12-05',
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: null,
        ngayCap: null,
        noiCap: null,
        ngheNghiep: 'Học sinh',
        ghiChu: 'Con trai',
        hoKhauId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoTen: 'Lê Minh Dương',
        ngaySinh: '1990-03-12',
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: '001090045678',
        ngayCap: '2021-05-20',
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Lập trình viên',
        ghiChu: 'Chủ hộ khác',
        hoKhauId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });

    // Insert thanhvienhokhau (household members)
    await queryInterface.bulkInsert('thanhvienhokhau', [
      {
        nhanKhauId: 1,
        hoKhauId: 1,
        ngayThemNhanKhau: '2020-01-01',
        quanHeVoiChuHo: 'Chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhanKhauId: 2,
        hoKhauId: 1,
        ngayThemNhanKhau: '2020-01-01',
        quanHeVoiChuHo: 'Vợ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhanKhauId: 3,
        hoKhauId: 1,
        ngayThemNhanKhau: '2020-01-01',
        quanHeVoiChuHo: 'Con trai',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhanKhauId: 4,
        hoKhauId: 2,
        ngayThemNhanKhau: '2021-06-01',
        quanHeVoiChuHo: 'Chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample khoanthu (fee types)
    await queryInterface.bulkInsert('khoanthu', [
      {
        tenKhoanThu: 'Phí quản lý chung cư',
        batBuoc: true,
        ghiChu: 'Phí hàng tháng bắt buộc',
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
        ghiChu: 'Dịch vụ internet tùy chọn',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample dotthu (collection periods)
    await queryInterface.bulkInsert('dotthu', [
      {
        tenDotThu: 'Đợt thu tháng 1/2025',
        ngayTao: '2024-12-15',
        thoiHan: '2025-01-31',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenDotThu: 'Đợt thu tháng 2/2025',
        ngayTao: '2025-01-15',
        thoiHan: '2025-02-28',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert DotThu_KhoanThu relationships
    await queryInterface.bulkInsert('DotThu_KhoanThu', [
      { dotThuId: 1, khoanThuId: 1, createdAt: new Date(), updatedAt: new Date() },
      { dotThuId: 1, khoanThuId: 2, createdAt: new Date(), updatedAt: new Date() },
      { dotThuId: 1, khoanThuId: 3, createdAt: new Date(), updatedAt: new Date() },
      { dotThuId: 2, khoanThuId: 1, createdAt: new Date(), updatedAt: new Date() },
      { dotThuId: 2, khoanThuId: 2, createdAt: new Date(), updatedAt: new Date() },
      { dotThuId: 2, khoanThuId: 3, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Insert sample nopphi (payments)
    await queryInterface.bulkInsert('nopphi', [
      {
        hoKhauId: 1,
        khoanThuId: 1,
        soTien: 500000.00,
        nguoiNop: 'Nguyễn Văn An',
        ngayNop: '2025-01-15',
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoKhauId: 1,
        khoanThuId: 2,
        soTien: 300000.00,
        nguoiNop: 'Nguyễn Văn An',
        ngayNop: '2025-01-15',
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoKhauId: 2,
        khoanThuId: 1,
        soTien: 500000.00,
        nguoiNop: 'Lê Minh Dương',
        ngayNop: '2025-01-20',
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample canho (apartments)
    await queryInterface.bulkInsert('canho', [
      {
        soPhong: 101,
        hoKhauId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soPhong: 201,
        hoKhauId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soPhong: 301,
        hoKhauId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample phuongtien (vehicles)
    await queryInterface.bulkInsert('phuongtien', [
      {
        hoKhauId: 1,
        loaiXe: 'Ô tô',
        bienSo: '30A-12345',
        thoiGianGui: '2025-01-01',
        trangThai: 'Đang gửi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoKhauId: 1,
        loaiXe: 'Xe máy',
        bienSo: '30B1-67890',
        thoiGianGui: '2025-01-01',
        trangThai: 'Đang gửi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hoKhauId: 2,
        loaiXe: 'Xe máy',
        bienSo: '30C1-11111',
        thoiGianGui: '2025-01-15',
        trangThai: 'Đang gửi',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample tamtrutamvang (temporary residence)
    await queryInterface.bulkInsert('tamtrutamvang', [
      {
        nhanKhauId: 3,
        trangThai: 'Tạm trú',
        diaChi: '789 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
        thoiGian: '2024-12-01',
        noiDungDeNghi: 'Học tập tại trường đại học',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample lichsuthaydoihokhau (household change history)
    await queryInterface.bulkInsert('lichsuthaydoihokhau', [
      {
        nhanKhauId: 2,
        hoKhauId: 1,
        loaiThayDoi: 1, // 1: Thêm thành viên, 2: Xóa thành viên, 3: Thay đổi thông tin
        thoiGian: '2020-01-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhanKhauId: 3,
        hoKhauId: 1,
        loaiThayDoi: 1,
        thoiGian: '2020-01-01',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Update hokhau.chuHo after nhankhau is inserted
    await queryInterface.bulkUpdate('hokhau', 
      { chuHo: 1 }, 
      { soHoKhau: 1 }
    );
    
    await queryInterface.bulkUpdate('hokhau', 
      { chuHo: 4 }, 
      { soHoKhau: 2 }
    );

    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET session_replication_role = DEFAULT;');

    console.log('Sample data inserted successfully!');
  },

  down: async (queryInterface, Sequelize) => {
    // Delete sample data in reverse order of dependencies
    await queryInterface.bulkDelete('lichsuthaydoihokhau', null, {});
    await queryInterface.bulkDelete('tamtrutamvang', null, {});
    await queryInterface.bulkDelete('phuongtien', null, {});
    await queryInterface.bulkDelete('canho', null, {});
    await queryInterface.bulkDelete('nopphi', null, {});
    await queryInterface.bulkDelete('DotThu_KhoanThu', null, {});
    await queryInterface.bulkDelete('dotthu', null, {});
    await queryInterface.bulkDelete('khoanthu', null, {});
    await queryInterface.bulkDelete('thanhvienhokhau', null, {});
    await queryInterface.bulkDelete('hokhau', null, {});
    await queryInterface.bulkDelete('nhankhau', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
