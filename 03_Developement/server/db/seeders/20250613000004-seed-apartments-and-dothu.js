'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Create 15 apartments with realistic data
      const apartmentData = [];
      const householdData = [];
      const residentData = [];
      
      const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
      const middleNames = ['Văn', 'Thị', 'Minh', 'Hồng', 'Quang', 'Ngọc', 'Thanh', 'Tuấn', 'Thành', 'Hải'];
      const lastNames = ['An', 'Bình', 'Châu', 'Dung', 'Em', 'Giang', 'Hạnh', 'Khánh', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phong', 'Quý', 'Sơn'];
      
      // Generate apartments on floors 2-6 (3 apartments per floor)
      for (let floor = 2; floor <= 6; floor++) {
        for (let roomNum = 1; roomNum <= 3; roomNum++) {
          const apartmentId = apartmentData.length + 1;
          const roomNumber = `${floor}0${roomNum}`;
          const area = 60 + Math.floor(Math.random() * 40); // 60-100 m²
          
          // Create apartment
          apartmentData.push({
            id: apartmentId,
            soPhong: roomNumber,
            tang: floor,
            dienTich: area,
            trangThai: 'da_thue',
            ghiChu: `Căn hộ ${area}m² tầng ${floor}`,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Create household
          const householdId = apartmentId;
          householdData.push({
            id: householdId,
            soHoKhau: householdId,
            diaChi: `Phòng ${roomNumber}, Chung cư IT4082, Hà Nội`,
            ngayLap: new Date(),
            lyDoTao: 'Đăng ký thuê căn hộ',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          // Create household head
          const headFirstName = firstNames[apartmentId % firstNames.length];
          const headMiddleName = middleNames[apartmentId % middleNames.length];
          const headLastName = lastNames[apartmentId % lastNames.length];
          const headFullName = `${headFirstName} ${headMiddleName} ${headLastName}`;
          
          const headId = apartmentId;
          residentData.push({
            id: headId,
            hoTen: headFullName,
            ngaySinh: new Date(1980 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            gioiTinh: Math.random() > 0.5 ? 'Nam' : 'Nữ',
            danToc: 'Kinh',
            tonGiao: 'Không',
            cccd: `0${apartmentId.toString().padStart(11, '0')}`,
            ngayCap: new Date(2015, 0, 1),
            noiCap: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
            ngheNghiep: ['Nhân viên văn phòng', 'Giáo viên', 'Kỹ sư', 'Bác sĩ', 'Kinh doanh'][Math.floor(Math.random() * 5)],
            soDienThoai: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
      
      // Insert data
      await queryInterface.bulkInsert('CanHo', apartmentData, { transaction });
      await queryInterface.bulkInsert('HoKhau', householdData, { transaction });
      await queryInterface.bulkInsert('NhanKhau', residentData, { transaction });
      
      // Update apartments with household IDs
      for (let i = 0; i < apartmentData.length; i++) {
        await queryInterface.sequelize.query(
          `UPDATE "CanHo" SET "hoKhauId" = ${i + 1}, "chuHoId" = ${i + 1} WHERE id = ${i + 1}`,
          { transaction }
        );
      }
      
      // Update households with head IDs
      for (let i = 0; i < householdData.length; i++) {
        await queryInterface.sequelize.query(
          `UPDATE "HoKhau" SET "chuHoId" = ${i + 1} WHERE id = ${i + 1}`,
          { transaction }
        );
      }
      
      // 2. Create fee collection periods (Đợt thu)
      const dotThuData = [
        {
          id: 1,
          tenDotThu: 'Tháng 6/2025',
          ngayTao: new Date('2025-06-01'),
          thoiHan: new Date('2025-06-30'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          tenDotThu: 'Tháng 5/2025',
          ngayTao: new Date('2025-05-01'),
          thoiHan: new Date('2025-05-31'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          tenDotThu: 'Quý II/2025',
          ngayTao: new Date('2025-04-01'),
          thoiHan: new Date('2025-06-30'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          tenDotThu: 'Tháng 4/2025',
          ngayTao: new Date('2025-04-01'),
          thoiHan: new Date('2025-04-30'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await queryInterface.bulkInsert('DotThu', dotThuData, { transaction });
      
      // 3. Create fee types (Khoản thu)
      const khoanThuData = [
        {
          id: 1,
          tenKhoan: 'Phí dịch vụ chung cư',
          loaiKhoan: 'PHI_DICH_VU',
          batBuoc: true,
          ghiChu: 'Phí dịch vụ hàng tháng bao gồm: vệ sinh, bảo vệ, điện thang máy',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          tenKhoan: 'Phí gửi xe',
          loaiKhoan: 'PHI_GUI_XE',
          batBuoc: true,
          ghiChu: 'Phí gửi xe tại tầng hầm',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          tenKhoan: 'Phí quản lý',
          loaiKhoan: 'PHI_QUAN_LY',
          batBuoc: true,
          ghiChu: 'Phí quản lý vận hành tòa nhà',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          tenKhoan: 'Phí bảo trì nâng cấp',
          loaiKhoan: 'PHI_BAO_TRI',
          batBuoc: false,
          ghiChu: 'Phí bảo trì và nâng cấp cơ sở vật chất',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          tenKhoan: 'Phí internet chung',
          loaiKhoan: 'PHI_DICH_VU',
          batBuoc: false,
          ghiChu: 'Phí dịch vụ internet tại khu vực chung',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await queryInterface.bulkInsert('KhoanThu', khoanThuData, { transaction });
      
      // 4. Link fee types to fee collection periods
      const dotThuKhoanThuData = [];
      
      // Tháng 6/2025 - Đợt hiện tại
      dotThuKhoanThuData.push(
        { dotThuId: 1, khoanThuId: 1, soTien: 500000 }, // Phí dịch vụ
        { dotThuId: 1, khoanThuId: 2, soTien: 200000 }, // Phí gửi xe
        { dotThuId: 1, khoanThuId: 3, soTien: 300000 }, // Phí quản lý
        { dotThuId: 1, khoanThuId: 4, soTien: 500000 }  // Phí bảo trì (không bắt buộc)
      );
      
      // Tháng 5/2025 - Đã hoàn thành
      dotThuKhoanThuData.push(
        { dotThuId: 2, khoanThuId: 1, soTien: 480000 }, // Phí dịch vụ
        { dotThuId: 2, khoanThuId: 2, soTien: 180000 }, // Phí gửi xe
        { dotThuId: 2, khoanThuId: 3, soTien: 300000 }  // Phí quản lý
      );
      
      // Quý II/2025 - Đợt dài hạn
      dotThuKhoanThuData.push(
        { dotThuId: 3, khoanThuId: 3, soTien: 900000 }, // Phí quản lý quý
        { dotThuId: 3, khoanThuId: 4, soTien: 1500000 }, // Phí bảo trì lớn
        { dotThuId: 3, khoanThuId: 5, soTien: 150000 }  // Phí internet
      );
      
      // Tháng 4/2025 - Đã đóng
      dotThuKhoanThuData.push(
        { dotThuId: 4, khoanThuId: 1, soTien: 450000 }, // Phí dịch vụ
        { dotThuId: 4, khoanThuId: 2, soTien: 170000 }  // Phí gửi xe
      );
      
      await queryInterface.bulkInsert('DotThu_KhoanThu', dotThuKhoanThuData, { transaction });
      
      await transaction.commit();
      console.log('✅ Seeded 15 apartments, households, residents, fee periods and fee types successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error seeding data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Delete in reverse order
      await queryInterface.bulkDelete('DotThu_KhoanThu', null, { transaction });
      await queryInterface.bulkDelete('KhoanThu', null, { transaction });
      await queryInterface.bulkDelete('DotThu', null, { transaction });
      await queryInterface.bulkDelete('NhanKhau', { id: { [Sequelize.Op.lte]: 15 } }, { transaction });
      await queryInterface.bulkDelete('HoKhau', { id: { [Sequelize.Op.lte]: 15 } }, { transaction });
      await queryInterface.bulkDelete('CanHo', { id: { [Sequelize.Op.lte]: 15 } }, { transaction });
      
      await transaction.commit();
      console.log('✅ Rollback completed successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error rolling back data:', error);
      throw error;
    }
  }
};
