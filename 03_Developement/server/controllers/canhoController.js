const db = require('../db/models');
const { Op } = require('sequelize');

// Get all apartments
const getAllCanho = async (req, res) => {
  try {
    const {
      page = 0,
      size = 10,
      sortBy = 'soPhong',
      sortDir = 'asc',
      search,
      occupied // filter by occupation status
    } = req.query;

    let whereConditions = {};
    
    if (search) {
      whereConditions.soPhong = {
        [Op.iLike]: `%${search}%`
      };
    }

    if (occupied !== undefined) {
      if (occupied === 'true') {
        whereConditions.hoKhauId = { [Op.ne]: null };
      } else if (occupied === 'false') {
        whereConditions.hoKhauId = { [Op.eq]: null };
      }
    }

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows: apartments } = await db.Canho.findAndCountAll({
      where: whereConditions,
      include: [{
        model: db.HoKhau,
        as: 'hoKhau',
        required: false,
        include: [{
          model: db.NhanKhau,
          as: 'chuHoInfo',
          attributes: ['id', 'hoTen', 'cccd']
        }]
      }],
      order: [[sortBy, sortDir.toUpperCase()]],
      offset,
      limit
    });

    // Format response
    const formattedApartments = apartments.map(apartment => ({
      id: apartment.id,
      soPhong: apartment.soPhong,
      hoKhauId: apartment.hoKhauId,
      dienTich: apartment.dienTich,
      createdAt: apartment.createdAt,
      updatedAt: apartment.updatedAt,
      hoKhau: apartment.hoKhau,
      isOccupied: apartment.hoKhauId !== null
    }));

    return res.status(200).json({
      apartments: formattedApartments,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(size),
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(size))
      }
    });

  } catch (error) {
    console.error('Error getting apartments:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy danh sách căn hộ',
      error: error.message
    });
  }
};

// Get apartment by ID
const getCanhoById = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await db.Canho.findByPk(id, {
      include: [{
        model: db.HoKhau,
        as: 'hoKhau',
        required: false,
        include: [{
          model: db.NhanKhau,
          as: 'chuHoInfo',
          attributes: ['id', 'hoTen', 'cccd', 'ngaySinh', 'gioiTinh']
        }]
      }]
    });

    if (!apartment) {
      return res.status(404).json({
        message: 'Không tìm thấy căn hộ'
      });
    }

    const formattedApartment = {
      id: apartment.id,
      soPhong: apartment.soPhong,
      hoKhauId: apartment.hoKhauId,
      dienTich: apartment.dienTich,
      createdAt: apartment.createdAt,
      updatedAt: apartment.updatedAt,
      hoKhau: apartment.hoKhau,
      isOccupied: apartment.hoKhauId !== null
    };

    return res.status(200).json(formattedApartment);

  } catch (error) {
    console.error('Error getting apartment:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy thông tin căn hộ',
      error: error.message
    });
  }
};

// Create new apartment
const createCanho = async (req, res) => {
  try {
    const { soPhong, hoKhauId, dienTich } = req.body;

    // Validate required fields
    if (!soPhong) {
      return res.status(400).json({
        message: 'Thiếu thông tin bắt buộc: soPhong'
      });
    }

    // Check if apartment number already exists
    const existingApartment = await db.Canho.findOne({
      where: { soPhong }
    });

    if (existingApartment) {
      return res.status(400).json({
        message: 'Số phòng đã tồn tại'
      });
    }

    // Validate household exists if provided
    if (hoKhauId) {
      const hoKhau = await db.HoKhau.findByPk(hoKhauId);
      if (!hoKhau) {
        return res.status(404).json({
          message: 'Không tìm thấy hộ khẩu'
        });
      }

      // Check if household already has an apartment
      const existingAssignment = await db.Canho.findOne({
        where: { hoKhauId }
      });

      if (existingAssignment) {
        return res.status(400).json({
          message: 'Hộ khẩu đã được gán căn hộ khác'
        });
      }
    }

    // Create the apartment
    const newApartment = await db.Canho.create({
      soPhong: parseInt(soPhong),
      hoKhauId: hoKhauId || null,
      dienTich: dienTich || null
    });

    // Fetch the created apartment with associations
    const createdApartment = await db.Canho.findByPk(newApartment.id, {
      include: [{
        model: db.HoKhau,
        as: 'hoKhau',
        required: false,
        include: [{
          model: db.NhanKhau,
          as: 'chuHoInfo',
          attributes: ['id', 'hoTen', 'cccd']
        }]
      }]
    });

    return res.status(201).json({
      message: 'Tạo căn hộ thành công',
      apartment: createdApartment
    });

  } catch (error) {
    console.error('Error creating apartment:', error);
    return res.status(500).json({
      message: 'Lỗi server khi tạo căn hộ',
      error: error.message
    });
  }
};

// Update apartment
const updateCanho = async (req, res) => {
  try {
    const { id } = req.params;
    const { soPhong, hoKhauId, dienTich } = req.body;

    const apartment = await db.Canho.findByPk(id);
    if (!apartment) {
      return res.status(404).json({
        message: 'Không tìm thấy căn hộ'
      });
    }

    // Check if apartment number already exists (excluding current apartment)
    if (soPhong && parseInt(soPhong) !== apartment.soPhong) {
      const existingApartment = await db.Canho.findOne({
        where: { 
          soPhong: parseInt(soPhong),
          id: { [Op.ne]: id }
        }
      });

      if (existingApartment) {
        return res.status(400).json({
          message: 'Số phòng đã tồn tại'
        });
      }
    }

    // Validate household exists if provided
    if (hoKhauId !== undefined) {
      if (hoKhauId !== null) {
        const hoKhau = await db.HoKhau.findByPk(hoKhauId);
        if (!hoKhau) {
          return res.status(404).json({
            message: 'Không tìm thấy hộ khẩu'
          });
        }

        // Check if household already has an apartment (excluding current)
        const existingAssignment = await db.Canho.findOne({
          where: { 
            hoKhauId,
            id: { [Op.ne]: id }
          }
        });

        if (existingAssignment) {
          return res.status(400).json({
            message: 'Hộ khẩu đã được gán căn hộ khác'
          });
        }
      }
    }

    // Update the apartment
    await apartment.update({
      soPhong: soPhong ? parseInt(soPhong) : apartment.soPhong,
      hoKhauId: hoKhauId !== undefined ? hoKhauId : apartment.hoKhauId,
      dienTich: dienTich !== undefined ? dienTich : apartment.dienTich
    });

    // Fetch updated apartment with associations
    const updatedApartment = await db.Canho.findByPk(id, {
      include: [{
        model: db.HoKhau,
        as: 'hoKhau',
        required: false,
        include: [{
          model: db.NhanKhau,
          as: 'chuHoInfo',
          attributes: ['id', 'hoTen', 'cccd']
        }]
      }]
    });

    return res.status(200).json({
      message: 'Cập nhật căn hộ thành công',
      apartment: updatedApartment
    });

  } catch (error) {
    console.error('Error updating apartment:', error);
    return res.status(500).json({
      message: 'Lỗi server khi cập nhật căn hộ',
      error: error.message
    });
  }
};

// Delete apartment
const deleteCanho = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await db.Canho.findByPk(id);
    if (!apartment) {
      return res.status(404).json({
        message: 'Không tìm thấy căn hộ'
      });
    }

    // Check if apartment is occupied
    if (apartment.hoKhauId) {
      return res.status(400).json({
        message: 'Không thể xóa căn hộ đang có người ở'
      });
    }

    await apartment.destroy();

    return res.status(200).json({
      message: 'Xóa căn hộ thành công'
    });

  } catch (error) {
    console.error('Error deleting apartment:', error);
    return res.status(500).json({
      message: 'Lỗi server khi xóa căn hộ',
      error: error.message
    });
  }
};

// Assign household to apartment
const assignHoKhauToCanho = async (req, res) => {
  try {
    const { apartmentId, hoKhauId } = req.body;

    if (!apartmentId || !hoKhauId) {
      return res.status(400).json({
        message: 'Thiếu thông tin bắt buộc: apartmentId, hoKhauId'
      });
    }

    const apartment = await db.Canho.findByPk(apartmentId);
    if (!apartment) {
      return res.status(404).json({
        message: 'Không tìm thấy căn hộ'
      });
    }

    const hoKhau = await db.HoKhau.findByPk(hoKhauId);
    if (!hoKhau) {
      return res.status(404).json({
        message: 'Không tìm thấy hộ khẩu'
      });
    }

    // Check if apartment is already occupied
    if (apartment.hoKhauId) {
      return res.status(400).json({
        message: 'Căn hộ đã có người ở'
      });
    }

    // Check if household already has an apartment
    const existingAssignment = await db.Canho.findOne({
      where: { hoKhauId }
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: 'Hộ khẩu đã được gán căn hộ khác'
      });
    }

    // Assign household to apartment
    await apartment.update({ hoKhauId });

    // Fetch updated apartment with associations
    const updatedApartment = await db.Canho.findByPk(apartmentId, {
      include: [{
        model: db.HoKhau,
        as: 'hoKhau',
        include: [{
          model: db.NhanKhau,
          as: 'chuHoInfo',
          attributes: ['id', 'hoTen', 'cccd']
        }]
      }]
    });

    return res.status(200).json({
      message: 'Gán hộ khẩu vào căn hộ thành công',
      apartment: updatedApartment
    });

  } catch (error) {
    console.error('Error assigning household to apartment:', error);
    return res.status(500).json({
      message: 'Lỗi server khi gán hộ khẩu vào căn hộ',
      error: error.message
    });
  }
};

// Remove household from apartment
const removeHoKhauFromCanho = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await db.Canho.findByPk(id);
    if (!apartment) {
      return res.status(404).json({
        message: 'Không tìm thấy căn hộ'
      });
    }

    if (!apartment.hoKhauId) {
      return res.status(400).json({
        message: 'Căn hộ chưa có người ở'
      });
    }

    // Remove household from apartment
    await apartment.update({ hoKhauId: null });

    return res.status(200).json({
      message: 'Hủy gán hộ khẩu khỏi căn hộ thành công'
    });

  } catch (error) {
    console.error('Error removing household from apartment:', error);
    return res.status(500).json({
      message: 'Lỗi server khi hủy gán hộ khẩu khỏi căn hộ',
      error: error.message
    });
  }
};

// Get apartment statistics
const getCanhoStatistics = async (req, res) => {
  try {
    // Get total apartments
    const totalApartments = await db.Canho.count();

    // Get occupied apartments
    const occupiedApartments = await db.Canho.count({
      where: { hoKhauId: { [Op.ne]: null } }
    });

    // Get vacant apartments
    const vacantApartments = await db.Canho.count({
      where: { hoKhauId: { [Op.eq]: null } }
    });

    // Get apartment size distribution
    const sizeDistribution = await db.Canho.findAll({
      attributes: [
        [db.sequelize.fn('CASE',
          db.sequelize.where(db.sequelize.col('dienTich'), '<', 50), 'Nhỏ (<50m²)',
          db.sequelize.where(db.sequelize.col('dienTich'), 'BETWEEN', 50, 80), 'Trung bình (50-80m²)',
          db.sequelize.where(db.sequelize.col('dienTich'), '>', 80), 'Lớn (>80m²)',
          'Chưa xác định'
        ), 'size_category'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: [db.sequelize.fn('CASE',
        db.sequelize.where(db.sequelize.col('dienTich'), '<', 50), 'Nhỏ (<50m²)',
        db.sequelize.where(db.sequelize.col('dienTich'), 'BETWEEN', 50, 80), 'Trung bình (50-80m²)',
        db.sequelize.where(db.sequelize.col('dienTich'), '>', 80), 'Lớn (>80m²)',
        'Chưa xác định'
      )]
    });

    return res.status(200).json({
      totalApartments,
      occupiedApartments,
      vacantApartments,
      occupancyRate: totalApartments > 0 ? ((occupiedApartments / totalApartments) * 100).toFixed(2) : 0,
      sizeDistribution: sizeDistribution.map(stat => ({
        category: stat.dataValues.size_category,
        count: parseInt(stat.dataValues.count)
      }))
    });

  } catch (error) {
    console.error('Error getting apartment statistics:', error);
    return res.status(500).json({
      message: 'Lỗi server khi lấy thống kê căn hộ',
      error: error.message
    });
  }
};

module.exports = {
  getAllCanho,
  getCanhoById,
  createCanho,
  updateCanho,
  deleteCanho,
  assignHoKhauToCanho,
  removeHoKhauFromCanho,
  getCanhoStatistics
};
