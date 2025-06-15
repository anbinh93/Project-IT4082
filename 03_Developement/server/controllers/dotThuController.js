const db = require('../db/models');
const { Op } = require('sequelize');
const feeCalculationService = require('../services/feeCalculationService');

// Get all fee collection periods with their fee items
const getAllDotThuWithKhoanThu = async (req, res) => {
  try {
    const {
      page = 0,
      size = 10,
      sortBy = 'createdAt',
      sortDir = 'desc',
      search
    } = req.query;

    let whereConditions = {};
    
    if (search) {
      whereConditions.tenDotThu = {
        [Op.iLike]: `%${search}%`
      };
    }

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows: dotThus } = await db.DotThu.findAndCountAll({
      where: whereConditions,
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu',
        through: { attributes: ['soTien'] },
        required: false
      }],
      order: [[sortBy, sortDir.toUpperCase()]],
      offset,
      limit
    });

    // Calculate statistics for each dotThu
    const formattedDotThus = await Promise.all(dotThus.map(async (dotThu) => {
      const khoanThuList = dotThu.khoanThu.map(khoan => ({
        id: khoan.id,
        tenKhoan: khoan.tenKhoan,
        loaiKhoan: khoan.loaiKhoan,
        soTienMacDinh: khoan.DotThu_KhoanThu?.soTien || 0,
        batBuoc: khoan.batBuoc,
        ghiChu: khoan.ghiChu,
        trangThai: 'Đang thu' // TODO: Calculate actual status
      }));

      // TODO: Calculate real statistics from payment records
      const totalHouseholds = 15; // Mock data for now
      const paidHouseholds = Math.floor(Math.random() * totalHouseholds);
      const completionRate = totalHouseholds > 0 ? (paidHouseholds / totalHouseholds * 100).toFixed(1) : 0;

      // Use database status directly, with fallback calculation for null values
      let trangThai = dotThu.trangThai || 'DANG_MO';
      if (!dotThu.trangThai || dotThu.dongTuDong) {
        // Auto-calculate status if not manually set or if auto-closure is enabled
        const currentDate = new Date();
        const deadline = new Date(dotThu.thoiHan);
        if (currentDate > deadline) {
          trangThai = completionRate == 100 ? 'HOAN_THANH' : 'DA_DONG';
        } else {
          trangThai = 'DANG_MO';
        }
      }

      return {
        id: dotThu.id,
        tenDotThu: dotThu.tenDotThu,
        ngayTao: dotThu.ngayTao,
        thoiHan: dotThu.thoiHan,
        trangThai, // Return raw database status (DANG_MO, DA_DONG, HOAN_THANH)
        dongTuDong: dotThu.dongTuDong,
        khoanThu: khoanThuList,
        thongKe: {
          tongHoKhau: totalHouseholds,
          hoKhauDaThanhToan: paidHouseholds,
          tyLeHoanThanh: parseFloat(completionRate),
          tongTien: khoanThuList.reduce((sum, k) => sum + k.soTienMacDinh, 0) * totalHouseholds,
          daThuDuoc: khoanThuList.reduce((sum, k) => sum + k.soTienMacDinh, 0) * paidHouseholds
        },
        createdAt: dotThu.createdAt,
        updatedAt: dotThu.updatedAt
      };
    }));

    return res.status(200).json({
      success: true,
      dotThus: formattedDotThus,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(size),
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(size))
      }
    });

  } catch (error) {
    console.error('Error getting fee collection periods with khoan thu:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đợt thu phí',
      error: error.message
    });
  }
};

// Get all fee collection periods
const getAllDotThu = async (req, res) => {
  try {
    const {
      page = 0,
      size = 10,
      sortBy = 'createdAt',
      sortDir = 'desc',
      search
    } = req.query;

    let whereConditions = {};
    
    if (search) {
      whereConditions.tenDotThu = {
        [Op.iLike]: `%${search}%`
      };
    }

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows: dotThus } = await db.DotThu.findAndCountAll({
      where: whereConditions,
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu',
        through: { attributes: ['soTien'] }
      }],
      order: [[sortBy, sortDir.toUpperCase()]],
      offset,
      limit
    });

    // Format response
    const formattedDotThus = dotThus.map(dotThu => ({
      id: dotThu.id,
      tenDotThu: dotThu.tenDotThu,
      ngayTao: dotThu.ngayTao,
      thoiHan: dotThu.thoiHan,
      createdAt: dotThu.createdAt,
      updatedAt: dotThu.updatedAt,
      khoanThu: dotThu.khoanThu
    }));

    return res.status(200).json({
      success: true,
      dotThus: formattedDotThus,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(size),
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(size))
      }
    });

  } catch (error) {
    console.error('Error getting fee collection periods:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy danh sách đợt thu phí',
      error: error.message
    });
  }
};

// Get fee collection period by ID
const getDotThuById = async (req, res) => {
  try {
    const { id } = req.params;

    const dotThu = await db.DotThu.findByPk(id, {
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu',
        through: { attributes: ['soTien'] }
      }]
    });

    if (!dotThu) {
      return res.status(404).json({
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    const formattedDotThu = {
      id: dotThu.id,
      tenDotThu: dotThu.tenDotThu,
      ngayTao: dotThu.ngayTao,
      thoiHan: dotThu.thoiHan,
      createdAt: dotThu.createdAt,
      updatedAt: dotThu.updatedAt,
      khoanThu: dotThu.khoanThu
    };

    return res.status(200).json(formattedDotThu);

  } catch (error) {
    console.error('Error getting fee collection period:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy thông tin đợt thu phí',
      error: error.message
    });
  }
};

// Create new fee collection period
const createDotThu = async (req, res) => {
  try {
    const { tenDotThu, ngayTao, thoiHan, khoanThu } = req.body;

    // Validate required fields
    if (!tenDotThu || !ngayTao || !thoiHan) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: tenDotThu, ngayTao, thoiHan'
      });
    }

    // Create the fee collection period
    const newDotThu = await db.DotThu.create({
      tenDotThu,
      ngayTao: new Date(ngayTao),
      thoiHan: new Date(thoiHan)
    });

    // Add fee types to the collection period if provided
    if (khoanThu && Array.isArray(khoanThu) && khoanThu.length > 0) {
      const dotThuKhoanThuData = khoanThu.map(kt => ({
        dotThuId: newDotThu.id,
        khoanThuId: kt.khoanThuId,
        soTien: kt.soTien || 0
      }));

      await db.DotThu_KhoanThu.bulkCreate(dotThuKhoanThuData);
      
      // Get the fee types for calculation
      const selectedKhoanThu = await db.KhoanThu.findAll({
        where: {
          id: khoanThu.map(kt => kt.khoanThuId)
        }
      });

      // Create household fees automatically
      await feeCalculationService.createHouseholdFeesForDotThu(newDotThu.id, selectedKhoanThu);
    } else {
      // If no specific fee types provided, create fees for all mandatory types
      await feeCalculationService.createHouseholdFeesForDotThu(newDotThu.id);
    }

    // Fetch the created period with associations
    const createdDotThu = await db.DotThu.findByPk(newDotThu.id, {
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu',
        through: { attributes: ['soTien'] }
      }]
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo đợt thu phí thành công',
      data: createdDotThu
    });

  } catch (error) {
    console.error('Error creating fee collection period:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đợt thu phí',
      error: error.message
    });
  }
};

// Update fee collection period
const updateDotThu = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenDotThu, ngayTao, thoiHan, khoanThu } = req.body;

    const dotThu = await db.DotThu.findByPk(id);
    if (!dotThu) {
      return res.status(404).json({
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    // Check if period is closed and prevent modifications
    if (dotThu.trangThai === 'DA_DONG' || dotThu.trangThai === 'HOAN_THANH') {
      return res.status(400).json({
        success: false,
        message: 'Không thể chỉnh sửa đợt thu phí đã đóng hoặc hoàn thành. Vui lòng mở lại đợt thu trước khi chỉnh sửa.'
      });
    }

    // Update basic info
    await dotThu.update({
      tenDotThu: tenDotThu || dotThu.tenDotThu,
      ngayTao: ngayTao ? new Date(ngayTao) : dotThu.ngayTao,
      thoiHan: thoiHan ? new Date(thoiHan) : dotThu.thoiHan
    });

    // Update fee types if provided
    if (khoanThu && Array.isArray(khoanThu)) {
      // Remove existing associations
      await db.DotThu_KhoanThu.destroy({
        where: { dotThuId: id }
      });

      // Add new associations
      if (khoanThu.length > 0) {
        const dotThuKhoanThuData = khoanThu.map(kt => ({
          dotThuId: id,
          khoanThuId: kt.khoanThuId,
          soTien: kt.soTien || 0
        }));

        await db.DotThu_KhoanThu.bulkCreate(dotThuKhoanThuData);
      }
    }

    // Fetch updated period with associations
    const updatedDotThu = await db.DotThu.findByPk(id, {
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu',
        through: { attributes: ['soTien'] }
      }]
    });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật đợt thu phí thành công',
      data: updatedDotThu
    });

  } catch (error) {
    console.error('Error updating fee collection period:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật đợt thu phí',
      error: error.message
    });
  }
};

// Delete fee collection period
const deleteDotThu = async (req, res) => {
  try {
    const { id } = req.params;

    const dotThu = await db.DotThu.findByPk(id);
    if (!dotThu) {
      return res.status(404).json({
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    // Delete associations first
    await db.DotThu_KhoanThu.destroy({
      where: { dotThuId: id }
    });

    // Delete the fee collection period
    await dotThu.destroy();

    return res.status(200).json({
      success: true,
      message: 'Xóa đợt thu phí thành công'
    });

  } catch (error) {
    console.error('Error deleting fee collection period:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa đợt thu phí',
      error: error.message
    });
  }
};

// Get fee collection statistics
const getDotThuStatistics = async (req, res) => {
  try {
    const { dotThuId } = req.query;

    let whereConditions = {};
    if (dotThuId) {
      whereConditions.id = dotThuId;
    }

    // Get total collection periods
    const totalDotThu = await db.DotThu.count({
      where: whereConditions
    });

    // Get active collection periods (not yet expired)
    const activeDotThu = await db.DotThu.count({
      where: {
        ...whereConditions,
        thoiHan: {
          [Op.gte]: new Date()
        }
      }
    });

    // Get expired collection periods
    const expiredDotThu = await db.DotThu.count({
      where: {
        ...whereConditions,
        thoiHan: {
          [Op.lt]: new Date()
        }
      }
    });

    return res.status(200).json({
      totalDotThu,
      activeDotThu,
      expiredDotThu
    });

  } catch (error) {
    console.error('Error getting fee collection statistics:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy thống kê đợt thu phí',
      error: error.message
    });
  }
};

// Get payment information for a specific fee period and household
const getPaymentInfo = async (req, res) => {
  try {
    const { dotThuId, hoKhauId } = req.params;
    
    // Get fee period information
    const dotThu = await db.DotThu.findByPk(dotThuId, {
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu',
        through: { attributes: ['soTien'] }
      }]
    });
    
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu phí'
      });
    }
    
    // Get household information
    const hoKhau = await db.HoKhau.findByPk(hoKhauId, {
      include: [{
        model: db.NhanKhau,
        as: 'chuHoInfo'
      }]
    });
    
    if (!hoKhau) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu'
      });
    }
    
    // Get existing payments for this household in this period
    const payments = await db.ThanhToan.findAll({
      where: {
        dotThuId,
        hoKhauId
      },
      include: [
        {
          model: db.KhoanThu,
          as: 'khoanThu'
        },
        {
          model: db.NhanKhau,
          as: 'nguoiNop'
        }
      ]
    });
    
    // Create payment summary for each fee item
    const khoanThuList = dotThu.khoanThu.map(khoan => {
      const payment = payments.find(p => p.khoanThuId === khoan.id);
      return {
        id: khoan.id,
        tenKhoan: khoan.tenKhoan,
        loaiKhoan: khoan.loaiKhoan,
        batBuoc: khoan.batBuoc,
        ghiChu: khoan.ghiChu,
        soTienMacDinh: khoan.DotThu_KhoanThu?.soTien || 0,
        trangThaiThanhToan: payment ? {
          daNop: true,
          soTien: payment.soTien,
          ngayNop: payment.ngayNop,
          nguoiNop: payment.nguoiNop.hoTen,
          hinhThucNop: payment.hinhThucNop,
          ghiChu: payment.ghiChu
        } : {
          daNop: false,
          soTien: 0
        }
      };
    });
    
    res.json({
      success: true,
      data: {
        dotThu: {
          id: dotThu.id,
          tenDotThu: dotThu.tenDotThu,
          ngayTao: dotThu.ngayTao,
          thoiHan: dotThu.thoiHan
        },
        hoKhau: {
          soHoKhau: hoKhau.soHoKhau,
          diaChi: hoKhau.diaChi,
          chuHo: hoKhau.chuHoInfo?.hoTen || 'Chưa có thông tin'
        },
        khoanThuList
      }
    });
    
  } catch (error) {
    console.error('Error getting payment info:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Record a new payment
const recordPayment = async (req, res) => {
  try {
    const { 
      dotThuId, 
      khoanThuId, 
      hoKhauId, 
      nguoiNopId, 
      soTien, 
      ngayNop,
      hinhThucNop = 'TIEN_MAT',
      ghiChu 
    } = req.body;
    
    // Validate required fields
    if (!dotThuId || !khoanThuId || !hoKhauId || !nguoiNopId || !soTien) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Check if the fee collection period is closed
    const dotThu = await db.DotThu.findByPk(dotThuId);
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    if (dotThu.trangThai === 'DA_DONG' || dotThu.trangThai === 'HOAN_THANH') {
      return res.status(400).json({
        success: false,
        message: 'Không thể thêm thanh toán vào đợt thu phí đã đóng hoặc hoàn thành'
      });
    }
    
    // Check if payment already exists
    const existingPayment = await db.ThanhToan.findOne({
      where: {
        dotThuId,
        khoanThuId,
        hoKhauId
      }
    });
    
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Hộ khẩu này đã nộp khoản thu này rồi'
      });
    }
    
    // Create new payment record
    const payment = await db.ThanhToan.create({
      dotThuId,
      khoanThuId,
      hoKhauId,
      nguoiNopId,
      soTien,
      ngayNop: ngayNop || new Date(),
      hinhThucNop,
      ghiChu,
      nguoiTaoId: req.user?.id // From auth middleware
    });
    
    // Get payment with related data
    const fullPayment = await db.ThanhToan.findByPk(payment.id, {
      include: [
        {
          model: db.DotThu,
          as: 'dotThu'
        },
        {
          model: db.KhoanThu,
          as: 'khoanThu'
        },
        {
          model: db.HoKhau,
          as: 'hoKhau',
          include: [{
            model: db.NhanKhau,
            as: 'chuHoInfo'
          }]
        },
        {
          model: db.NhanKhau,
          as: 'nguoiNop'
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Ghi nhận thanh toán thành công',
      data: fullPayment
    });
    
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Get payment statistics for a fee period
const getPaymentStatistics = async (req, res) => {
  try {
    const { dotThuId } = req.params;
    
    // Get all households
    const totalHouseholds = await db.HoKhau.count();
    
    // Get fee items for this period
    const dotThu = await db.DotThu.findByPk(dotThuId, {
      include: [{
        model: db.KhoanThu,
        as: 'khoanThu',
        through: { attributes: ['soTien'] }
      }]
    });
    
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu phí'
      });
    }
    
    // Calculate statistics for each fee item
    const khoanThuStats = await Promise.all(
      dotThu.khoanThu.map(async (khoan) => {
        const paidCount = await db.ThanhToan.count({
          where: {
            dotThuId,
            khoanThuId: khoan.id
          }
        });
        
        const totalPaid = await db.ThanhToan.sum('soTien', {
          where: {
            dotThuId,
            khoanThuId: khoan.id
          }
        }) || 0;
        
        const expectedTotal = (khoan.DotThu_KhoanThu?.soTien || 0) * totalHouseholds;
        
        return {
          id: khoan.id,
          tenKhoan: khoan.tenKhoan,
          loaiKhoan: khoan.loaiKhoan,
          batBuoc: khoan.batBuoc,
          soTienMacDinh: khoan.DotThu_KhoanThu?.soTien || 0,
          tongHoDaNop: paidCount,
          tongHoChuaNop: totalHouseholds - paidCount,
          tongSoTienDaThu: totalPaid,
          tongSoTienDuKien: expectedTotal,
          tiLeThuPhiPhanTram: totalHouseholds > 0 ? Math.round((paidCount / totalHouseholds) * 100) : 0
        };
      })
    );
    
    const totalPaidAmount = khoanThuStats.reduce((sum, khoan) => sum + khoan.tongSoTienDaThu, 0);
    const totalExpectedAmount = khoanThuStats.reduce((sum, khoan) => sum + khoan.tongSoTienDuKien, 0);
    
    res.json({
      success: true,
      data: {
        dotThu: {
          id: dotThu.id,
          tenDotThu: dotThu.tenDotThu,
          ngayTao: dotThu.ngayTao,
          thoiHan: dotThu.thoiHan
        },
        thongKeTongQuat: {
          tongSoHo: totalHouseholds,
          tongSoTienDaThu: totalPaidAmount,
          tongSoTienDuKien: totalExpectedAmount,
          tiLeThuPhiTongQuat: totalExpectedAmount > 0 ? Math.round((totalPaidAmount / totalExpectedAmount) * 100) : 0
        },
        khoanThuStats
      }
    });
    
  } catch (error) {
    console.error('Error getting payment statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Manual closure/reopening functions
const closeDotThu = async (req, res) => {
  try {
    const { id } = req.params;

    const dotThu = await db.DotThu.findByPk(id);
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    // Update status to closed
    await dotThu.update({
      trangThai: 'DA_DONG',
      dongTuDong: false // Mark as manually closed
    });

    return res.status(200).json({
      success: true,
      message: 'Đã đóng đợt thu phí thành công',
      data: dotThu
    });

  } catch (error) {
    console.error('Error closing fee collection period:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi đóng đợt thu phí',
      error: error.message
    });
  }
};

const reopenDotThu = async (req, res) => {
  try {
    const { id } = req.params;

    const dotThu = await db.DotThu.findByPk(id);
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    // Update status to open
    await dotThu.update({
      trangThai: 'DANG_MO',
      dongTuDong: false // Mark as manually opened
    });

    return res.status(200).json({
      success: true,
      message: 'Đã mở lại đợt thu phí thành công',
      data: dotThu
    });

  } catch (error) {
    console.error('Error reopening fee collection period:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi mở lại đợt thu phí',
      error: error.message
    });
  }
};

const markCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const dotThu = await db.DotThu.findByPk(id);
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    // Update status to completed
    await dotThu.update({
      trangThai: 'HOAN_THANH',
      dongTuDong: false // Mark as manually completed
    });

    return res.status(200).json({
      success: true,
      message: 'Đã đánh dấu đợt thu phí hoàn thành',
      data: dotThu
    });

  } catch (error) {
    console.error('Error marking fee collection period as completed:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi đánh dấu hoàn thành đợt thu phí',
      error: error.message
    });
  }
};

// Auto-closure function (can be called by cron job)
const autoCloseDotThu = async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Find all open periods that should be auto-closed
    const openPeriods = await db.DotThu.findAll({
      where: {
        trangThai: 'DANG_MO',
        dongTuDong: true,
        thoiHan: {
          [Op.lt]: currentDate
        }
      }
    });

    let closedCount = 0;
    for (const dotThu of openPeriods) {
      // Calculate completion rate to determine if it should be marked as completed or just closed
      const totalHouseholds = await db.HoKhau.count();
      
      // Count paid households for this period
      const paidHouseholds = await db.ThanhToan.count({
        where: { dotThuId: dotThu.id },
        distinct: true,
        col: 'hoKhauId'
      });

      const completionRate = totalHouseholds > 0 ? (paidHouseholds / totalHouseholds) : 0;
      
      // Mark as completed if 100% paid, otherwise just closed
      const newStatus = completionRate >= 1.0 ? 'HOAN_THANH' : 'DA_DONG';
      
      await dotThu.update({ trangThai: newStatus });
      closedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Đã tự động đóng ${closedCount} đợt thu phí`,
      closedCount
    });

  } catch (error) {
    console.error('Error auto-closing fee collection periods:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tự động đóng đợt thu phí',
      error: error.message
    });
  }
};

module.exports = {
  getAllDotThu,
  getAllDotThuWithKhoanThu,
  getDotThuById,
  createDotThu,
  updateDotThu,
  deleteDotThu,
  getDotThuStatistics,
  getPaymentInfo,
  recordPayment,
  getPaymentStatistics,
  closeDotThu,
  reopenDotThu,
  markCompleted,
  autoCloseDotThu
};
