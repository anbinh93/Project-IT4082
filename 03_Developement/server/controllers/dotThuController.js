const db = require('../db/models');
const { Op } = require('sequelize');

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
      message: 'Tạo đợt thu phí thành công',
      dotThu: createdDotThu
    });

  } catch (error) {
    console.error('Error creating fee collection period:', error);
    return res.status(500).json({
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
      message: 'Cập nhật đợt thu phí thành công',
      dotThu: updatedDotThu
    });

  } catch (error) {
    console.error('Error updating fee collection period:', error);
    return res.status(500).json({
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
      message: 'Xóa đợt thu phí thành công'
    });

  } catch (error) {
    console.error('Error deleting fee collection period:', error);
    return res.status(500).json({
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

module.exports = {
  getAllDotThu,
  getDotThuById,
  createDotThu,
  updateDotThu,
  deleteDotThu,
  getDotThuStatistics
};
