const db = require('../db/models');
const { Op } = require('sequelize');
const feeCalculationService = require('../services/feeCalculationService');

/**
 * Controller để quản lý khoản thu của hộ gia đình
 */

// Lấy danh sách khoản thu theo đợt thu
const getHouseholdFeesByDotThu = async (req, res) => {
  try {
    const { dotThuId } = req.params;
    const {
      page = 0,
      size = 10,
      sortBy = 'createdAt',
      sortDir = 'desc',
      khoanThuId,
      trangThai,
      hoKhauId
    } = req.query;

    let whereConditions = { dotThuId };
    
    if (khoanThuId) {
      whereConditions.khoanThuId = khoanThuId;
    }
    
    if (trangThai) {
      whereConditions.trangThai = trangThai;
    }
    
    if (hoKhauId) {
      whereConditions.hoKhauId = hoKhauId;
    }

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows: householdFees } = await db.HouseholdFee.findAndCountAll({
      where: whereConditions,
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
        }
      ],
      order: [[sortBy, sortDir.toUpperCase()]],
      offset,
      limit
    });

    const formattedFees = householdFees.map(fee => ({
      id: fee.id,
      dotThu: {
        id: fee.dotThu.id,
        tenDotThu: fee.dotThu.tenDotThu
      },
      khoanThu: {
        id: fee.khoanThu.id,
        tenkhoanthu: fee.khoanThu.tenkhoanthu,
        batbuoc: fee.khoanThu.batbuoc
      },
      hoKhau: {
        soHoKhau: fee.hoKhau.soHoKhau,
        chuHo: fee.hoKhau.chuHoInfo?.hoTen || 'Chưa có thông tin',
        diaChi: `${fee.hoKhau.soNha} ${fee.hoKhau.duong}, ${fee.hoKhau.phuong}`
      },
      soTien: fee.soTien,
      soTienDaNop: fee.soTienDaNop,
      trangThai: fee.trangThai,
      ghiChu: fee.ghiChu,
      chiTietTinhPhi: fee.chiTietTinhPhi,
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt
    }));

    return res.status(200).json({
      success: true,
      data: formattedFees,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(size),
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(size))
      }
    });

  } catch (error) {
    console.error('Error getting household fees:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khoản thu',
      error: error.message
    });
  }
};

// Lấy dashboard khoản thu theo đợt thu (nhóm theo khoản thu)
const getDashboardByDotThu = async (req, res) => {
  try {
    const { dotThuId } = req.params;

    // Lấy thông tin đợt thu
    const dotThu = await db.DotThu.findByPk(dotThuId);
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu phí'
      });
    }

    // Lấy tất cả khoản thu trong đợt thu này
    const khoanThuStats = await db.sequelize.query(`
      SELECT 
        kt.id as khoan_thu_id,
        kt.tenkhoanthu,
        kt.batbuoc,
        kt.ghichu,
        COUNT(hf.id) as tong_ho_khau,
        COUNT(CASE WHEN hf."trangThai" = 'da_nop_du' THEN 1 END) as ho_da_nop,
        COUNT(CASE WHEN hf."trangThai" = 'nop_mot_phan' THEN 1 END) as ho_nop_mot_phan,
        COUNT(CASE WHEN hf."trangThai" = 'chua_nop' THEN 1 END) as ho_chua_nop,
        COALESCE(SUM(hf."soTien"), 0) as tong_tien_du_kien,
        COALESCE(SUM(hf."soTienDaNop"), 0) as tong_tien_da_thu
      FROM "KhoanThu" kt
      LEFT JOIN "HouseholdFees" hf ON kt.id = hf."khoanThuId" AND hf."dotThuId" = :dotThuId
      WHERE EXISTS (
        SELECT 1 FROM "HouseholdFees" hf2 
        WHERE hf2."khoanThuId" = kt.id AND hf2."dotThuId" = :dotThuId
      )
      GROUP BY kt.id, kt.tenkhoanthu, kt.batbuoc, kt.ghichu
      ORDER BY kt.tenkhoanthu
    `, {
      replacements: { dotThuId },
      type: db.sequelize.QueryTypes.SELECT
    });

    const formattedStats = khoanThuStats.map(stat => ({
      khoanThuId: stat.khoan_thu_id,
      tenKhoanThu: stat.tenkhoanthu,
      batBuoc: stat.batbuoc,
      ghiChu: stat.ghichu,
      thongKe: {
        tongHoKhau: parseInt(stat.tong_ho_khau),
        hoDaNop: parseInt(stat.ho_da_nop),
        hoNopMotPhan: parseInt(stat.ho_nop_mot_phan),
        hoChuaNop: parseInt(stat.ho_chua_nop),
        tyLeHoanThanh: stat.tong_ho_khau > 0 ? 
          Math.round((parseInt(stat.ho_da_nop) / parseInt(stat.tong_ho_khau)) * 100) : 0
      },
      taiChinh: {
        tongTienDuKien: parseFloat(stat.tong_tien_du_kien),
        tongTienDaThu: parseFloat(stat.tong_tien_da_thu),
        tyLeThuTien: stat.tong_tien_du_kien > 0 ? 
          Math.round((parseFloat(stat.tong_tien_da_thu) / parseFloat(stat.tong_tien_du_kien)) * 100) : 0
      }
    }));

    // Tính tổng kết
    const tongKet = formattedStats.reduce((acc, stat) => {
      acc.tongHoKhau = Math.max(acc.tongHoKhau, stat.thongKe.tongHoKhau);
      acc.tongTienDuKien += stat.taiChinh.tongTienDuKien;
      acc.tongTienDaThu += stat.taiChinh.tongTienDaThu;
      return acc;
    }, { tongHoKhau: 0, tongTienDuKien: 0, tongTienDaThu: 0 });

    tongKet.tyLeThuTienTongQuat = tongKet.tongTienDuKien > 0 ? 
      Math.round((tongKet.tongTienDaThu / tongKet.tongTienDuKien) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        dotThu: {
          id: dotThu.id,
          tenDotThu: dotThu.tenDotThu,
          ngayTao: dotThu.ngayTao,
          thoiHan: dotThu.thoiHan
        },
        tongKet,
        khoanThuList: formattedStats
      }
    });

  } catch (error) {
    console.error('Error getting dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy dashboard',
      error: error.message
    });
  }
};

// Lấy danh sách hộ gia đình theo khoản thu cụ thể
const getHouseholdsByKhoanThu = async (req, res) => {
  try {
    const { dotThuId, khoanThuId } = req.params;
    const {
      page = 0,
      size = 20,
      trangThai
    } = req.query;

    let whereConditions = { 
      dotThuId,
      khoanThuId
    };
    
    if (trangThai) {
      whereConditions.trangThai = trangThai;
    }

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows: householdFees } = await db.HouseholdFee.findAndCountAll({
      where: whereConditions,
      include: [
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
        }
      ],
      order: [['trangThai', 'ASC']],
      offset,
      limit
    });

    const formattedData = householdFees.map(fee => ({
      id: fee.id,
      hoKhau: {
        soHoKhau: fee.hoKhau.soHoKhau,
        chuHo: fee.hoKhau.chuHoInfo?.hoTen || 'Chưa có thông tin',
        diaChi: `${fee.hoKhau.soNha} ${fee.hoKhau.duong}, ${fee.hoKhau.phuong}`,
        soDienThoai: fee.hoKhau.chuHoInfo?.soDienThoai || ''
      },
      soTien: fee.soTien,
      soTienDaNop: fee.soTienDaNop,
      soTienConLai: fee.soTien - fee.soTienDaNop,
      trangThai: fee.trangThai,
      trangThaiText: {
        'chua_nop': 'Chưa nộp',
        'nop_mot_phan': 'Nộp một phần',
        'da_nop_du': 'Đã nộp đủ'
      }[fee.trangThai],
      ghiChu: fee.ghiChu,
      chiTietTinhPhi: fee.chiTietTinhPhi,
      createdAt: fee.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: {
        khoanThu: householdFees[0]?.khoanThu ? {
          id: householdFees[0].khoanThu.id,
          tenkhoanthu: householdFees[0].khoanThu.tenkhoanthu,
          batbuoc: householdFees[0].khoanThu.batbuoc
        } : null,
        households: formattedData
      },
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(size),
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(size))
      }
    });

  } catch (error) {
    console.error('Error getting households by khoan thu:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách hộ gia đình',
      error: error.message
    });
  }
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { soTienThanhToan, ghiChu } = req.body;

    if (!soTienThanhToan || soTienThanhToan <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền thanh toán không hợp lệ'
      });
    }

    const householdFee = await db.HouseholdFee.findByPk(id, {
      include: [
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
        }
      ]
    });

    if (!householdFee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    // Sử dụng service để cập nhật trạng thái
    const updatedFee = await feeCalculationService.updatePaymentStatus(id, soTienThanhToan);

    // Tạo hoặc cập nhật bản ghi thanh toán trong bảng ThanhToan
    const [payment, created] = await db.ThanhToan.findOrCreate({
      where: {
        dotThuId: householdFee.dotThuId,
        khoanThuId: householdFee.khoanThuId,
        hoKhauId: householdFee.hoKhauId
      },
      defaults: {
        nguoiNopId: householdFee.hoKhau.chuHo, // Mặc định là chủ hộ
        soTien: soTienThanhToan,
        ngayNop: new Date(),
        hinhThucNop: 'TIEN_MAT',
        ghiChu: ghiChu || `Thanh toán ${householdFee.khoanThu.tenkhoanthu}`
      }
    });

    // Nếu đã tồn tại, cập nhật số tiền
    if (!created) {
      await payment.update({
        soTien: payment.soTien + soTienThanhToan,
        ngayNop: new Date(),
        ghiChu: ghiChu || `Cập nhật thanh toán ${householdFee.khoanThu.tenkhoanthu}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công',
      data: updatedFee
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái thanh toán',
      error: error.message,
      details: error.errors ? error.errors.map(e => ({ field: e.path, message: e.message })) : null
    });
  }
};

// Tính lại phí cho một hộ gia đình cụ thể
const recalculateFeeForHousehold = async (req, res) => {
  try {
    const { dotThuId, hoKhauId, khoanThuId } = req.params;

    // Lấy thông tin hộ gia đình
    const household = await db.HoKhau.findByPk(hoKhauId, {
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

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ gia đình'
      });
    }

    // Lấy thông tin khoản thu
    const khoanThu = await db.KhoanThu.findByPk(khoanThuId);
    if (!khoanThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    // Tính lại phí
    const feeCalculation = await feeCalculationService.calculateFeeForHousehold(household, khoanThu);

    // Cập nhật khoản thu hộ gia đình
    const [updatedRows] = await db.HouseholdFee.update({
      soTien: feeCalculation.amount,
      chiTietTinhPhi: feeCalculation.details,
      ghiChu: feeCalculation.note
    }, {
      where: {
        dotThuId,
        hoKhauId,
        khoanThuId
      }
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu cần cập nhật'
      });
    }

    // Lấy dữ liệu đã cập nhật
    const updatedFee = await db.HouseholdFee.findOne({
      where: { dotThuId, hoKhauId, khoanThuId },
      include: [
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
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Tính lại phí thành công',
      data: updatedFee
    });

  } catch (error) {
    console.error('Error recalculating fee:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tính lại phí',
      error: error.message
    });
  }
};

// Lấy tất cả khoản thu của hộ khẩu trong đợt thu (for NopNhanh popup)
const getHouseholdFeesByHousehold = async (req, res) => {
  try {
    const { hoKhauId, dotThuId } = req.params;

    // Validate parameters
    if (!hoKhauId || !dotThuId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin hộ khẩu hoặc đợt thu'
      });
    }

    // Check if HoKhau exists
    const hoKhau = await db.HoKhau.findByPk(hoKhauId);
    if (!hoKhau) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu'
      });
    }

    // Check if DotThu exists
    const dotThu = await db.DotThu.findByPk(dotThuId);
    if (!dotThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đợt thu'
      });
    }

    // Get all household fees for this household in this collection period
    const householdFees = await db.HouseholdFee.findAll({
      where: {
        hoKhauId: hoKhauId,
        dotThuId: dotThuId
      },
      include: [
        {
          model: db.KhoanThu,
          as: 'khoanThu'
        },
        {
          model: db.DotThu,
          as: 'dotThu'
        },
        {
          model: db.HoKhau,
          as: 'hoKhau',
          include: [{
            model: db.NhanKhau,
            as: 'chuHoInfo'
          }]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    const formattedFees = householdFees.map(fee => ({
      id: fee.id,
      khoanThu: {
        id: fee.khoanThu.id,
        tenkhoanthu: fee.khoanThu.tenkhoanthu,
        batbuoc: fee.khoanThu.batbuoc
      },
      soTien: parseFloat(fee.soTien || 0),
      soTienDaNop: parseFloat(fee.soTienDaNop || 0),
      trangThai: fee.trangThai,
      ghiChu: fee.ghiChu,
      chiTietTinhPhi: fee.chiTietTinhPhi,
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt
    }));

    return res.status(200).json({
      success: true,
      data: formattedFees,
      hoKhau: {
        id: hoKhau.id,
        soHoKhau: hoKhau.soHoKhau,
        chuHo: householdFees[0]?.hoKhau?.chuHoInfo?.hoTen || 'Chưa có thông tin',
        diaChi: `${hoKhau.soNha} ${hoKhau.duong}, ${hoKhau.phuong}`
      },
      dotThu: {
        id: dotThu.id,
        tenDotThu: dotThu.tenDotThu
      }
    });

  } catch (error) {
    console.error('Error getting household fees by household:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin khoản thu',
      error: error.message
    });
  }
};

module.exports = {
  getHouseholdFeesByDotThu,
  getDashboardByDotThu,
  getHouseholdsByKhoanThu,
  updatePaymentStatus,
  recalculateFeeForHousehold,
  getHouseholdFeesByHousehold
};
