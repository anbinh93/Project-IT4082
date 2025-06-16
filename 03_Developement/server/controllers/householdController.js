const { HoKhau, NhanKhau, ThanhVienHoKhau, Sequelize } = require('../db/models');
const { Op } = Sequelize;

const householdController = {
  // Get household details by ID with members
  async getHouseholdById(req, res) {
    try {
      const { id } = req.params;
      
      const household = await HoKhau.findByPk(id, {
        include: [
          {
            model: NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen', 'ngaySinh', 'gioiTinh', 'cccd', 'danToc', 'ngheNghiep']
          },
          {
            model: ThanhVienHoKhau,
            as: 'thanhVien',
            include: [
              {
                model: NhanKhau,
                as: 'nhanKhau',
                attributes: ['id', 'hoTen', 'ngaySinh', 'gioiTinh', 'cccd', 'danToc', 'ngheNghiep', 'tonGiao', 'noiCap', 'ngayCap']
              }
            ]
          }
        ]
      });

      if (!household) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hộ khẩu'
        });
      }

      // Format response data
      const householdData = {
        id: household.soHoKhau, // Use soHoKhau as the ID
        maHoKhau: `HK${household.soHoKhau.toString().padStart(3, '0')}`, // Format as HK001, HK002, etc.
        chuHoId: household.chuHo,
        diaChi: `${household.soNha}, ${household.duong}, ${household.phuong}, ${household.quan}, ${household.thanhPho}`,
        ngayLap: household.ngayLamHoKhau,
        lyDoTao: 'Hộ khẩu thường trú', // Default value since it's not in the model
        chuHo: household.chuHoInfo,
        thanhVien: household.thanhVien?.map(tv => ({
          id: tv.nhanKhauId,
          quanHeVoiChuHo: tv.quanHeVoiChuHo,
          ngayVaoHo: tv.ngayThemNhanKhau,
          ngayRoiHo: null, // Not implemented yet
          lyDoRoiHo: null, // Not implemented yet
          nhanKhau: tv.nhanKhau
        })) || []
      };

      res.json({
        success: true,
        data: householdData
      });
    } catch (error) {
      console.error('Error fetching household:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin hộ khẩu',
        error: error.message
      });
    }
  },

  // Create new household
  async createHousehold(req, res) {
    try {
      const { chuHoId, diaChi, ngayLap, soPhong } = req.body;

      // Validate required fields - chủ hộ không bắt buộc
      if (!diaChi) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: địa chỉ'
        });
      }

      let validatedChuHoId = null;

      // Kiểm tra chủ hộ nếu có
      if (chuHoId) {
        // Check if resident exists
        const resident = await NhanKhau.findByPk(chuHoId);
        if (!resident) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy nhân khẩu được chọn làm chủ hộ'
          });
        }

        // Check if resident is already head of another household
        const existingAsHead = await HoKhau.findOne({
          where: { chuHo: chuHoId }
        });

        if (existingAsHead) {
          return res.status(400).json({
            success: false,
            message: 'Nhân khẩu này đang là chủ hộ của một hộ khẩu khác'
          });
        }

        // Check if resident is already member of another household
        const existingMembership = await ThanhVienHoKhau.findOne({
          where: { nhanKhauId: chuHoId }
        });

        if (existingMembership) {
          return res.status(400).json({
            success: false,
            message: 'Nhân khẩu này đang thuộc về một hộ khẩu khác'
          });
        }

        validatedChuHoId = chuHoId;
      }

      // Parse address components
      const addressParts = diaChi.split(',').map(part => part.trim());
      
      // Create new household
      const householdData = {
        chuHo: validatedChuHoId, // Có thể null
        soNha: addressParts[0] || '',
        duong: addressParts[1] || '',
        phuong: addressParts[2] || 'Nhân Chính',
        quan: addressParts[3] || 'Thanh Xuân',
        thanhPho: addressParts[4] || 'Hà Nội',
        ngayLamHoKhau: ngayLap ? new Date(ngayLap) : new Date()
      };

      const newHousehold = await HoKhau.create(householdData);

      // Add the head of household as a member only if chuHoId exists
      if (validatedChuHoId) {
        await ThanhVienHoKhau.create({
          nhanKhauId: validatedChuHoId,
          hoKhauId: newHousehold.soHoKhau,
          quanHeVoiChuHo: 'chủ hộ',
          ngayThemNhanKhau: new Date()
        });
      }

      // Fetch the created household with full details
      const createdHousehold = await HoKhau.findByPk(newHousehold.soHoKhau, {
        include: [
          {
            model: NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen', 'cccd']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Tạo hộ khẩu thành công',
        data: {
          id: createdHousehold.soHoKhau,
          maHoKhau: `HK${createdHousehold.soHoKhau.toString().padStart(3, '0')}`,
          chuHoId: createdHousehold.chuHo,
          diaChi: `${createdHousehold.soNha}, ${createdHousehold.duong}, ${createdHousehold.phuong}, ${createdHousehold.quan}, ${createdHousehold.thanhPho}`,
          ngayLap: createdHousehold.ngayLamHoKhau,
          chuHo: createdHousehold.chuHoInfo
        }
      });

    } catch (error) {
      console.error('Error creating household:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo hộ khẩu',
        error: error.message
      });
    }
  },

  // Get all households with basic info
  async getAllHouseholds(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { soHoKhau: { [Op.like]: `%${search}%` } },
          { soNha: { [Op.like]: `%${search}%` } },
          { duong: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: households } = await HoKhau.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen', 'soDienThoai'] // Include số điện thoại
          },
          {
            model: ThanhVienHoKhau,
            as: 'thanhVien',
            include: [
              {
                model: NhanKhau,
                as: 'nhanKhau',
                attributes: ['id', 'hoTen', 'ngaySinh', 'gioiTinh']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['ngayLamHoKhau', 'DESC']]
      });

      // Format data for consistency with other endpoints
      const formattedHouseholds = households.map(household => ({
        ...household.toJSON(),
        soHoKhauFormatted: `HK${household.soHoKhau.toString().padStart(3, '0')}`,
        // Calculate total members count
        soThanhVien: household.thanhVien ? household.thanhVien.length : 0
      }));

      res.json({
        success: true,
        data: {
          households: formattedHouseholds,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching households:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách hộ khẩu',
        error: error.message
      });
    }
  },

  // Update household information
  async updateHousehold(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const household = await HoKhau.findByPk(id);
      if (!household) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hộ khẩu'
        });
      }

      await household.update(updateData);

      res.json({
        success: true,
        message: 'Cập nhật thông tin hộ khẩu thành công',
        data: household
      });
    } catch (error) {
      console.error('Error updating household:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật hộ khẩu',
        error: error.message
      });
    }
  },

  // Get available households for household separation
  async getAvailableHouseholds(req, res) {
    try {
      const households = await HoKhau.findAll({
        include: [
          {
            model: NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen']
          }
        ],
        attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan', 'thanhPho'],
        order: [['ngayLamHoKhau', 'DESC']]
      });

      // Format data for frontend
      const formattedHouseholds = households.map(household => ({
        id: household.soHoKhau,
        soHoKhau: `HK${household.soHoKhau.toString().padStart(3, '0')}`,
        diaChi: `${household.soNha}, ${household.duong}, ${household.phuong}, ${household.quan}, ${household.thanhPho}`,
        chuHoInfo: household.chuHoInfo
      }));

      res.json({
        success: true,
        data: formattedHouseholds
      });
    } catch (error) {
      console.error('Error fetching available households:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách hộ khẩu',
        error: error.message
      });
    }
  },

  // Assign head to existing household
  async assignHead(req, res) {
    try {
      const { householdId, newHeadId } = req.body;

      // Validate required fields
      if (!householdId || !newHeadId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: householdId và newHeadId'
        });
      }

      // Check if household exists
      const household = await HoKhau.findByPk(householdId);
      if (!household) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hộ khẩu'
        });
      }

      // Check if new head exists
      const newHead = await NhanKhau.findByPk(newHeadId);
      if (!newHead) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhân khẩu được chọn làm chủ hộ'
        });
      }

      // Check if the new head is already head of another household
      const existingAsHead = await HoKhau.findOne({
        where: { 
          chuHo: newHeadId,
          soHoKhau: { [Op.ne]: householdId }
        }
      });

      if (existingAsHead) {
        return res.status(400).json({
          success: false,
          message: 'Nhân khẩu này đang là chủ hộ của một hộ khẩu khác'
        });
      }

      // Check if the new head is a member of this household
      const membershipInThisHousehold = await ThanhVienHoKhau.findOne({
        where: { 
          nhanKhauId: newHeadId,
          hoKhauId: householdId
        }
      });

      // Check if the new head is a member of any other household
      const membershipInOtherHousehold = await ThanhVienHoKhau.findOne({
        where: { 
          nhanKhauId: newHeadId,
          hoKhauId: { [Op.ne]: householdId }
        }
      });

      if (membershipInOtherHousehold) {
        return res.status(400).json({
          success: false,
          message: 'Nhân khẩu này đang thuộc về một hộ khẩu khác'
        });
      }

      // Get current head info for response
      const currentHead = household.chuHo ? await NhanKhau.findByPk(household.chuHo) : null;

      // Update household head
      await household.update({ chuHo: newHeadId });

      // If the new head is already a member of this household, update their relationship
      if (membershipInThisHousehold) {
        await membershipInThisHousehold.update({ quanHeVoiChuHo: 'chủ hộ' });
      } else {
        // Add the new head as a member if they're not already in the household
        await ThanhVienHoKhau.create({
          nhanKhauId: newHeadId,
          hoKhauId: householdId,
          quanHeVoiChuHo: 'chủ hộ',
          ngayThemNhanKhau: new Date()
        });
      }

      // If there was a previous head, update their membership relationship to 'khác'
      if (currentHead) {
        await ThanhVienHoKhau.update(
          { quanHeVoiChuHo: 'khác' },
          { 
            where: { 
              nhanKhauId: currentHead.id,
              hoKhauId: householdId
            }
          }
        );
      }

      // Fetch updated household with full details
      const updatedHousehold = await HoKhau.findByPk(householdId, {
        include: [
          {
            model: NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen', 'cccd']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Gán chủ hộ thành công',
        data: {
          householdId: updatedHousehold.soHoKhau,
          maHoKhau: `HK${updatedHousehold.soHoKhau.toString().padStart(3, '0')}`,
          previousHead: currentHead ? {
            id: currentHead.id,
            hoTen: currentHead.hoTen
          } : null,
          newHead: {
            id: updatedHousehold.chuHoInfo.id,
            hoTen: updatedHousehold.chuHoInfo.hoTen,
            cccd: updatedHousehold.chuHoInfo.cccd
          },
          diaChi: `${updatedHousehold.soNha}, ${updatedHousehold.duong}, ${updatedHousehold.phuong}, ${updatedHousehold.quan}, ${updatedHousehold.thanhPho}`
        }
      });

    } catch (error) {
      console.error('Error assigning household head:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi gán chủ hộ',
        error: error.message
      });
    }
  }
};

module.exports = householdController;
