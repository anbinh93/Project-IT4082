const db = require('./db/models');

async function createSeedData() {
  try {
    console.log('🚀 Starting to create seed data...');
    
    // Check if apartments already exist
    const existingApts = await db.Canho.findAll({ limit: 1 });
    if (existingApts.length > 0) {
      console.log('✅ Apartments already exist. Checking DotThu data...');
    } else {
      console.log('📝 Creating apartments and households...');
      
      // Create apartments and households
      const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
      const middleNames = ['Văn', 'Thị', 'Minh', 'Hồng', 'Quang', 'Ngọc', 'Thanh', 'Tuấn', 'Thành', 'Hải'];
      const lastNames = ['An', 'Bình', 'Châu', 'Dung', 'Em', 'Giang', 'Hạnh', 'Khánh', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phong', 'Quý', 'Sơn'];
      
      for (let floor = 2; floor <= 6; floor++) {
        for (let roomNum = 1; roomNum <= 3; roomNum++) {
          const roomNumber = `${floor}0${roomNum}`;
          const area = 60 + Math.floor(Math.random() * 40);
          
          // Create resident (head of household)
          const headFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const headMiddleName = middleNames[Math.floor(Math.random() * middleNames.length)];
          const headLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const headFullName = `${headFirstName} ${headMiddleName} ${headLastName}`;
          
          const resident = await db.NhanKhau.create({
            hoTen: headFullName,
            ngaySinh: new Date(1980 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            gioiTinh: Math.random() > 0.5 ? 'Nam' : 'Nữ',
            danToc: 'Kinh',
            tonGiao: 'Không',
            cccd: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
            ngayCap: new Date(2015, 0, 1),
            noiCap: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
            ngheNghiep: ['Nhân viên văn phòng', 'Giáo viên', 'Kỹ sư', 'Bác sĩ', 'Kinh doanh'][Math.floor(Math.random() * 5)],
            soDienThoai: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
          });
          
          // Create household
          const household = await db.HoKhau.create({
            diaChi: `Phòng ${roomNumber}, Chung cư IT4082, Hà Nội`,
            ngayLap: new Date(),
            lyDoTao: 'Đăng ký thuê căn hộ',
            chuHoId: resident.id
          });
          
          // Create apartment
          await db.Canho.create({
            soPhong: roomNumber,
            tang: floor,
            dienTich: area,
            trangThai: 'da_thue',
            ghiChu: `Căn hộ ${area}m² tầng ${floor}`,
            hoKhauId: household.id,
            chuHoId: resident.id
          });
          
          console.log(`✅ Created apartment ${roomNumber} for ${headFullName}`);
        }
      }
    }
    
    // Check and create DotThu data
    const existingDotThu = await db.DotThu.findAll({ limit: 1 });
    if (existingDotThu.length > 0) {
      console.log('✅ DotThu data already exists.');
    } else {
      console.log('📝 Creating DotThu and KhoanThu data...');
      
      // Create fee collection periods
      const dotThu1 = await db.DotThu.create({
        tenDotThu: 'Tháng 6/2025',
        ngayTao: new Date('2025-06-01'),
        thoiHan: new Date('2025-06-30')
      });
      
      const dotThu2 = await db.DotThu.create({
        tenDotThu: 'Tháng 5/2025',
        ngayTao: new Date('2025-05-01'),
        thoiHan: new Date('2025-05-31')
      });
      
      const dotThu3 = await db.DotThu.create({
        tenDotThu: 'Quý II/2025',
        ngayTao: new Date('2025-04-01'),
        thoiHan: new Date('2025-06-30')
      });
      
      // Create fee types
      const khoanThu1 = await db.KhoanThu.create({
        tenKhoan: 'Phí dịch vụ chung cư',
        loaiKhoan: 'PHI_DICH_VU',
        batBuoc: true,
        ghiChu: 'Phí dịch vụ hàng tháng bao gồm: vệ sinh, bảo vệ, điện thang máy'
      });
      
      const khoanThu2 = await db.KhoanThu.create({
        tenKhoan: 'Phí gửi xe',
        loaiKhoan: 'PHI_GUI_XE',
        batBuoc: true,
        ghiChu: 'Phí gửi xe tại tầng hầm'
      });
      
      const khoanThu3 = await db.KhoanThu.create({
        tenKhoan: 'Phí quản lý',
        loaiKhoan: 'PHI_QUAN_LY',
        batBuoc: true,
        ghiChu: 'Phí quản lý vận hành tòa nhà'
      });
      
      const khoanThu4 = await db.KhoanThu.create({
        tenKhoan: 'Phí bảo trì nâng cấp',
        loaiKhoan: 'PHI_BAO_TRI',
        batBuoc: false,
        ghiChu: 'Phí bảo trì và nâng cấp cơ sở vật chất'
      });
      
      // Link fee types to periods
      await db.DotThu_KhoanThu.bulkCreate([
        // Tháng 6/2025
        { dotThuId: dotThu1.id, khoanThuId: khoanThu1.id, soTien: 500000 },
        { dotThuId: dotThu1.id, khoanThuId: khoanThu2.id, soTien: 200000 },
        { dotThuId: dotThu1.id, khoanThuId: khoanThu3.id, soTien: 300000 },
        { dotThuId: dotThu1.id, khoanThuId: khoanThu4.id, soTien: 500000 },
        
        // Tháng 5/2025
        { dotThuId: dotThu2.id, khoanThuId: khoanThu1.id, soTien: 480000 },
        { dotThuId: dotThu2.id, khoanThuId: khoanThu2.id, soTien: 180000 },
        { dotThuId: dotThu2.id, khoanThuId: khoanThu3.id, soTien: 300000 },
        
        // Quý II/2025
        { dotThuId: dotThu3.id, khoanThuId: khoanThu3.id, soTien: 900000 },
        { dotThuId: dotThu3.id, khoanThuId: khoanThu4.id, soTien: 1500000 }
      ]);
      
      console.log('✅ Created DotThu and KhoanThu data successfully!');
    }
    
    // Show summary
    const totalApts = await db.Canho.count();
    const totalHouseholds = await db.HoKhau.count();
    const totalDotThu = await db.DotThu.count();
    const totalKhoanThu = await db.KhoanThu.count();
    
    console.log('\n📊 Data Summary:');
    console.log(`- Apartments: ${totalApts}`);
    console.log(`- Households: ${totalHouseholds}`);
    console.log(`- Fee Periods: ${totalDotThu}`);
    console.log(`- Fee Types: ${totalKhoanThu}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating seed data:', error);
    process.exit(1);
  }
}

createSeedData();
