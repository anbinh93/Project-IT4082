const db = require('./db/models');

async function createFeeSystemSeed() {
  try {
    console.log('🚀 Creating comprehensive fee system seed data...');
    
    // Step 1: Create more realistic apartment data (if needed)
    const currentApartments = await db.Canho.count();
    console.log(`📊 Current apartments: ${currentApartments}`);
    
    if (currentApartments < 15) {
      console.log('📝 Creating additional apartments...');
      
      const names = [
        'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu', 'Phạm Hồng Dung',
        'Hoàng Quang Em', 'Vũ Ngọc Giang', 'Võ Thanh Hạnh', 'Đặng Tuấn Khánh',
        'Bùi Thành Linh', 'Đỗ Hải Minh', 'Hồ Văn Nam', 'Ngô Thị Oanh',
        'Dương Minh Phong', 'Lý Hồng Quý', 'Phan Ngọc Sơn'
      ];
      
      const apartments = [
        '101', '102', '103', '201', '202', '203', '301', '302', '303',
        '401', '402', '403', '501', '502', '503'
      ];
      
      for (let i = 0; i < Math.min(apartments.length, names.length); i++) {
        // Check if apartment exists
        const existing = await db.Canho.findOne({ where: { soPhong: apartments[i] } });
        if (existing) continue;
        
        // Create resident
        const uniqueCccd = `${Date.now()}${Math.random().toString().substr(2, 4)}${i}`.substring(0, 12);
        const resident = await db.NhanKhau.create({
          hoTen: names[i],
          ngaySinh: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gioiTinh: Math.random() > 0.5 ? 'Nam' : 'Nữ',
          danToc: 'Kinh',
          tonGiao: 'Không',
          cccd: uniqueCccd,
          ngayCap: new Date(2015, 0, 1),
          noiCap: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
          ngheNghiep: ['Nhân viên văn phòng', 'Giáo viên', 'Kỹ sư', 'Bác sĩ', 'Kinh doanh'][Math.floor(Math.random() * 5)],
          soDienThoai: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
        });
        
        // Create household
        const household = await db.HoKhau.create({
          soNha: apartments[i],
          duong: 'Đường IT4082',
          phuong: 'Phường Bách Khoa',
          quan: 'Quận Hai Bà Trưng',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          chuHo: resident.id
        });
        
        // Create apartment
        await db.Canho.create({
          soPhong: apartments[i],
          tang: Math.floor(parseInt(apartments[i]) / 100),
          dienTich: 60 + Math.floor(Math.random() * 40),
          trangThai: 'da_thue',
          ghiChu: `Căn hộ tầng ${Math.floor(parseInt(apartments[i]) / 100)}`,
          hoKhauId: household.soHoKhau,
          chuHoId: resident.id
        });
        
        console.log(`✅ Created apartment ${apartments[i]} for ${names[i]}`);
      }
    }
    
    // Step 2: Create fee collection periods
    const existingPeriods = await db.DotThu.count();
    console.log(`📊 Current fee periods: ${existingPeriods}`);
    
    const periods = [
      {
        tenDotThu: 'Tháng 6/2025',
        ngayTao: new Date('2025-06-01'),
        thoiHan: new Date('2025-06-30')
      },
      {
        tenDotThu: 'Tháng 5/2025',
        ngayTao: new Date('2025-05-01'),
        thoiHan: new Date('2025-05-31')
      },
      {
        tenDotThu: 'Quý II/2025',
        ngayTao: new Date('2025-04-01'),
        thoiHan: new Date('2025-06-30')
      }
    ];
    
    for (const period of periods) {
      const existing = await db.DotThu.findOne({ where: { tenDotThu: period.tenDotThu } });
      if (!existing) {
        await db.DotThu.create(period);
        console.log(`✅ Created period: ${period.tenDotThu}`);
      }
    }
    
    // Step 3: Create fee types
    const existingFeeTypes = await db.KhoanThu.count();
    console.log(`📊 Current fee types: ${existingFeeTypes}`);
    
    const feeTypes = [
      {
        tenKhoan: 'Phí dịch vụ chung cư',
        loaiKhoan: 'PHI_DICH_VU',
        batBuoc: true,
        ghiChu: 'Phí dịch vụ hàng tháng bao gồm: vệ sinh, bảo vệ, điện thang máy'
      },
      {
        tenKhoan: 'Phí gửi xe',
        loaiKhoan: 'PHI_GUI_XE',
        batBuoc: true,
        ghiChu: 'Phí gửi xe tại tầng hầm'
      },
      {
        tenKhoan: 'Phí quản lý',
        loaiKhoan: 'PHI_QUAN_LY',
        batBuoc: true,
        ghiChu: 'Phí quản lý vận hành tòa nhà'
      },
      {
        tenKhoan: 'Phí bảo trì nâng cấp',
        loaiKhoan: 'PHI_BAO_TRI',
        batBuoc: false,
        ghiChu: 'Phí bảo trì và nâng cấp cơ sở vật chất'
      },
      {
        tenKhoan: 'Phí internet chung',
        loaiKhoan: 'PHI_INTERNET',
        batBuoc: false,
        ghiChu: 'Phí internet WiFi khu vực chung'
      }
    ];
    
    const createdFeeTypes = [];
    for (const feeType of feeTypes) {
      const existing = await db.KhoanThu.findOne({ where: { tenKhoan: feeType.tenKhoan } });
      if (!existing) {
        const created = await db.KhoanThu.create(feeType);
        createdFeeTypes.push(created);
        console.log(`✅ Created fee type: ${feeType.tenKhoan}`);
      } else {
        createdFeeTypes.push(existing);
      }
    }
    
    // Step 4: Link fee types to periods
    console.log('📝 Linking fee types to periods...');
    
    const dotThuList = await db.DotThu.findAll();
    const khoanThuList = await db.KhoanThu.findAll();
    
    const dotThuKhoanThuData = [];
    
    // Tháng 6/2025 - Ongoing collection
    const dotThu6 = dotThuList.find(d => d.tenDotThu === 'Tháng 6/2025');
    if (dotThu6) {
      const dichVu = khoanThuList.find(k => k.tenKhoan === 'Phí dịch vụ chung cư');
      const guiXe = khoanThuList.find(k => k.tenKhoan === 'Phí gửi xe');
      const quanLy = khoanThuList.find(k => k.tenKhoan === 'Phí quản lý');
      const baoTri = khoanThuList.find(k => k.tenKhoan === 'Phí bảo trì nâng cấp');
      
      if (dichVu) dotThuKhoanThuData.push({ dotThuId: dotThu6.id, khoanThuId: dichVu.id, soTien: 500000 });
      if (guiXe) dotThuKhoanThuData.push({ dotThuId: dotThu6.id, khoanThuId: guiXe.id, soTien: 200000 });
      if (quanLy) dotThuKhoanThuData.push({ dotThuId: dotThu6.id, khoanThuId: quanLy.id, soTien: 300000 });
      if (baoTri) dotThuKhoanThuData.push({ dotThuId: dotThu6.id, khoanThuId: baoTri.id, soTien: 500000 });
    }
    
    // Tháng 5/2025 - Mostly completed
    const dotThu5 = dotThuList.find(d => d.tenDotThu === 'Tháng 5/2025');
    if (dotThu5) {
      const dichVu = khoanThuList.find(k => k.tenKhoan === 'Phí dịch vụ chung cư');
      const guiXe = khoanThuList.find(k => k.tenKhoan === 'Phí gửi xe');
      const quanLy = khoanThuList.find(k => k.tenKhoan === 'Phí quản lý');
      
      if (dichVu) dotThuKhoanThuData.push({ dotThuId: dotThu5.id, khoanThuId: dichVu.id, soTien: 480000 });
      if (guiXe) dotThuKhoanThuData.push({ dotThuId: dotThu5.id, khoanThuId: guiXe.id, soTien: 180000 });
      if (quanLy) dotThuKhoanThuData.push({ dotThuId: dotThu5.id, khoanThuId: quanLy.id, soTien: 300000 });
    }
    
    // Quý II/2025 - Quarterly fees
    const dotThuQ2 = dotThuList.find(d => d.tenDotThu === 'Quý II/2025');
    if (dotThuQ2) {
      const quanLy = khoanThuList.find(k => k.tenKhoan === 'Phí quản lý');
      const internet = khoanThuList.find(k => k.tenKhoan === 'Phí internet chung');
      
      if (quanLy) dotThuKhoanThuData.push({ dotThuId: dotThuQ2.id, khoanThuId: quanLy.id, soTien: 900000 });
      if (internet) dotThuKhoanThuData.push({ dotThuId: dotThuQ2.id, khoanThuId: internet.id, soTien: 150000 });
    }
    
    // Create the links (if not exist)
    for (const link of dotThuKhoanThuData) {
      const existing = await db.DotThu_KhoanThu.findOne({
        where: {
          dotThuId: link.dotThuId,
          khoanThuId: link.khoanThuId
        }
      });
      
      if (!existing) {
        await db.DotThu_KhoanThu.create(link);
        console.log(`✅ Linked fee type ${link.khoanThuId} to period ${link.dotThuId} with amount ${link.soTien}`);
      }
    }
    
    // Step 5: Create some sample payments for demonstration
    console.log('📝 Creating sample payment records...');
    
    const households = await db.HoKhau.findAll({
      include: [{
        model: db.NhanKhau,
        as: 'chuHoInfo'
      }]
    });
    
    console.log(`Found ${households.length} households`);
    
    // Create payments for May 2025 (mostly completed)
    if (dotThu5 && households.length > 0) {
      const mayFees = await db.DotThu_KhoanThu.findAll({
        where: { dotThuId: dotThu5.id },
        include: [{ model: db.KhoanThu, as: 'KhoanThu' }]
      });
      
      // Most households have paid May fees
      for (let i = 0; i < Math.min(households.length - 2, 10); i++) {
        const household = households[i];
        if (!household.chuHoInfo) continue;
        
        for (const fee of mayFees) {
          const existingPayment = await db.ThanhToan.findOne({
            where: {
              dotThuId: dotThu5.id,
              khoanThuId: fee.khoanThuId,
              hoKhauId: household.soHoKhau
            }
          });
          
          if (!existingPayment) {
            await db.ThanhToan.create({
              dotThuId: dotThu5.id,
              khoanThuId: fee.khoanThuId,
              hoKhauId: household.soHoKhau,
              nguoiNopId: household.chuHoInfo.id,
              soTien: fee.soTien,
              ngayNop: new Date(2025, 4, 5 + Math.floor(Math.random() * 25)), // May 5-30
              hinhThucNop: ['TIEN_MAT', 'CHUYEN_KHOAN', 'THE_ATM'][Math.floor(Math.random() * 3)],
              ghiChu: 'Thanh toán phí tháng 5/2025'
            });
            console.log(`✅ Created payment for household ${household.soHoKhau} - fee ${fee.khoanThuId}`);
          }
        }
      }
    }
    
    // Create some payments for June 2025 (ongoing)
    if (dotThu6 && households.length > 0) {
      const juneFees = await db.DotThu_KhoanThu.findAll({
        where: { dotThuId: dotThu6.id },
        include: [{ model: db.KhoanThu, as: 'KhoanThu' }]
      });
      
      // Some households have paid June fees
      for (let i = 0; i < Math.min(Math.floor(households.length / 2), 5); i++) {
        const household = households[i];
        if (!household.chuHoInfo) continue;
        
        // Only pay mandatory fees for now
        const mandatoryFees = juneFees.filter(f => f.KhoanThu?.batBuoc);
        
        for (const fee of mandatoryFees) {
          const existingPayment = await db.ThanhToan.findOne({
            where: {
              dotThuId: dotThu6.id,
              khoanThuId: fee.khoanThuId,
              hoKhauId: household.soHoKhau
            }
          });
          
          if (!existingPayment) {
            await db.ThanhToan.create({
              dotThuId: dotThu6.id,
              khoanThuId: fee.khoanThuId,
              hoKhauId: household.soHoKhau,
              nguoiNopId: household.chuHoInfo.id,
              soTien: fee.soTien,
              ngayNop: new Date(2025, 5, 1 + Math.floor(Math.random() * 12)), // June 1-13
              hinhThucNop: ['TIEN_MAT', 'CHUYEN_KHOAN', 'THE_ATM'][Math.floor(Math.random() * 3)],
              ghiChu: 'Thanh toán phí tháng 6/2025'
            });
            console.log(`✅ Created payment for household ${household.soHoKhau} - fee ${fee.khoanThuId}`);
          }
        }
      }
    }
    
    // Final summary
    const finalStats = {
      apartments: await db.Canho.count(),
      households: await db.HoKhau.count(),
      residents: await db.NhanKhau.count(),
      feePeriods: await db.DotThu.count(),
      feeTypes: await db.KhoanThu.count(),
      payments: await db.ThanhToan.count()
    };
    
    console.log('\n🎉 Fee system seed data created successfully!');
    console.log('📊 Final Statistics:');
    console.log(`- Apartments: ${finalStats.apartments}`);
    console.log(`- Households: ${finalStats.households}`);
    console.log(`- Residents: ${finalStats.residents}`);
    console.log(`- Fee Periods: ${finalStats.feePeriods}`);
    console.log(`- Fee Types: ${finalStats.feeTypes}`);
    console.log(`- Payment Records: ${finalStats.payments}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating fee system seed data:', error);
    process.exit(1);
  }
}

createFeeSystemSeed();
