const db = require('./db/models');

async function clearAndSeedRealData() {
  try {
    console.log('🗑️ Clearing existing data...');
    
    // Delete in correct order (respect foreign keys)
    await db.ThanhToan.destroy({ where: {} });
    await db.NopPhi.destroy({ where: {} });
    await db.DotThu_KhoanThu.destroy({ where: {} });
    await db.QuanLyXe.destroy({ where: {} });
    await db.ThanhVienHoKhau.destroy({ where: {} });
    await db.DotThu.destroy({ where: {} });
    await db.KhoanThu.destroy({ where: {} });
    await db.HoKhau.destroy({ where: {} });
    await db.NhanKhau.destroy({ where: {} });
    await db.Canho.destroy({ where: {} });
    await db.LoaiXe.destroy({ where: {} });
    
    console.log('✅ Data cleared successfully');
    
    console.log('🌱 Creating real seed data...');
    
    // 1. Create real LoaiXe (Vehicle Types)
    const vehicleTypes = await db.LoaiXe.bulkCreate([
      {
        ten: 'Xe máy',
        phiThue: 100000,
        moTa: 'Phí gửi xe máy hàng tháng'
      },
      {
        ten: 'Ô tô',
        phiThue: 1200000,
        moTa: 'Phí gửi ô tô hàng tháng'
      },
      {
        ten: 'Xe đạp điện',
        phiThue: 50000,
        moTa: 'Phí gửi xe đạp điện hàng tháng'
      }
    ]);
    console.log('✅ Created vehicle types');

    // 2. Create real Canho (Apartments)
    const apartments = await db.Canho.bulkCreate([
      { soPhong: 101, dienTich: 75.5, hoKhauId: null },
      { soPhong: 102, dienTich: 85.2, hoKhauId: null },
      { soPhong: 103, dienTich: 95.8, hoKhauId: null },
      { soPhong: 201, dienTich: 75.5, hoKhauId: null },
      { soPhong: 202, dienTich: 85.2, hoKhauId: null },
      { soPhong: 203, dienTich: 95.8, hoKhauId: null },
      { soPhong: 301, dienTich: 75.5, hoKhauId: null },
      { soPhong: 302, dienTich: 85.2, hoKhauId: null },
      { soPhong: 303, dienTich: 95.8, hoKhauId: null },
      { soPhong: 401, dienTich: 120.5, hoKhauId: null }, // Penthouse
    ]);
    console.log('✅ Created apartments');

    // 3. Create real NhanKhau (Residents)
    const residents = await db.NhanKhau.bulkCreate([
      {
        hoTen: 'Nguyễn Văn An',
        ngaySinh: new Date('1980-05-15'),
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: '001234567890',
        ngayCap: new Date('2020-01-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Kỹ sư phần mềm',
        ghiChu: null
      },
      {
        hoTen: 'Trần Thị Bình',
        ngaySinh: new Date('1985-03-20'),
        gioiTinh: 'Nữ',
        danToc: 'Kinh',
        tonGiao: 'Phật giáo',
        cccd: '002345678901',
        ngayCap: new Date('2020-02-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Bác sĩ',
        ghiChu: null
      },
      {
        hoTen: 'Lê Minh Cường',
        ngaySinh: new Date('1978-11-10'),
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: '003456789012',
        ngayCap: new Date('2020-03-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Giáo viên',
        ghiChu: null
      },
      {
        hoTen: 'Phạm Thị Diệu',
        ngaySinh: new Date('1990-07-25'),
        gioiTinh: 'Nữ',
        danToc: 'Kinh',
        tonGiao: 'Công giáo',
        cccd: '004567890123',
        ngayCap: new Date('2020-04-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Kế toán',
        ghiChu: null
      },
      {
        hoTen: 'Hoàng Văn Em',
        ngaySinh: new Date('1982-12-08'),
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        tonGiao: 'Không',
        cccd: '005678901234',
        ngayCap: new Date('2020-05-01'),
        noiCap: 'CA Hà Nội',
        ngheNghiep: 'Kinh doanh',
        ghiChu: null
      }
    ]);
    console.log('✅ Created residents');

    // 4. Create real HoKhau (Households)
    const households = await db.HoKhau.bulkCreate([
      {
        chuHo: residents[0].id,
        soNha: '101',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-01-01')
      },
      {
        chuHo: residents[1].id,
        soNha: '102',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-02-01')
      },
      {
        chuHo: residents[2].id,
        soNha: '103',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-03-01')
      },
      {
        chuHo: residents[3].id,
        soNha: '201',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-04-01')
      },
      {
        chuHo: residents[4].id,
        soNha: '202',
        duong: 'Lê Văn Lương',
        phuong: 'Nhân Chính',
        quan: 'Thanh Xuân',
        thanhPho: 'Hà Nội',
        ngayLamHoKhau: new Date('2023-05-01')
      }
    ]);
    console.log('✅ Created households');

    // Update apartments with household IDs
    await apartments[0].update({ hoKhauId: households[0].id });
    await apartments[1].update({ hoKhauId: households[1].id });
    await apartments[2].update({ hoKhauId: households[2].id });
    await apartments[3].update({ hoKhauId: households[3].id });
    await apartments[4].update({ hoKhauId: households[4].id });
    console.log('✅ Updated apartment-household relationships');

    // 5. Create real KhoanThu (Fee Types)
    const feeTypes = await db.KhoanThu.bulkCreate([
      {
        tenkhoanthu: 'Phí quản lý chung cư',
        ngaytao: new Date(),
        thoihan: new Date('2025-12-31'),
        batbuoc: true,
        ghichu: 'Phí quản lý chung cư hàng tháng theo diện tích'
      },
      {
        tenkhoanthu: 'Phí gửi xe',
        ngaytao: new Date(),
        thoihan: new Date('2025-12-31'),
        batbuoc: true,
        ghichu: 'Phí gửi xe máy và ô tô hàng tháng'
      },
      {
        tenkhoanthu: 'Phí điện',
        ngaytao: new Date(),
        thoihan: new Date('2025-12-31'),
        batbuoc: true,
        ghichu: 'Tiền điện hàng tháng theo số đo công tơ'
      },
      {
        tenkhoanthu: 'Phí nước',
        ngaytao: new Date(),
        thoihan: new Date('2025-12-31'),
        batbuoc: true,
        ghichu: 'Tiền nước hàng tháng theo số đo đồng hồ'
      },
      {
        tenkhoanthu: 'Phí internet',
        ngaytao: new Date(),
        thoihan: new Date('2025-12-31'),
        batbuoc: false,
        ghichu: 'Phí internet chung của tòa nhà'
      },
      {
        tenkhoanthu: 'Phí bảo vệ',
        ngaytao: new Date(),
        thoihan: new Date('2025-12-31'),
        batbuoc: true,
        ghichu: 'Phí dịch vụ bảo vệ 24/7'
      }
    ]);
    console.log('✅ Created fee types');

    // 6. Create real DotThu (Collection Periods)
    const collectionPeriods = await db.DotThu.bulkCreate([
      {
        tenDotThu: 'Thu phí tháng 6/2025',
        ngayTao: new Date('2025-06-01'),
        thoiHan: new Date('2025-06-30')
      },
      {
        tenDotThu: 'Thu phí tháng 7/2025',
        ngayTao: new Date('2025-07-01'),
        thoiHan: new Date('2025-07-31')
      }
    ]);
    console.log('✅ Created collection periods');

    // 7. Create DotThu_KhoanThu relationships
    const periodFeeRelations = [];
    
    // Tháng 6 - Tất cả các khoản thu
    for (let i = 0; i < feeTypes.length; i++) {
      periodFeeRelations.push({
        dotThuId: collectionPeriods[0].id,
        khoanThuId: feeTypes[i].id,
        soTien: i === 0 ? 50000 : i === 1 ? 100000 : i === 5 ? 200000 : 0 // Phí cố định cho một số khoản
      });
    }
    
    // Tháng 7 - Chỉ các khoản thu chính
    for (let i = 0; i < 4; i++) {
      periodFeeRelations.push({
        dotThuId: collectionPeriods[1].id,
        khoanThuId: feeTypes[i].id,
        soTien: i === 0 ? 50000 : i === 1 ? 100000 : 0
      });
    }
    
    await db.DotThu_KhoanThu.bulkCreate(periodFeeRelations);
    console.log('✅ Created period-fee relationships');

    // 8. Create household members
    await db.ThanhVienHoKhau.bulkCreate([
      {
        nhanKhauId: residents[0].id,
        hoKhauId: households[0].id,
        ngayThemNhanKhau: new Date('2023-01-01'),
        quanHeVoiChuHo: 'chủ hộ'
      },
      {
        nhanKhauId: residents[1].id,
        hoKhauId: households[1].id,
        ngayThemNhanKhau: new Date('2023-02-01'),
        quanHeVoiChuHo: 'chủ hộ'
      },
      {
        nhanKhauId: residents[2].id,
        hoKhauId: households[2].id,
        ngayThemNhanKhau: new Date('2023-03-01'),
        quanHeVoiChuHo: 'chủ hộ'
      },
      {
        nhanKhauId: residents[3].id,
        hoKhauId: households[3].id,
        ngayThemNhanKhau: new Date('2023-04-01'),
        quanHeVoiChuHo: 'chủ hộ'
      },
      {
        nhanKhauId: residents[4].id,
        hoKhauId: households[4].id,
        ngayThemNhanKhau: new Date('2023-05-01'),
        quanHeVoiChuHo: 'chủ hộ'
      }
    ]);
    console.log('✅ Created household members');

    // 9. Create vehicle registrations
    await db.QuanLyXe.bulkCreate([
      {
        hoKhauId: households[0].id,
        loaiXeId: vehicleTypes[0].id, // Xe máy
        bienSo: '29B1-12345',
        ngayBatDau: new Date('2023-01-15'),
        ngayKetThuc: null,
        trangThai: 'Đang sử dụng'
      },
      {
        hoKhauId: households[1].id,
        loaiXeId: vehicleTypes[0].id, // Xe máy
        bienSo: '29B1-23456',
        ngayBatDau: new Date('2023-02-15'),
        ngayKetThuc: null,
        trangThai: 'Đang sử dụng'
      },
      {
        hoKhauId: households[1].id,
        loaiXeId: vehicleTypes[1].id, // Ô tô
        bienSo: '29A-34567',
        ngayBatDau: new Date('2023-03-01'),
        ngayKetThuc: null,
        trangThai: 'Đang sử dụng'
      },
      {
        hoKhauId: households[2].id,
        loaiXeId: vehicleTypes[0].id, // Xe máy
        bienSo: '29B1-45678',
        ngayBatDau: new Date('2023-03-15'),
        ngayKetThuc: null,
        trangThai: 'Đang sử dụng'
      },
      {
        hoKhauId: households[4].id,
        loaiXeId: vehicleTypes[1].id, // Ô tô
        bienSo: '29A-56789',
        ngayBatDau: new Date('2023-05-15'),
        ngayKetThuc: null,
        trangThai: 'Đang sử dụng'
      }
    ]);
    console.log('✅ Created vehicle registrations');

    // 10. Create some payment records
    await db.NopPhi.bulkCreate([
      {
        hokhau_id: households[0].id,
        khoanthu_id: feeTypes[0].id, // Phí quản lý
        sotien: 377500, // 50000 * 75.5m2 / 10 (giả sử tính theo diện tích)
        ngaynop: new Date('2025-06-05'),
        nguoinop: 'Nguyễn Văn An',
        phuongthuc: 'BANK_TRANSFER',
        ghichu: 'Nộp phí quản lý tháng 6',
        status: 'ACTIVE'
      },
      {
        hokhau_id: households[0].id,
        khoanthu_id: feeTypes[1].id, // Phí gửi xe
        sotien: 100000, // 1 xe máy
        ngaynop: new Date('2025-06-05'),
        nguoinop: 'Nguyễn Văn An',
        phuongthuc: 'BANK_TRANSFER',
        ghichu: 'Nộp phí gửi xe tháng 6',
        status: 'ACTIVE'
      },
      {
        hokhau_id: households[1].id,
        khoanthu_id: feeTypes[0].id, // Phí quản lý
        sotien: 426000, // 50000 * 85.2m2 / 10
        ngaynop: new Date('2025-06-03'),
        nguoinop: 'Trần Thị Bình',
        phuongthuc: 'CASH',
        ghichu: 'Nộp phí quản lý tháng 6',
        status: 'ACTIVE'
      },
      {
        hokhau_id: households[1].id,
        khoanthu_id: feeTypes[1].id, // Phí gửi xe
        sotien: 1300000, // 1 xe máy + 1 ô tô
        ngaynop: new Date('2025-06-03'),
        nguoinop: 'Trần Thị Bình',
        phuongthuc: 'CASH',
        ghichu: 'Nộp phí gửi xe tháng 6',
        status: 'ACTIVE'
      }
    ]);
    console.log('✅ Created payment records');

    console.log('🎉 Real seed data created successfully!');
    console.log('📊 Summary:');
    console.log(`  - ${vehicleTypes.length} vehicle types`);
    console.log(`  - ${apartments.length} apartments`);
    console.log(`  - ${residents.length} residents`);
    console.log(`  - ${households.length} households`);
    console.log(`  - ${feeTypes.length} fee types`);
    console.log(`  - ${collectionPeriods.length} collection periods`);
    console.log(`  - ${periodFeeRelations.length} period-fee relationships`);
    console.log(`  - 5 vehicle registrations`);
    console.log(`  - 4 payment records`);

  } catch (error) {
    console.error('❌ Error creating seed data:', error);
  }
}

// Run the seeding
clearAndSeedRealData()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
