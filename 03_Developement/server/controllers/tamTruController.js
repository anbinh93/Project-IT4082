const db = require('../db/models');
const { Op } = require('sequelize');

// Get all temporary residence records
const getAllTamTru = async (req, res) => {
  try {
    const {
      page = 0,
      size = 10,
      sortBy = 'createdAt',
      sortDir = 'desc',
      search,
      trangThai
    } = req.query;

    let whereConditions = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { trangThai: { [Op.iLike]: `%${search}%` } },
        { diaChi: { [Op.iLike]: `%${search}%` } },
        { noiDungDeNghi: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (trangThai) {
      whereConditions.trangThai = trangThai;
    }

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows: tamTruRecords } = await db.TamTruTamVang.findAndCountAll({
      where: whereConditions,
      include: [{
        model: db.NhanKhau,
        as: 'nhanKhau',
        attributes: ['id', 'hoTen', 'cccd', 'ngaySinh']
      }],
      order: [[sortBy, sortDir.toUpperCase()]],
      offset,
      limit
    });

    // Format response
    const formattedRecords = tamTruRecords.map(record => ({
      id: record.id,
      nhanKhauId: record.nhanKhauId,
      trangThai: record.trangThai,
      diaChi: record.diaChi,
      thoiGian: record.thoiGian,
      noiDungDeNghi: record.noiDungDeNghi,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      nhanKhau: record.nhanKhau
    }));

    return res.status(200).json({
      tamTruRecords: formattedRecords,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(size),
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(size))
      }
    });

  } catch (error) {
    console.error('Error getting temporary residence records:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy danh sách tạm trú/tạm vắng',
      error: error.message
    });
  }
};

// Get temporary residence record by ID
const getTamTruById = async (req, res) => {
  try {
    const { id } = req.params;

    const tamTruRecord = await db.TamTruTamVang.findByPk(id, {
      include: [{
        model: db.NhanKhau,
        as: 'nhanKhau',
        attributes: ['id', 'hoTen', 'cccd', 'ngaySinh', 'gioiTinh']
      }]
    });

    if (!tamTruRecord) {
      return res.status(404).json({
        message: 'Không tìm thấy bản ghi tạm trú/tạm vắng'
      });
    }

    const formattedRecord = {
      id: tamTruRecord.id,
      nhanKhauId: tamTruRecord.nhanKhauId,
      trangThai: tamTruRecord.trangThai,
      diaChi: tamTruRecord.diaChi,
      thoiGian: tamTruRecord.thoiGian,
      noiDungDeNghi: tamTruRecord.noiDungDeNghi,
      createdAt: tamTruRecord.createdAt,
      updatedAt: tamTruRecord.updatedAt,
      nhanKhau: tamTruRecord.nhanKhau
    };

    return res.status(200).json(formattedRecord);

  } catch (error) {
    console.error('Error getting temporary residence record:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy thông tin tạm trú/tạm vắng',
      error: error.message
    });
  }
};

// Create new temporary residence record
const createTamTru = async (req, res) => {
  try {
    const { nhanKhauId, trangThai, diaChi, tuNgay, thoiGian, noiDungDeNghi } = req.body;

    // Validate required fields
    if (!nhanKhauId || !trangThai || !diaChi || !tuNgay || !thoiGian) {
      return res.status(400).json({
        message: 'Thiếu thông tin bắt buộc: nhanKhauId, trangThai, diaChi, tuNgay, thoiGian'
      });
    }

    // Validate resident exists
    const nhanKhau = await db.NhanKhau.findByPk(nhanKhauId);
    if (!nhanKhau) {
      return res.status(404).json({
        message: 'Không tìm thấy nhân khẩu'
      });
    }

    // Validate trangThai
    const validStates = ['đang tạm trú', 'đã kết thúc', 'tạm vắng'];
    if (!validStates.includes(trangThai)) {
      return res.status(400).json({
        message: 'Trạng thái không hợp lệ. Chỉ chấp nhận: đang tạm trú, đã kết thúc, tạm vắng'
      });
    }

    // Create the temporary residence record
    const newTamTru = await db.TamTruTamVang.create({
      nhanKhauId,
      trangThai,
      diaChi,
      tuNgay: new Date(tuNgay),
      thoiGian: new Date(thoiGian),
      noiDungDeNghi
    });

    // Fetch the created record with associations
    const createdTamTru = await db.TamTruTamVang.findByPk(newTamTru.id, {
      include: [{
        model: db.NhanKhau,
        as: 'nhanKhau',
        attributes: ['id', 'hoTen', 'cccd', 'ngaySinh']
      }]
    });

    return res.status(201).json({
      message: 'Tạo bản ghi tạm trú/tạm vắng thành công',
      tamTruRecord: createdTamTru
    });

  } catch (error) {
    console.error('Error creating temporary residence record:', error);
    return res.status(500).json({
      message: 'Lỗi server khi tạo bản ghi tạm trú/tạm vắng',
      error: error.message
    });
  }
};

// Update temporary residence record
const updateTamTru = async (req, res) => {
  try {
    const { id } = req.params;
    const { nhanKhauId, trangThai, diaChi, thoiGian, noiDungDeNghi } = req.body;

    const tamTruRecord = await db.TamTruTamVang.findByPk(id);
    if (!tamTruRecord) {
      return res.status(404).json({
        message: 'Không tìm thấy bản ghi tạm trú/tạm vắng'
      });
    }

    // Validate nhanKhauId if provided
    if (nhanKhauId) {
      const nhanKhau = await db.NhanKhau.findByPk(nhanKhauId);
      if (!nhanKhau) {
        return res.status(404).json({
          message: 'Không tìm thấy nhân khẩu'
        });
      }
    }

    // Validate trangThai if provided
    if (trangThai) {
      const validStates = ['đang tạm trú', 'đã kết thúc', 'tạm vắng'];
      if (!validStates.includes(trangThai)) {
        return res.status(400).json({
          message: 'Trạng thái không hợp lệ. Chỉ chấp nhận: đang tạm trú, đã kết thúc, tạm vắng'
        });
      }
    }

    // Update the record
    await tamTruRecord.update({
      nhanKhauId: nhanKhauId || tamTruRecord.nhanKhauId,
      trangThai: trangThai || tamTruRecord.trangThai,
      diaChi: diaChi !== undefined ? diaChi : tamTruRecord.diaChi,
      thoiGian: thoiGian ? new Date(thoiGian) : tamTruRecord.thoiGian,
      noiDungDeNghi: noiDungDeNghi !== undefined ? noiDungDeNghi : tamTruRecord.noiDungDeNghi
    });

    // Fetch updated record with associations
    const updatedTamTru = await db.TamTruTamVang.findByPk(id, {
      include: [{
        model: db.NhanKhau,
        as: 'nhanKhau',
        attributes: ['id', 'hoTen', 'cccd', 'ngaySinh']
      }]
    });

    return res.status(200).json({
      message: 'Cập nhật bản ghi tạm trú/tạm vắng thành công',
      tamTruRecord: updatedTamTru
    });

  } catch (error) {
    console.error('Error updating temporary residence record:', error);
    return res.status(500).json({
      message: 'Lỗi server khi cập nhật bản ghi tạm trú/tạm vắng',
      error: error.message
    });
  }
};

// Delete temporary residence record
const deleteTamTru = async (req, res) => {
  try {
    const { id } = req.params;

    const tamTruRecord = await db.TamTruTamVang.findByPk(id);
    if (!tamTruRecord) {
      return res.status(404).json({
        message: 'Không tìm thấy bản ghi tạm trú/tạm vắng'
      });
    }

    await tamTruRecord.destroy();

    return res.status(200).json({
      message: 'Xóa bản ghi tạm trú/tạm vắng thành công'
    });

  } catch (error) {
    console.error('Error deleting temporary residence record:', error);
    return res.status(500).json({
      message: 'Lỗi server khi xóa bản ghi tạm trú/tạm vắng',
      error: error.message
    });
  }
};

// Get temporary residence statistics
const getTamTruStatistics = async (req, res) => {
  try {
    // Get total records
    const totalRecords = await db.TamTruTamVang.count();

    // Get records by status
    const statusStats = await db.TamTruTamVang.findAll({
      attributes: [
        'trangThai',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['trangThai']
    });

    // Get monthly statistics (last 12 months)
    const monthlyStats = await db.TamTruTamVang.findAll({
      attributes: [
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('YEAR FROM "createdAt"')), 'year'],
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM "createdAt"')), 'month'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1)
        }
      },
      group: [
        db.sequelize.fn('EXTRACT', db.sequelize.literal('YEAR FROM "createdAt"')),
        db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM "createdAt"'))
      ],
      order: [
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('YEAR FROM "createdAt"')), 'ASC'],
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM "createdAt"')), 'ASC']
      ]
    });

    return res.status(200).json({
      totalRecords,
      statusBreakdown: statusStats.map(stat => ({
        status: stat.trangThai,
        count: parseInt(stat.dataValues.count)
      })),
      monthlyStats: monthlyStats.map(stat => ({
        year: parseInt(stat.dataValues.year),
        month: parseInt(stat.dataValues.month),
        count: parseInt(stat.dataValues.count)
      }))
    });

  } catch (error) {
    console.error('Error getting temporary residence statistics:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy thống kê tạm trú/tạm vắng',
      error: error.message
    });
  }
};

module.exports = {
  getAllTamTru,
  getTamTruById,
  createTamTru,
  updateTamTru,
  deleteTamTru,
  getTamTruStatistics
};
