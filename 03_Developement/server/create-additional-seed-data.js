const db = require('./db/models');

async function createAdditionalData() {
  try {
    console.log('🚀 Creating additional seed data for apartment complex...');
    
    // Check current apartment count
    const currentCount = await db.Canho.count();
    console.log(`📊 Current apartments: ${currentCount}`);
    
    if (currentCount >= 15) {
      console.log('✅ Already have 15+ apartments. Skipping apartment creation.');
    } else {
      console.log('📝 Creating additional apartments to reach 15 total...');
      
      const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
      const middleNames = ['Văn', 'Thị', 'Minh', 'Hồng', 'Quang', 'Ngọc', 'Thanh', 'Tuấn', 'Thành', 'Hải'];
      const lastNames = ['An', 'Bình', 'Châu', 'Dung', 'Em', 'Giang', 'Hạnh', 'Khánh', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phong', 'Quý', 'Sơn'];
      
      // Create apartments from 101 to 315 (15 total)
      const apartments = [
        // Tầng 1 (101-103)
        { room: '101', floor: 1 },
        { room: '102', floor: 1 },
        { room: '103', floor: 1 },
        // Tầng 2 (201-203) - đã có
        // Tầng 3 (301-303)
        { room: '301', floor: 3 },
        { room: '302', floor: 3 },
        { room: '303', floor: 3 },
        // Tầng 4 (401-403)
        { room: '401', floor: 4 },
        { room: '402', floor: 4 },
        { room: '403', floor: 4 },
        // Tầng 5 (501-503)
        { room: '501', floor: 5 },
        { room: '502', floor: 5 },
        { room: '503', floor: 5 },
      ];
      
      for (const apt of apartments) {
        // Check if apartment already exists
        const existing = await db.Canho.findOne({ where: { soPhong: apt.room } });
        if (existing) {
          console.log(`⏭️  Apartment ${apt.room} already exists, skipping...`);
          continue;
        }
        
        const area = 60 + Math.floor(Math.random() * 40); // 60-100m²
        
        // Create resident (head of household)
        const headFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const headMiddleName = middleNames[Math.floor(Math.random() * middleNames.length)];
        const headLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const headFullName = `${headFirstName} ${headMiddleName} ${headLastName}`;
        
        const resident = await db.NhanKhau.create({
          hoTen: headFullName,
          ngaySinh: new Date(1975 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gioiTinh: Math.random() > 0.5 ? 'Nam' : 'Nữ',
          danToc: 'Kinh',
          tonGiao: 'Không',
          cccd: `${Date.now()}${Math.floor(Math.random() * 1000)}`.substring(0, 12),
          ngayCap: new Date(2015, 0, 1),
          noiCap: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
          ngheNghiep: ['Nhân viên văn phòng', 'Giáo viên', 'Kỹ sư', 'Bác sĩ', 'Kinh doanh', 'Luật sư', 'Kế toán'][Math.floor(Math.random() * 7)],
          soDienThoai: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
        });
        
        // Create household
        const household = await db.HoKhau.create({
          diaChi: `Phòng ${apt.room}, Chung cư IT4082, Hà Nội`,
          ngayLap: new Date(),
          lyDoTao: 'Đăng ký thuê căn hộ',
          chuHo: resident.id
        });
        
        // Create apartment
        await db.Canho.create({
          soPhong: apt.room,
          tang: apt.floor,
          dienTich: area,
          trangThai: 'da_thue',
          ghiChu: `Căn hộ ${area}m² tầng ${apt.floor}`,
          hoKhauId: household.soHoKhau,
          chuHoId: resident.id
        });
        
        console.log(`✅ Created apartment ${apt.room} for ${headFullName}`);
      }
    }
    
    // Create more fee collection periods
    const existingPeriods = await db.DotThu.count();
    if (existingPeriods < 3) {
      console.log('📝 Creating additional fee collection periods...');
      
      // Create more realistic periods
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
    }
    
    // Create additional fee types if needed
    const existingFeeTypes = await db.KhoanThu.count();
    if (existingFeeTypes < 5) {
      console.log('📝 Creating additional fee types...');
      
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
      
      for (const feeType of feeTypes) {
        const existing = await db.KhoanThu.findOne({ where: { tenKhoan: feeType.tenKhoan } });
        if (!existing) {
          await db.KhoanThu.create(feeType);
          console.log(`✅ Created fee type: ${feeType.tenKhoan}`);
        }
      }
    }
    
    // Show final summary
    const totalApts = await db.Canho.count();
    const totalHouseholds = await db.HoKhau.count();
    const totalPeriods = await db.DotThu.count();
    const totalFeeTypes = await db.KhoanThu.count();
    
    console.log('\n📊 Final Data Summary:');
    console.log(`- Apartments: ${totalApts}`);
    console.log(`- Households: ${totalHouseholds}`);
    console.log(`- Fee Periods: ${totalPeriods}`);
    console.log(`- Fee Types: ${totalFeeTypes}`);
    
    if (totalApts >= 15) {
      console.log('🎉 Successfully created apartment complex with 15+ units!');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating additional data:', error);
    process.exit(1);
  }
}

createAdditionalData();
