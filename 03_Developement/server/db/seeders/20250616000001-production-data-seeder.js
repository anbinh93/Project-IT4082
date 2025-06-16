'use strict';

/**
 * 🌱 IT4082 Production Data Seeder
 * ================================
 * 
 * This seeder populates the database with comprehensive sample data
 * for the IT4082 Apartment Management System, suitable for both
 * development and production environments.
 * 
 * Created: June 16, 2025
 * Version: 1.0.0 (Production Ready)
 */

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🌱 Starting comprehensive data seeding...');

      // =============================================
      // 1. SYSTEM USERS
      // =============================================
      console.log('👤 Creating system users...');
      
      const salt = await bcrypt.genSalt(10);
      
      await queryInterface.bulkInsert('Users', [
        {
          username: 'admin',
          password: await bcrypt.hash('admin123', salt),
          role: 'admin',
          email: 'admin@apartment.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'manager',
          password: await bcrypt.hash('manager123', salt),
          role: 'manager', 
          email: 'manager@apartment.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'accountant',
          password: await bcrypt.hash('accountant123', salt),
          role: 'accountant',
          email: 'accountant@apartment.com', 
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'staff1',
          password: await bcrypt.hash('staff123', salt),
          role: 'user',
          email: 'staff1@apartment.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'staff2',
          password: await bcrypt.hash('staff123', salt),
          role: 'user',
          email: 'staff2@apartment.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 2. VEHICLE TYPES
      // =============================================
      console.log('🚗 Creating vehicle types...');
      
      await queryInterface.bulkInsert('LoaiXe', [
        {
          ten: 'Xe máy',
          phiThue: 150000.00,
          moTa: 'Phí gửi xe máy hàng tháng tại hầm để xe',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ten: 'Ô tô',
          phiThue: 800000.00,
          moTa: 'Phí gửi ô tô hàng tháng tại hầm để xe',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ten: 'Xe đạp điện',
          phiThue: 80000.00,
          moTa: 'Phí gửi xe đạp điện hàng tháng',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ten: 'Xe tải nhỏ',
          phiThue: 1200000.00,
          moTa: 'Phí gửi xe tải nhỏ (dưới 3.5 tấn)',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 3. FEE TYPES
      // =============================================
      console.log('💰 Creating fee types...');
      
      await queryInterface.bulkInsert('KhoanThu', [
        {
          tenkhoanthu: 'Phí quản lý chung cư',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: true,
          soTienToiThieu: 200000.00,
          ghichu: 'Phí quản lý chung cư, bảo trì hệ thống, vệ sinh công cộng',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenkhoanthu: 'Phí điện',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: true,
          soTienToiThieu: 100000.00,
          ghichu: 'Tiền điện hàng tháng theo số đếm',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenkhoanthu: 'Phí nước',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: true,
          soTienToiThieu: 80000.00,
          ghichu: 'Tiền nước hàng tháng theo số đếm',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenkhoanthu: 'Phí internet',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: false,
          soTienToiThieu: 300000.00,
          ghichu: 'Phí internet cáp quang tốc độ cao',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenkhoanthu: 'Phí bảo vệ',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: true,
          soTienToiThieu: 120000.00,
          ghichu: 'Phí dịch vụ bảo vệ 24/7',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenkhoanthu: 'Phí vệ sinh',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: true,
          soTienToiThieu: 50000.00,
          ghichu: 'Phí thu gom rác và vệ sinh khu vực chung',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenkhoanthu: 'Phí bảo trì thang máy',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: true,
          soTienToiThieu: 80000.00,
          ghichu: 'Phí bảo trì và vận hành thang máy',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenkhoanthu: 'Phí đóng góp',
          ngaytao: new Date('2025-01-01'),
          thoihan: new Date('2025-12-31'),
          batbuoc: false,
          soTienToiThieu: 50000.00,
          ghichu: 'Quỹ đóng góp cho các hoạt động cộng đồng',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 4. SAMPLE RESIDENTS
      // =============================================
      console.log('👥 Creating sample residents...');
      
      await queryInterface.bulkInsert('NhanKhau', [
        {
          hoTen: 'Nguyễn Văn An',
          ngaySinh: new Date('1980-03-15'),
          gioiTinh: 'Nam',
          danToc: 'Kinh',
          tonGiao: 'Phật giáo',
          cccd: '001234567890',
          ngayCap: new Date('2020-01-15'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - Hà Nội',
          ngheNghiep: 'Kỹ sư phần mềm',
          ghiChu: 'Chủ hộ gia đình',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoTen: 'Trần Thị Bình',
          ngaySinh: new Date('1985-07-22'),
          gioiTinh: 'Nữ',
          danToc: 'Kinh',
          tonGiao: 'Công giáo',
          cccd: '001234567891',
          ngayCap: new Date('2020-02-20'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - Hà Nội',
          ngheNghiep: 'Bác sĩ',
          ghiChu: 'Vợ chủ hộ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoTen: 'Lê Minh Cường',
          ngaySinh: new Date('1975-11-08'),
          gioiTinh: 'Nam',
          danToc: 'Kinh',
          tonGiao: 'Không',
          cccd: '001234567892',
          ngayCap: new Date('2020-03-10'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - TP.HCM',
          ngheNghiep: 'Doanh nhân',
          ghiChu: 'Chủ hộ độc thân',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoTen: 'Phạm Thị Diệu',
          ngaySinh: new Date('1990-05-14'),
          gioiTinh: 'Nữ',
          danToc: 'Kinh',
          tonGiao: 'Phật giáo',
          cccd: '001234567893',
          ngayCap: new Date('2020-04-25'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - Đà Nẵng',
          ngheNghiep: 'Giáo viên',
          ghiChu: 'Chủ hộ gia đình trẻ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoTen: 'Hoàng Văn Em',
          ngaySinh: new Date('1992-12-03'),
          gioiTinh: 'Nam',
          danToc: 'Kinh',
          tonGiao: 'Công giáo',
          cccd: '001234567894',
          ngayCap: new Date('2020-05-30'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - Hà Nội',
          ngheNghiep: 'Thiết kế đồ họa',
          ghiChu: 'Chồng chủ hộ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoTen: 'Vũ Thị Phương',
          ngaySinh: new Date('1988-09-18'),
          gioiTinh: 'Nữ',
          danToc: 'Kinh',
          tonGiao: 'Phật giáo',
          cccd: '001234567895',
          ngayCap: new Date('2020-06-15'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - Hải Phòng',
          ngheNghiep: 'Kế toán',
          ghiChu: 'Chủ hộ nữ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoTen: 'Đặng Minh Quang',
          ngaySinh: new Date('1983-01-25'),
          gioiTinh: 'Nam',
          danToc: 'Kinh',
          tonGiao: 'Không',
          cccd: '001234567896',
          ngayCap: new Date('2020-07-20'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - Cần Thơ',
          ngheNghiep: 'Luật sư',
          ghiChu: 'Chủ hộ chuyên nghiệp',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoTen: 'Ngô Thị Hoa',
          ngaySinh: new Date('1995-04-07'),
          gioiTinh: 'Nữ',
          danToc: 'Kinh',
          tonGiao: 'Công giáo',
          cccd: '001234567897',
          ngayCap: new Date('2020-08-12'),
          noiCap: 'Cục Cảnh sát QLHC về TTXH - Hà Nội',
          ngheNghiep: 'Marketing',
          ghiChu: 'Chủ hộ trẻ',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 5. HOUSEHOLDS
      // =============================================
      console.log('🏠 Creating households...');
      
      await queryInterface.bulkInsert('HoKhau', [
        {
          chuHo: 1,
          soNha: '101',
          duong: 'Lê Văn Lương',
          phuong: 'Nhân Chính',
          quan: 'Thanh Xuân',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date('2023-01-15'),
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          chuHo: 3,
          soNha: '102',
          duong: 'Lê Văn Lương',
          phuong: 'Nhân Chính',
          quan: 'Thanh Xuân',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date('2023-02-20'),
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          chuHo: 4,
          soNha: '201',
          duong: 'Lê Văn Lương',
          phuong: 'Nhân Chính',
          quan: 'Thanh Xuân',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date('2023-03-10'),
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          chuHo: 6,
          soNha: '202',
          duong: 'Lê Văn Lương',
          phuong: 'Nhân Chính',
          quan: 'Thanh Xuân',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date('2023-04-05'),
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          chuHo: 7,
          soNha: '301',
          duong: 'Lê Văn Lương',
          phuong: 'Nhân Chính',
          quan: 'Thanh Xuân',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date('2023-05-12'),
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          chuHo: 8,
          soNha: '302',
          duong: 'Lê Văn Lương',
          phuong: 'Nhân Chính',
          quan: 'Thanh Xuân',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date('2023-06-18'),
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // Update residents with household IDs
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 1 }, { id: 1 }, { transaction });
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 1 }, { id: 2 }, { transaction });
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 2 }, { id: 3 }, { transaction });
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 3 }, { id: 4 }, { transaction });
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 3 }, { id: 5 }, { transaction });
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 4 }, { id: 6 }, { transaction });
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 5 }, { id: 7 }, { transaction });
      await queryInterface.bulkUpdate('NhanKhau', { hoKhauId: 6 }, { id: 8 }, { transaction });

      // =============================================
      // 6. APARTMENTS AND ROOMS
      // =============================================
      console.log('🏢 Creating apartments and rooms...');
      
      await queryInterface.bulkInsert('Canho', [
        {
          soPhong: 101,
          hoKhauId: 1,
          dienTich: 75.5,
          soPhongNgu: 2,
          soPhongTam: 1,
          trangThai: 'OCCUPIED',
          giaThue: 12000000.00,
          moTa: 'Căn hộ 2 phòng ngủ view đẹp, có ban công',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 102,
          hoKhauId: 2,
          dienTich: 85.0,
          soPhongNgu: 3,
          soPhongTam: 2,
          trangThai: 'OCCUPIED',
          giaThue: 15000000.00,
          moTa: 'Căn hộ 3 phòng ngủ, phù hợp gia đình đông người',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 201,
          hoKhauId: 3,
          dienTich: 70.0,
          soPhongNgu: 2,
          soPhongTam: 1,
          trangThai: 'OCCUPIED',
          giaThue: 11500000.00,
          moTa: 'Căn hộ 2 phòng ngủ tầng 2, view sân vườn',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 202,
          hoKhauId: 4,
          dienTich: 80.0,
          soPhongNgu: 2,
          soPhongTam: 2,
          trangThai: 'OCCUPIED',
          giaThue: 13500000.00,
          moTa: 'Căn hộ 2 phòng ngủ, 2 WC, có phòng làm việc',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 301,
          hoKhauId: 5,
          dienTich: 95.0,
          soPhongNgu: 3,
          soPhongTam: 2,
          trangThai: 'OCCUPIED',
          giaThue: 18000000.00,
          moTa: 'Căn hộ penthouse 3 phòng ngủ, view toàn thành phố',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 302,
          hoKhauId: 6,
          dienTich: 65.0,
          soPhongNgu: 2,
          soPhongTam: 1,
          trangThai: 'OCCUPIED',
          giaThue: 10500000.00,
          moTa: 'Căn hộ 2 phòng ngủ compact, phù hợp gia đình nhỏ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 401,
          hoKhauId: null,
          dienTich: 90.0,
          soPhongNgu: 3,
          soPhongTam: 2,
          trangThai: 'AVAILABLE',
          giaThue: 16500000.00,
          moTa: 'Căn hộ 3 phòng ngủ tầng cao, sẵn sàng cho thuê',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 402,
          hoKhauId: null,
          dienTich: 75.0,
          soPhongNgu: 2,
          soPhongTam: 1,
          trangThai: 'MAINTENANCE',
          giaThue: 12500000.00,
          moTa: 'Căn hộ đang được bảo trì và sửa chữa',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      await queryInterface.bulkInsert('Rooms', [
        {
          soPhong: 'P001',
          loaiPhong: 'PARKING',
          dienTich: 15.0,
          tang: -1,
          trangThai: 'OCCUPIED',
          hoKhauId: 1,
          giaThue: 800000.00,
          ngayBatDauThue: new Date('2023-01-15'),
          moTa: 'Chỗ đậu xe ô tô tầng hầm',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 'P002',
          loaiPhong: 'PARKING',
          dienTich: 15.0,
          tang: -1,
          trangThai: 'OCCUPIED',
          hoKhauId: 2,
          giaThue: 800000.00,
          ngayBatDauThue: new Date('2023-02-20'),
          moTa: 'Chỗ đậu xe ô tô tầng hầm',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 'S001',
          loaiPhong: 'STORAGE',
          dienTich: 5.0,
          tang: -1,
          trangThai: 'AVAILABLE',
          giaThue: 200000.00,
          moTa: 'Kho lưu trữ đồ đạc',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          soPhong: 'C001',
          loaiPhong: 'COMMERCIAL',
          dienTich: 50.0,
          tang: 1,
          trangThai: 'AVAILABLE',
          giaThue: 8000000.00,
          moTa: 'Mặt bằng kinh doanh tầng 1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 7. HOUSEHOLD MEMBERS
      // =============================================
      console.log('👨‍👩‍👧‍👦 Creating household memberships...');
      
      await queryInterface.bulkInsert('ThanhVienHoKhau', [
        {
          nhanKhauId: 1,
          hoKhauId: 1,
          ngayThemNhanKhau: new Date('2023-01-15'),
          quanHeVoiChuHo: 'Chủ hộ',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nhanKhauId: 2,
          hoKhauId: 1,
          ngayThemNhanKhau: new Date('2023-01-15'),
          quanHeVoiChuHo: 'Vợ',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nhanKhauId: 3,
          hoKhauId: 2,
          ngayThemNhanKhau: new Date('2023-02-20'),
          quanHeVoiChuHo: 'Chủ hộ',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nhanKhauId: 4,
          hoKhauId: 3,
          ngayThemNhanKhau: new Date('2023-03-10'),
          quanHeVoiChuHo: 'Chủ hộ',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nhanKhauId: 5,
          hoKhauId: 3,
          ngayThemNhanKhau: new Date('2023-03-10'),
          quanHeVoiChuHo: 'Chồng',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nhanKhauId: 6,
          hoKhauId: 4,
          ngayThemNhanKhau: new Date('2023-04-05'),
          quanHeVoiChuHo: 'Chủ hộ',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nhanKhauId: 7,
          hoKhauId: 5,
          ngayThemNhanKhau: new Date('2023-05-12'),
          quanHeVoiChuHo: 'Chủ hộ',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nhanKhauId: 8,
          hoKhauId: 6,
          ngayThemNhanKhau: new Date('2023-06-18'),
          quanHeVoiChuHo: 'Chủ hộ',
          trangThai: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 8. VEHICLE REGISTRATIONS
      // =============================================
      console.log('🚗 Creating vehicle registrations...');
      
      await queryInterface.bulkInsert('QuanLyXe', [
        {
          hoKhauId: 1,
          loaiXeId: 2, // Ô tô
          bienSo: '30A-12345',
          hangXe: 'Toyota',
          mauXe: 'Vios',
          namSanXuat: 2020,
          ngayBatDau: new Date('2023-01-15'),
          trangThai: 'Đang sử dụng',
          ghiChu: 'Xe gia đình màu trắng',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoKhauId: 1,
          loaiXeId: 1, // Xe máy
          bienSo: '30B1-567.89',
          hangXe: 'Honda',
          mauXe: 'SH',
          namSanXuat: 2022,
          ngayBatDau: new Date('2023-01-15'),
          trangThai: 'Đang sử dụng',
          ghiChu: 'Xe máy của vợ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoKhauId: 2,
          loaiXeId: 2, // Ô tô
          bienSo: '30A-67890',
          hangXe: 'Mazda',
          mauXe: 'CX-5',
          namSanXuat: 2021,
          ngayBatDau: new Date('2023-02-20'),
          trangThai: 'Đang sử dụng',
          ghiChu: 'SUV 7 chỗ màu đen',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoKhauId: 3,
          loaiXeId: 1, // Xe máy
          bienSo: '30B1-111.22',
          hangXe: 'Yamaha',
          mauXe: 'Exciter',
          namSanXuat: 2021,
          ngayBatDau: new Date('2023-03-10'),
          trangThai: 'Đang sử dụng',
          ghiChu: 'Xe máy thể thao',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hoKhauId: 4,
          loaiXeId: 3, // Xe đạp điện
          bienSo: '30C-999.88',
          hangXe: 'VinFast',
          mauXe: 'Klara',
          namSanXuat: 2023,
          ngayBatDau: new Date('2023-04-05'),
          trangThai: 'Đang sử dụng',
          ghiChu: 'Xe đạp điện thông minh',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 9. COLLECTION PERIODS
      // =============================================
      console.log('📅 Creating collection periods...');
      
      await queryInterface.bulkInsert('DotThu', [
        {
          tenDotThu: 'Thu phí quý I/2025',
          ngayTao: new Date('2025-01-01'),
          thoiHan: new Date('2025-03-31'),
          trangThai: 'CLOSED',
          moTa: 'Đợt thu phí quý đầu năm 2025',
          tongSoTien: 45000000.00,
          soHoKhauThamGia: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenDotThu: 'Thu phí quý II/2025',
          ngayTao: new Date('2025-04-01'),
          thoiHan: new Date('2025-06-30'),
          trangThai: 'ACTIVE',
          moTa: 'Đợt thu phí quý II năm 2025',
          tongSoTien: 52000000.00,
          soHoKhauThamGia: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenDotThu: 'Thu phí tháng 7/2025',
          ngayTao: new Date('2025-07-01'),
          thoiHan: new Date('2025-07-31'),
          trangThai: 'DRAFT',
          moTa: 'Đợt thu phí tháng 7/2025',
          tongSoTien: 0,
          soHoKhauThamGia: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // =============================================
      // 10. COLLECTION PERIOD - FEE TYPE ASSOCIATIONS
      // =============================================
      console.log('🔗 Creating collection period associations...');
      
      // Quý I/2025 - All mandatory fees
      await queryInterface.bulkInsert('DotThu_KhoanThu', [
        { dotThuId: 1, khoanThuId: 1, soTien: 600000.00, createdAt: new Date(), updatedAt: new Date() }, // Quản lý
        { dotThuId: 1, khoanThuId: 2, soTien: 450000.00, createdAt: new Date(), updatedAt: new Date() }, // Điện
        { dotThuId: 1, khoanThuId: 3, soTien: 300000.00, createdAt: new Date(), updatedAt: new Date() }, // Nước
        { dotThuId: 1, khoanThuId: 5, soTien: 360000.00, createdAt: new Date(), updatedAt: new Date() }, // Bảo vệ
        { dotThuId: 1, khoanThuId: 6, soTien: 150000.00, createdAt: new Date(), updatedAt: new Date() }, // Vệ sinh
        { dotThuId: 1, khoanThuId: 7, soTien: 240000.00, createdAt: new Date(), updatedAt: new Date() }, // Thang máy
        
        // Quý II/2025 - All fees including optional
        { dotThuId: 2, khoanThuId: 1, soTien: 600000.00, createdAt: new Date(), updatedAt: new Date() }, // Quản lý
        { dotThuId: 2, khoanThuId: 2, soTien: 500000.00, createdAt: new Date(), updatedAt: new Date() }, // Điện
        { dotThuId: 2, khoanThuId: 3, soTien: 350000.00, createdAt: new Date(), updatedAt: new Date() }, // Nước
        { dotThuId: 2, khoanThuId: 4, soTien: 900000.00, createdAt: new Date(), updatedAt: new Date() }, // Internet
        { dotThuId: 2, khoanThuId: 5, soTien: 360000.00, createdAt: new Date(), updatedAt: new Date() }, // Bảo vệ
        { dotThuId: 2, khoanThuId: 6, soTien: 150000.00, createdAt: new Date(), updatedAt: new Date() }, // Vệ sinh
        { dotThuId: 2, khoanThuId: 7, soTien: 240000.00, createdAt: new Date(), updatedAt: new Date() }, // Thang máy
        { dotThuId: 2, khoanThuId: 8, soTien: 100000.00, createdAt: new Date(), updatedAt: new Date() }  // Đóng góp
      ], { transaction });

      // =============================================
      // 11. HOUSEHOLD FEES
      // =============================================
      console.log('💳 Creating household fees...');
      
      // Generate household fees for each household and collection period
      const householdFees = [];
      const households = [1, 2, 3, 4, 5, 6];
      
      // Quý I/2025 fees
      for (const hoKhauId of households) {
        householdFees.push(
          {
            hoKhauId,
            dotThuId: 1,
            khoanThuId: 1,
            soTien: 600000.00,
            trangThai: 'PAID',
            ngayTao: new Date('2025-01-01'),
            ngayDaoHan: new Date('2025-03-31'),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            hoKhauId,
            dotThuId: 1,
            khoanThuId: 2,
            soTien: 450000.00,
            trangThai: hoKhauId <= 4 ? 'PAID' : 'PENDING',
            ngayTao: new Date('2025-01-01'),
            ngayDaoHan: new Date('2025-03-31'),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            hoKhauId,
            dotThuId: 1,
            khoanThuId: 3,
            soTien: 300000.00,
            trangThai: hoKhauId <= 3 ? 'PAID' : 'OVERDUE',
            ngayTao: new Date('2025-01-01'),
            ngayDaoHan: new Date('2025-03-31'),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        );
      }
      
      // Quý II/2025 fees
      for (const hoKhauId of households) {
        householdFees.push(
          {
            hoKhauId,
            dotThuId: 2,
            khoanThuId: 1,
            soTien: 600000.00,
            trangThai: hoKhauId <= 2 ? 'PAID' : 'PENDING',
            ngayTao: new Date('2025-04-01'),
            ngayDaoHan: new Date('2025-06-30'),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            hoKhauId,
            dotThuId: 2,
            khoanThuId: 2,
            soTien: 500000.00,
            trangThai: 'PENDING',
            ngayTao: new Date('2025-04-01'),
            ngayDaoHan: new Date('2025-06-30'),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        );
      }
      
      await queryInterface.bulkInsert('HouseholdFees', householdFees, { transaction });

      // =============================================
      // 12. PAYMENT RECORDS
      // =============================================
      console.log('💰 Creating payment records...');
      
      await queryInterface.bulkInsert('NopPhi', [
        {
          hokhau_id: 1,
          khoanthu_id: 1,
          sotien: 600000.00,
          ngaynop: new Date('2025-01-15'),
          nguoinop: 'Nguyễn Văn An',
          phuongthuc: 'BANK_TRANSFER',
          ghichu: 'Thanh toán phí quản lý quý I',
          status: 'CONFIRMED',
          nguoiXacNhan: 'Kế toán Minh',
          ngayXacNhan: new Date('2025-01-15'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hokhau_id: 1,
          khoanthu_id: 2,
          sotien: 450000.00,
          ngaynop: new Date('2025-02-10'),
          nguoinop: 'Trần Thị Bình',
          phuongthuc: 'ONLINE',
          ghichu: 'Tiền điện tháng 1-3',
          status: 'CONFIRMED',
          nguoiXacNhan: 'Kế toán Minh',
          ngayXacNhan: new Date('2025-02-10'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hokhau_id: 2,
          khoanthu_id: 1,
          sotien: 600000.00,
          ngaynop: new Date('2025-01-20'),
          nguoinop: 'Lê Minh Cường',
          phuongthuc: 'CASH',
          ghichu: 'Nộp trực tiếp tại văn phòng',
          status: 'CONFIRMED',
          nguoiXacNhan: 'Thu ngân Lan',
          ngayXacNhan: new Date('2025-01-20'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hokhau_id: 3,
          khoanthu_id: 1,
          sotien: 600000.00,
          ngaynop: new Date('2025-04-05'),
          nguoinop: 'Phạm Thị Diệu',
          phuongthuc: 'BANK_TRANSFER',
          ghichu: 'Phí quản lý quý II',
          status: 'CONFIRMED',
          nguoiXacNhan: 'Kế toán Minh',
          ngayXacNhan: new Date('2025-04-05'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          hokhau_id: 4,
          khoanthu_id: 1,
          sotien: 600000.00,
          ngaynop: new Date('2025-04-12'),
          nguoinop: 'Vũ Thị Phương',
          phuongthuc: 'ONLINE',
          ghichu: 'Thanh toán qua ví điện tử',
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      console.log('✅ Data seeding completed successfully!');
      
      // Summary
      console.log('\n📊 SEEDING SUMMARY:');
      console.log('• 5 System Users (admin, manager, accountant, 2 staff)');
      console.log('• 4 Vehicle Types');
      console.log('• 8 Fee Types');
      console.log('• 8 Residents');
      console.log('• 6 Households');
      console.log('• 8 Apartments + 4 Additional Rooms');
      console.log('• 8 Household Memberships');
      console.log('• 5 Vehicle Registrations');
      console.log('• 3 Collection Periods');
      console.log('• 14 Fee Type Associations');
      console.log('• 24 Household Fees');
      console.log('• 5 Payment Records');
      
      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error seeding data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🗑️ Removing seeded data...');

      // Delete in reverse order to maintain referential integrity
      await queryInterface.bulkDelete('NopPhi', null, { transaction });
      await queryInterface.bulkDelete('HouseholdFees', null, { transaction });
      await queryInterface.bulkDelete('DotThu_KhoanThu', null, { transaction });
      await queryInterface.bulkDelete('DotThu', null, { transaction });
      await queryInterface.bulkDelete('QuanLyXe', null, { transaction });
      await queryInterface.bulkDelete('ThanhVienHoKhau', null, { transaction });
      await queryInterface.bulkDelete('Rooms', null, { transaction });
      await queryInterface.bulkDelete('Canho', null, { transaction });
      await queryInterface.bulkDelete('HoKhau', null, { transaction });
      await queryInterface.bulkDelete('NhanKhau', null, { transaction });
      await queryInterface.bulkDelete('KhoanThu', null, { transaction });
      await queryInterface.bulkDelete('LoaiXe', null, { transaction });
      await queryInterface.bulkDelete('Users', null, { transaction });

      await transaction.commit();
      console.log('✅ Seeded data removed successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error removing seeded data:', error);
      throw error;
    }
  }
};
