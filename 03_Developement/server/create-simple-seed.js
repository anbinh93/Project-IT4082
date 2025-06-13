const { Client } = require('pg');

async function createRealSeedData() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'department_management',
    user: 'postgres',
    password: '123456'
  });

  try {
    await client.connect();
    console.log('🔌 Connected to PostgreSQL');

    // 1. Create Vehicle Types
    console.log('🚗 Creating vehicle types...');
    await client.query(`
      INSERT INTO "LoaiXe" (ten, "phiThue", "moTa", "createdAt", "updatedAt") VALUES
      ('Xe máy', 100000, 'Phí gửi xe máy hàng tháng', NOW(), NOW()),
      ('Ô tô', 1200000, 'Phí gửi ô tô hàng tháng', NOW(), NOW()),
      ('Xe đạp điện', 50000, 'Phí gửi xe đạp điện hàng tháng', NOW(), NOW())
    `);

    // 2. Create Residents
    console.log('👥 Creating residents...');
    await client.query(`
      INSERT INTO "NhanKhau" ("hoTen", "ngaySinh", "gioiTinh", "danToc", "tonGiao", "cccd", "ngayCap", "noiCap", "ngheNghiep", "ghiChu", "createdAt", "updatedAt") VALUES
      ('Nguyễn Văn An', '1980-05-15', 'Nam', 'Kinh', 'Không', '001234567890', '2020-01-01', 'CA Hà Nội', 'Kỹ sư phần mềm', NULL, NOW(), NOW()),
      ('Trần Thị Bình', '1985-03-20', 'Nữ', 'Kinh', 'Phật giáo', '002345678901', '2020-02-01', 'CA Hà Nội', 'Bác sĩ', NULL, NOW(), NOW()),
      ('Lê Minh Cường', '1978-11-10', 'Nam', 'Kinh', 'Không', '003456789012', '2020-03-01', 'CA Hà Nội', 'Giáo viên', NULL, NOW(), NOW()),
      ('Phạm Thị Diệu', '1990-07-25', 'Nữ', 'Kinh', 'Công giáo', '004567890123', '2020-04-01', 'CA Hà Nội', 'Kế toán', NULL, NOW(), NOW()),
      ('Hoàng Văn Em', '1982-12-08', 'Nam', 'Kinh', 'Không', '005678901234', '2020-05-01', 'CA Hà Nội', 'Kinh doanh', NULL, NOW(), NOW())
    `);

    // 3. Create Households
    console.log('🏠 Creating households...');
    await client.query(`
      INSERT INTO "HoKhau" ("chuHo", "soNha", "duong", "phuong", "quan", "thanhPho", "ngayLamHoKhau", "createdAt", "updatedAt") VALUES
      (1, '101', 'Lê Văn Lương', 'Nhân Chính', 'Thanh Xuân', 'Hà Nội', '2023-01-01', NOW(), NOW()),
      (2, '102', 'Lê Văn Lương', 'Nhân Chính', 'Thanh Xuân', 'Hà Nội', '2023-02-01', NOW(), NOW()),
      (3, '103', 'Lê Văn Lương', 'Nhân Chính', 'Thanh Xuân', 'Hà Nội', '2023-03-01', NOW(), NOW()),
      (4, '201', 'Lê Văn Lương', 'Nhân Chính', 'Thanh Xuân', 'Hà Nội', '2023-04-01', NOW(), NOW()),
      (5, '202', 'Lê Văn Lương', 'Nhân Chính', 'Thanh Xuân', 'Hà Nội', '2023-05-01', NOW(), NOW())
    `);

    // 4. Create Apartments
    console.log('🏢 Creating apartments...');
    await client.query(`
      INSERT INTO "Canho" ("soPhong", "dienTich", "hoKhauId", "createdAt", "updatedAt") VALUES
      (101, 75.5, 1, NOW(), NOW()),
      (102, 85.2, 2, NOW(), NOW()),
      (103, 95.8, 3, NOW(), NOW()),
      (201, 75.5, 4, NOW(), NOW()),
      (202, 85.2, 5, NOW(), NOW()),
      (203, 95.8, NULL, NOW(), NOW()),
      (301, 75.5, NULL, NOW(), NOW()),
      (302, 85.2, NULL, NOW(), NOW()),
      (303, 95.8, NULL, NOW(), NOW()),
      (401, 120.5, NULL, NOW(), NOW())
    `);

    // 5. Create Fee Types (KhoanThu)
    console.log('💰 Creating fee types...');
    await client.query(`
      INSERT INTO "KhoanThu" ("tenkhoanthu", "ngaytao", "thoihan", "batbuoc", "ghichu", "createdAt", "updatedAt") VALUES
      ('Phí quản lý chung cư', NOW(), '2025-12-31', true, 'Phí quản lý chung cư hàng tháng theo diện tích', NOW(), NOW()),
      ('Phí gửi xe', NOW(), '2025-12-31', true, 'Phí gửi xe máy và ô tô hàng tháng', NOW(), NOW()),
      ('Phí điện', NOW(), '2025-12-31', true, 'Tiền điện hàng tháng theo số đo công tơ', NOW(), NOW()),
      ('Phí nước', NOW(), '2025-12-31', true, 'Tiền nước hàng tháng theo số đo đồng hồ', NOW(), NOW()),
      ('Phí internet', NOW(), '2025-12-31', false, 'Phí internet chung của tòa nhà', NOW(), NOW()),
      ('Phí bảo vệ', NOW(), '2025-12-31', true, 'Phí dịch vụ bảo vệ 24/7', NOW(), NOW())
    `);

    // 6. Create Collection Periods (DotThu)
    console.log('📅 Creating collection periods...');
    await client.query(`
      INSERT INTO "DotThu" ("tenDotThu", "ngayTao", "thoiHan", "createdAt", "updatedAt") VALUES
      ('Thu phí tháng 6/2025', '2025-06-01', '2025-06-30', NOW(), NOW()),
      ('Thu phí tháng 7/2025', '2025-07-01', '2025-07-31', NOW(), NOW())
    `);

    // 7. Create Period-Fee relationships
    console.log('🔗 Creating period-fee relationships...');
    await client.query(`
      INSERT INTO "DotThu_KhoanThu" ("dotThuId", "khoanThuId", "soTien", "createdAt", "updatedAt") VALUES
      (1, 1, 50000, NOW(), NOW()),
      (1, 2, 100000, NOW(), NOW()),
      (1, 3, 0, NOW(), NOW()),
      (1, 4, 0, NOW(), NOW()),
      (1, 5, 150000, NOW(), NOW()),
      (1, 6, 200000, NOW(), NOW()),
      (2, 1, 50000, NOW(), NOW()),
      (2, 2, 100000, NOW(), NOW()),
      (2, 3, 0, NOW(), NOW()),
      (2, 4, 0, NOW(), NOW())
    `);

    // 8. Create household members
    console.log('👨‍👩‍👧‍👦 Creating household members...');
    await client.query(`
      INSERT INTO "ThanhVienHoKhau" ("nhanKhauId", "hoKhauId", "ngayThemNhanKhau", "quanHeVoiChuHo", "createdAt", "updatedAt") VALUES
      (1, 1, '2023-01-01', 'chủ hộ', NOW(), NOW()),
      (2, 2, '2023-02-01', 'chủ hộ', NOW(), NOW()),
      (3, 3, '2023-03-01', 'chủ hộ', NOW(), NOW()),
      (4, 4, '2023-04-01', 'chủ hộ', NOW(), NOW()),
      (5, 5, '2023-05-01', 'chủ hộ', NOW(), NOW())
    `);

    // 9. Create vehicle registrations
    console.log('🚗 Creating vehicle registrations...');
    await client.query(`
      INSERT INTO "QuanLyXe" ("hoKhauId", "loaiXeId", "bienSo", "ngayBatDau", "ngayKetThuc", "trangThai", "createdAt", "updatedAt") VALUES
      (1, 1, '29B1-12345', '2023-01-15', NULL, 'Đang sử dụng', NOW(), NOW()),
      (2, 1, '29B1-23456', '2023-02-15', NULL, 'Đang sử dụng', NOW(), NOW()),
      (2, 2, '29A-34567', '2023-03-01', NULL, 'Đang sử dụng', NOW(), NOW()),
      (3, 1, '29B1-45678', '2023-03-15', NULL, 'Đang sử dụng', NOW(), NOW()),
      (5, 2, '29A-56789', '2023-05-15', NULL, 'Đang sử dụng', NOW(), NOW())
    `);

    // 10. Create some payment records
    console.log('💳 Creating payment records...');
    await client.query(`
      INSERT INTO "NopPhi" ("hokhau_id", "khoanthu_id", "sotien", "ngaynop", "nguoinop", "phuongthuc", "ghichu", "status", "createdAt", "updatedAt") VALUES
      (1, 1, 377500, '2025-06-05', 'Nguyễn Văn An', 'BANK_TRANSFER', 'Nộp phí quản lý tháng 6', 'ACTIVE', NOW(), NOW()),
      (1, 2, 100000, '2025-06-05', 'Nguyễn Văn An', 'BANK_TRANSFER', 'Nộp phí gửi xe tháng 6', 'ACTIVE', NOW(), NOW()),
      (2, 1, 426000, '2025-06-03', 'Trần Thị Bình', 'CASH', 'Nộp phí quản lý tháng 6', 'ACTIVE', NOW(), NOW()),
      (2, 2, 1300000, '2025-06-03', 'Trần Thị Bình', 'CASH', 'Nộp phí gửi xe tháng 6', 'ACTIVE', NOW(), NOW()),
      (3, 6, 200000, '2025-06-02', 'Lê Minh Cường', 'ONLINE', 'Nộp phí bảo vệ tháng 6', 'ACTIVE', NOW(), NOW())
    `);

    console.log('🎉 Real seed data created successfully!');
    console.log('📊 Summary:');
    console.log('  - 3 vehicle types');
    console.log('  - 10 apartments');
    console.log('  - 5 residents');
    console.log('  - 5 households');
    console.log('  - 6 fee types');
    console.log('  - 2 collection periods');
    console.log('  - 10 period-fee relationships');
    console.log('  - 5 household members');
    console.log('  - 5 vehicle registrations');
    console.log('  - 5 payment records');

  } catch (error) {
    console.error('❌ Error creating seed data:', error);
  } finally {
    await client.end();
  }
}

createRealSeedData();
