const db = require('../db/models');

/**
 * Service để tính toán và tạo khoản thu cho hộ gia đình
 */
class FeeCalculationService {
  
  /**
   * Tạo khoản thu cho tất cả hộ gia đình khi tạo đợt thu mới
   * @param {number} dotThuId - ID của đợt thu
   * @param {Array} khoanThuList - Danh sách các khoản thu bắt buộc
   */
  async createHouseholdFeesForDotThu(dotThuId, khoanThuList = null) {
    try {
      // Lấy tất cả hộ gia đình
      const households = await db.HoKhau.findAll({
        include: [
          {
            model: db.NhanKhau,
            as: 'chuHoInfo'
          },
          {
            model: db.QuanLyXe,
            as: 'quanLyXe',
            include: [
              {
                model: db.LoaiXe,
                as: 'loaiXe'
              }
            ]
          }
        ]
      });

      // Nếu không truyền vào khoanThuList, lấy tất cả khoản thu bắt buộc
      if (!khoanThuList) {
        khoanThuList = await db.KhoanThu.findAll({
          where: { batbuoc: true }
        });
      }

      const householdFees = [];

      for (const household of households) {
        for (const khoanThu of khoanThuList) {
          // Check if household fee already exists for this combination
          const existingFee = await db.HouseholdFee.findOne({
            where: {
              dotThuId,
              khoanThuId: khoanThu.id,
              hoKhauId: household.soHoKhau
            }
          });
          
          if (existingFee) {
            console.log(`⚠️ Household fee already exists: dotThu=${dotThuId}, khoanThu=${khoanThu.id}, hoKhau=${household.soHoKhau}`);
            continue; // Skip creating duplicate
          }
          
          const feeCalculation = await this.calculateFeeForHousehold(household, khoanThu);
          
          if (feeCalculation.amount > 0) {
            householdFees.push({
              dotThuId,
              khoanThuId: khoanThu.id,
              hoKhauId: household.soHoKhau,
              soTien: feeCalculation.amount,
              soTienDaNop: 0,
              trangThai: 'chua_nop',
              chiTietTinhPhi: feeCalculation.details,
              ghiChu: feeCalculation.note
            });
          }
        }
      }

      // Bulk create để tối ưu performance với ignoreDuplicates option
      const createdFees = await db.HouseholdFee.bulkCreate(householdFees, {
        ignoreDuplicates: true // This will ignore any remaining duplicates
      });
      
      console.log(`✅ Created ${createdFees.length} household fees for dot thu ${dotThuId}`);
      return createdFees;

    } catch (error) {
      console.error('❌ Error creating household fees:', error);
      throw error;
    }
  }

  /**
   * Tính toán phí cho một hộ gia đình với một khoản thu cụ thể
   * @param {Object} household - Thông tin hộ gia đình
   * @param {Object} khoanThu - Thông tin khoản thu
   * @returns {Object} - {amount, details, note}
   */
  async calculateFeeForHousehold(household, khoanThu) {
    const feeType = khoanThu.tenkhoanthu.toLowerCase();
    let amount = 0;
    let details = {};
    let note = '';

    try {
      switch (true) {
        case feeType.includes('phí quản lý'):
        case feeType.includes('phí dịch vụ'):
          // Tính theo diện tích (giả sử 15,000 VND/m²)
          const area = await this.getHouseholdArea(household.soHoKhau);
          const ratePerSqm = 15000; // 15,000 VND/m²
          amount = area * ratePerSqm;
          details = { dienTich: area, giaMoiM2: ratePerSqm };
          note = `Tính theo diện tích ${area}m² × ${ratePerSqm.toLocaleString()}đ/m²`;
          break;

        case feeType.includes('phí gửi xe'):
        case feeType.includes('gửi xe'):
          // Tính theo số xe và loại xe
          const vehicleFee = await this.calculateVehicleFee(household);
          amount = vehicleFee.total;
          details = vehicleFee.details;
          note = vehicleFee.note;
          break;

        case feeType.includes('phí điện'):
          // Tính theo định mức hoặc số đo (giả sử 3,000đ/kWh, định mức 150kWh)
          const electricUsage = await this.getElectricUsage(household.soHoKhau) || 150;
          const electricRate = 3000; // 3,000đ/kWh
          amount = electricUsage * electricRate;
          details = { soDien: electricUsage, giaMoiKwh: electricRate };
          note = `Tính theo ${electricUsage}kWh × ${electricRate.toLocaleString()}đ/kWh`;
          break;

        case feeType.includes('phí nước'):
          // Tính theo định mức hoặc số đo (giả sử 25,000đ/m³, định mức 12m³)
          const waterUsage = await this.getWaterUsage(household.soHoKhau) || 12;
          const waterRate = 25000; // 25,000đ/m³
          amount = waterUsage * waterRate;
          details = { soNuoc: waterUsage, giaMoiM3: waterRate };
          note = `Tính theo ${waterUsage}m³ × ${waterRate.toLocaleString()}đ/m³`;
          break;

        case feeType.includes('phí internet'):
          // Phí cố định cho hộ đăng ký
          const hasInternet = await this.checkInternetSubscription(household.soHoKhau);
          amount = hasInternet ? 150000 : 0; // 150,000đ/tháng
          details = { dangKyInternet: hasInternet };
          note = hasInternet ? 'Phí internet cố định' : 'Không đăng ký internet';
          break;

        case feeType.includes('phí bảo vệ'):
        case feeType.includes('phí vệ sinh'):
          // Phí cố định cho tất cả hộ
          amount = 200000; // 200,000đ/tháng
          details = { phiCoDinh: true };
          note = 'Phí cố định cho tất cả hộ gia đình';
          break;

        default:
          // Các khoản thu khác - phí cố định
          amount = 100000; // Mặc định 100,000đ
          details = { phiMacDinh: true };
          note = 'Khoản thu khác - phí mặc định';
          break;
      }

      return {
        amount: Math.round(amount),
        details,
        note
      };

    } catch (error) {
      console.error(`❌ Error calculating fee for household ${household.soHoKhau}:`, error);
      return { amount: 0, details: {}, note: 'Lỗi tính toán phí' };
    }
  }

  /**
   * Lấy diện tích của hộ gia đình (giả sử từ bảng Canho hoặc Room)
   */
  async getHouseholdArea(hoKhauId) {
    try {
      // Giả sử có bảng Room chứa thông tin diện tích
      const room = await db.Room.findOne({
        where: { hoKhauId }
      });
      
      // Nếu không có thông tin, trả về diện tích mặc định
      return room ? room.dienTich || 70 : 70; // Mặc định 70m²
    } catch (error) {
      console.log('Using default area for household', hoKhauId);
      return 70; // Mặc định 70m²
    }
  }

  /**
   * Tính phí gửi xe cho hộ gia đình
   */
  async calculateVehicleFee(household) {
    try {
      let totalFee = 0;
      let details = {};
      let vehicleCount = 0;

      if (household.quanLyXe && household.quanLyXe.length > 0) {
        for (const vehicle of household.quanLyXe) {
          if (vehicle.trangThai === 'Hoạt động' && vehicle.loaiXe) {
            totalFee += vehicle.loaiXe.phiThue || 0;
            const vehicleType = vehicle.loaiXe.ten;
            details[vehicleType] = (details[vehicleType] || 0) + 1;
            vehicleCount++;
          }
        }
      }

      const note = vehicleCount > 0 
        ? `Phí gửi ${vehicleCount} xe: ${Object.entries(details).map(([type, count]) => `${count} ${type}`).join(', ')}`
        : 'Không có xe đăng ký';

      return {
        total: totalFee,
        details: { ...details, tongSoXe: vehicleCount },
        note
      };
    } catch (error) {
      console.error('Error calculating vehicle fee:', error);
      return { total: 0, details: {}, note: 'Lỗi tính phí xe' };
    }
  }

  /**
   * Lấy số điện tiêu thụ (có thể từ file Excel hoặc nhập thủ công)
   */
  async getElectricUsage(hoKhauId) {
    // TODO: Implement logic to get electric usage from database or file
    // For now, return random usage between 100-200 kWh
    return Math.floor(Math.random() * 100) + 100;
  }

  /**
   * Lấy số nước tiêu thụ (có thể từ file Excel hoặc nhập thủ công)
   */
  async getWaterUsage(hoKhauId) {
    // TODO: Implement logic to get water usage from database or file
    // For now, return random usage between 8-15 m³
    return Math.floor(Math.random() * 8) + 8;
  }

  /**
   * Kiểm tra hộ có đăng ký internet không
   */
  async checkInternetSubscription(hoKhauId) {
    // TODO: Implement logic to check internet subscription
    // For now, assume 70% of households have internet
    return Math.random() > 0.3;
  }

  /**
   * Cập nhật trạng thái thanh toán khi có thanh toán mới
   */
  async updatePaymentStatus(householdFeeId, paymentAmount) {
    try {
      const householdFee = await db.HouseholdFee.findByPk(householdFeeId);
      if (!householdFee) {
        throw new Error('Household fee not found');
      }

      const newTotalPaid = parseFloat(householdFee.soTienDaNop) + parseFloat(paymentAmount);
      const totalAmount = parseFloat(householdFee.soTien);

      let newStatus;
      if (newTotalPaid >= totalAmount) {
        newStatus = 'da_nop_du';
      } else if (newTotalPaid > 0) {
        newStatus = 'nop_mot_phan';
      } else {
        newStatus = 'chua_nop';
      }

      await householdFee.update({
        soTienDaNop: newTotalPaid,
        trangThai: newStatus
      });

      return householdFee;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
}

module.exports = new FeeCalculationService();
