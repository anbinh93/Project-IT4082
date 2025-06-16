const db = require('../db/models');

// Get all KhoanThu
const getAllKhoanThu = async (req, res) => {
  try {
    const khoanThuList = await db.KhoanThu.findAll({
      order: [['id', 'ASC']]
    });

    const formattedKhoanThu = khoanThuList.map(khoan => ({
      id: khoan.id,
      tenKhoan: khoan.tenkhoanthu,
      batBuoc: khoan.batbuoc,
      ghiChu: khoan.ghichu,
      soTienToiThieu: khoan.soTienToiThieu || 0, // Include minimum amount
      ngayTao: khoan.ngaytao,
      thoiHan: khoan.thoihan,
      createdAt: khoan.createdAt,
      updatedAt: khoan.updatedAt
    }));

    return res.status(200).json({
      success: true,
      data: formattedKhoanThu
    });

  } catch (error) {
    console.error('Error getting KhoanThu:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khoản thu',
      error: error.message
    });
  }
};

// Get KhoanThu by ID
const getKhoanThuById = async (req, res) => {
  try {
    const { id } = req.params;

    const khoanThu = await db.KhoanThu.findByPk(id);
    
    if (!khoanThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    const formattedKhoanThu = {
      id: khoanThu.id,
      tenKhoan: khoanThu.tenkhoanthu,
      batBuoc: khoanThu.batbuoc,
      ghiChu: khoanThu.ghichu,
      soTienToiThieu: khoanThu.soTienToiThieu || 0, // Include minimum amount
      ngayTao: khoanThu.ngaytao,
      thoiHan: khoanThu.thoihan,
      createdAt: khoanThu.createdAt,
      updatedAt: khoanThu.updatedAt
    };

    return res.status(200).json({
      success: true,
      data: formattedKhoanThu
    });

  } catch (error) {
    console.error('Error getting KhoanThu by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin khoản thu',
      error: error.message
    });
  }
};

// Create new KhoanThu
const createKhoanThu = async (req, res) => {
  try {
    const { tenKhoan, batBuoc, ghiChu, thoiHan, soTienToiThieu } = req.body;

    if (!tenKhoan) {
      return res.status(400).json({
        success: false,
        message: 'Tên khoản thu là bắt buộc'
      });
    }

    const khoanThu = await db.KhoanThu.create({
      tenkhoanthu: tenKhoan,
      batbuoc: batBuoc || false,
      ghichu: ghiChu,
      soTienToiThieu: soTienToiThieu || 0, // Add minimum amount field
      ngaytao: new Date(),
      thoihan: thoiHan
    });

    const formattedKhoanThu = {
      id: khoanThu.id,
      tenKhoan: khoanThu.tenkhoanthu,
      batBuoc: khoanThu.batbuoc,
      ghiChu: khoanThu.ghichu,
      soTienToiThieu: khoanThu.soTienToiThieu, // Include in response
      ngayTao: khoanThu.ngaytao,
      thoiHan: khoanThu.thoihan,
      createdAt: khoanThu.createdAt,
      updatedAt: khoanThu.updatedAt
    };

    console.log('📋 Formatted response data:', {
      soTienToiThieu: formattedKhoanThu.soTienToiThieu,
      soTienToiThieuType: typeof formattedKhoanThu.soTienToiThieu,
      fullFormatted: formattedKhoanThu
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo khoản thu thành công',
      data: formattedKhoanThu
    });

  } catch (error) {
    console.error('Error creating KhoanThu:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo khoản thu',
      error: error.message
    });
  }
};

// Update KhoanThu
const updateKhoanThu = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenKhoan, batBuoc, ghiChu, thoiHan, soTienToiThieu } = req.body;

    const khoanThu = await db.KhoanThu.findByPk(id);
    
    if (!khoanThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    await khoanThu.update({
      tenkhoanthu: tenKhoan || khoanThu.tenkhoanthu,
      batbuoc: batBuoc !== undefined ? batBuoc : khoanThu.batbuoc,
      ghichu: ghiChu !== undefined ? ghiChu : khoanThu.ghichu,
      soTienToiThieu: soTienToiThieu !== undefined ? soTienToiThieu : khoanThu.soTienToiThieu,
      thoihan: thoiHan !== undefined ? thoiHan : khoanThu.thoihan
    });

    const formattedKhoanThu = {
      id: khoanThu.id,
      tenKhoan: khoanThu.tenkhoanthu,
      batBuoc: khoanThu.batbuoc,
      ghiChu: khoanThu.ghichu,
      soTienToiThieu: khoanThu.soTienToiThieu || 0, // Include minimum amount
      ngayTao: khoanThu.ngaytao,
      thoiHan: khoanThu.thoihan,
      createdAt: khoanThu.createdAt,
      updatedAt: khoanThu.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Cập nhật khoản thu thành công',
      data: formattedKhoanThu
    });

  } catch (error) {
    console.error('Error updating KhoanThu:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật khoản thu',
      error: error.message
    });
  }
};

// Delete KhoanThu
const deleteKhoanThu = async (req, res) => {
  try {
    const { id } = req.params;

    const khoanThu = await db.KhoanThu.findByPk(id);
    
    if (!khoanThu) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    await khoanThu.destroy();

    return res.status(200).json({
      success: true,
      message: 'Xóa khoản thu thành công'
    });

  } catch (error) {
    console.error('Error deleting KhoanThu:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa khoản thu',
      error: error.message
    });
  }
};

module.exports = {
  getAllKhoanThu,
  getKhoanThuById,
  createKhoanThu,
  updateKhoanThu,
  deleteKhoanThu
};
