// Fee calculation service for creating household fees automatically
const db = require('../db/models');

/**
 * Create household fees for a fee collection period
 * @param {number} dotThuId - Fee collection period ID
 * @param {Array} selectedKhoanThu - Optional array of specific fee types to create
 */
const createHouseholdFeesForDotThu = async (dotThuId, selectedKhoanThu = null) => {
  try {
    console.log(`Creating household fees for dotThu ${dotThuId}`);
    
    // Get all households
    const households = await db.HoKhau.findAll({
      include: [{
        model: db.NhanKhau,
        as: 'chuHoInfo'
      }]
    });

    if (households.length === 0) {
      console.log('No households found, skipping fee creation');
      return;
    }

    // Get fee types to create
    let khoanThuList;
    if (selectedKhoanThu && selectedKhoanThu.length > 0) {
      // Use the specifically selected fee types (including non-mandatory ones)
      khoanThuList = selectedKhoanThu;
    } else {
      // Get all mandatory fee types by default if no specific selection
      khoanThuList = await db.KhoanThu.findAll({
        where: {
          batbuoc: true
        }
      });
    }

    if (khoanThuList.length === 0) {
      console.log('No fee types found, skipping fee creation');
      return;
    }

    // Get fee amounts from DotThu_KhoanThu associations
    const dotThuKhoanThu = await db.DotThu_KhoanThu.findAll({
      where: { dotThuId },
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu'
      }]
    });

    const feeAmounts = {};
    dotThuKhoanThu.forEach(assoc => {
      // For voluntary contribution fees, use soTienToiThieu from KhoanThu if DotThu_KhoanThu amount is 0
      let amount = assoc.soTien || 0;
      if (amount === 0 && assoc.khoanThu && assoc.khoanThu.soTienToiThieu) {
        amount = assoc.khoanThu.soTienToiThieu;
      }
      feeAmounts[assoc.khoanThuId] = amount;
    });

    // Create household fees
    const householdFees = [];
    for (const household of households) {
      for (const khoanThu of khoanThuList) {
        let amount = feeAmounts[khoanThu.id] || 0;
        
        // If amount is still 0, check if this is a voluntary contribution fee
        if (amount === 0 && khoanThu.soTienToiThieu) {
          amount = khoanThu.soTienToiThieu;
        }
        
        householdFees.push({
          dotThuId,
          khoanThuId: khoanThu.id,
          hoKhauId: household.soHoKhau,
          soTien: amount,
          soTienDaNop: 0,
          trangThai: 'chua_nop',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (householdFees.length > 0) {
      // Use upsert for better handling of existing records
      for (const householdFee of householdFees) {
        await db.HouseholdFee.upsert(householdFee, {
          conflictFields: ['dotThuId', 'khoanThuId', 'hoKhauId']
        });
      }
      console.log(`Created/Updated ${householdFees.length} household fees`);
    }

  } catch (error) {
    console.error('Error creating household fees:', error);
    // Don't throw error to avoid breaking fee collection period creation
    console.log('Continuing without household fee creation...');
  }
};

/**
 * Calculate fee for a specific household
 * @param {Object} household - Household object
 * @param {Object} khoanThu - Fee type object
 * @returns {Object} Fee calculation result
 */
const calculateFeeForHousehold = async (household, khoanThu) => {
  try {
    // This is a simplified calculation
    // In a real system, this would consider area, vehicles, usage, etc.
    let amount = 0;
    let details = {};
    let note = '';

    // You can extend this with more complex calculations based on fee type
    if (khoanThu.tenkhoanthu.toLowerCase().includes('quản lý')) {
      // Management fee based on area (example: 15,000 VND per m²)
      const area = 70; // Default area, should come from household data
      amount = area * 15000;
      details = { area, rate: 15000 };
      note = `Phí quản lý cho diện tích ${area}m²`;
    } else if (khoanThu.tenkhoanthu.toLowerCase().includes('xe')) {
      // Vehicle fee (example: 70,000 VND per motorbike, 1,200,000 VND per car)
      const motorbikes = 1; // Default, should come from household data
      const cars = 0;
      amount = motorbikes * 70000 + cars * 1200000;
      details = { motorbikes, cars, rateMotorbike: 70000, rateCar: 1200000 };
      note = `Phí gửi xe: ${motorbikes} xe máy, ${cars} ô tô`;
    } else {
      // Default amount for other fees
      amount = khoanThu.soTienToiThieu || 0;
      note = `Khoản thu: ${khoanThu.tenkhoanthu}`;
    }

    return {
      amount,
      details,
      note
    };
  } catch (error) {
    console.error('Error calculating fee for household:', error);
    return {
      amount: 0,
      details: {},
      note: 'Lỗi tính toán phí'
    };
  }
};

/**
 * Update payment status for a household fee
 * @param {number} householdFeeId - Household fee ID
 * @param {number} paymentAmount - Amount being paid
 */
const updatePaymentStatus = async (householdFeeId, paymentAmount) => {
  try {
    // Get the household fee record
    const householdFee = await db.HouseholdFee.findByPk(householdFeeId);
    if (!householdFee) {
      throw new Error('Household fee not found');
    }

    // Calculate new total paid amount
    const newSoTienDaNop = parseFloat(householdFee.soTienDaNop || 0) + parseFloat(paymentAmount);
    const soTien = parseFloat(householdFee.soTien || 0);

    // Determine new status
    let newTrangThai;
    if (newSoTienDaNop >= soTien) {
      newTrangThai = 'da_nop_du';
    } else if (newSoTienDaNop > 0) {
      newTrangThai = 'nop_mot_phan';
    } else {
      newTrangThai = 'chua_nop';
    }

    // Update the household fee record
    await householdFee.update({
      soTienDaNop: newSoTienDaNop,
      trangThai: newTrangThai,
      updatedAt: new Date()
    });

    return householdFee;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Calculate fee amount for a household based on fee type
 * @param {Object} khoanThu - Fee type object
 * @param {Object} household - Household object
 * @returns {number} Calculated fee amount
 */
const calculateFeeAmount = (khoanThu, household) => {
  // For now, return default amount
  // In the future, this can be enhanced with complex calculations
  // based on area, number of people, vehicles, etc.
  return 0; // Default to 0, amounts will be set in DotThu_KhoanThu
};

module.exports = {
  createHouseholdFeesForDotThu,
  calculateFeeAmount,
  calculateFeeForHousehold,
  updatePaymentStatus
};